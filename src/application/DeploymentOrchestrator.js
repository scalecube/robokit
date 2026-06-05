const cfg = require('../config')
const registry = require('../adapters/github/OctokitRegistry')
const checkRunAdapter = require('../adapters/github/CheckRunAdapter')
const deploymentAdapter = require('../adapters/github/DeploymentAdapter')
const { DeploymentContext } = require('../domain/DeploymentContext')
const policy = require('../domain/DeploymentPolicy')
const { withLock } = require('./deploymentLock')
const logger = require('../logger')

let cdService

function setCdService (service) {
  cdService = service
}

async function handle (probotContext, userAction) {
  const context = await buildContext(probotContext)
  const log = logger.child({
    deployId: context.eventId,
    repo: `${context.owner}/${context.repo}`,
    branch: context.branch,
    sha: context.sha ? context.sha.slice(0, 8) : '?'
  })

  const actionDecision = policy.evaluateUserAction(userAction)

  if (actionDecision.cancel) {
    if (probotContext.payload.check_run?.external_id) {
      await checkRunAdapter.setStatus(probotContext.octokit, context, null, 'cancelled', cfg.checkRunTemplates.cancelled)
    }
    return
  }

  if (actionDecision.deploy) {
    log.info({ trigger: 'user:deploy_now' }, 'deploy.trigger')
    const deployContext = context
      .withCheckRunName(cfg.deployCheckName)
      .withNamespace(context.release ? '' : context.branch)
    await withLock(`${context.owner}/${context.repo}:${context.branch}`, () =>
      runPipeline(probotContext.octokit, deployContext, log)
    )
    return
  }

  const decision = policy.evaluate(context)
  log.info({ decision: decision.reason }, 'deploy.evaluate')
  if (!decision.deploy) return

  const deployContext = context
    .withCheckRunName(cfg.deployCheckName)
    .withNamespace(context.release ? '' : context.branch)

  await withLock(`${context.owner}/${context.repo}:${context.branch}`, () =>
    runPipeline(probotContext.octokit, deployContext, log)
  )
}

async function runPipeline (octokit, context, log) {
  const state = { checkRunId: null, deploymentId: null }

  const startRes = await checkRunAdapter.setStatus(
    octokit, context, null, 'in_progress', cfg.checkRunTemplates.starting
  )
  state.checkRunId = startRes.data.id
  log.info({ checkRunId: state.checkRunId }, 'check-run.created')

  let deploymentRes
  try {
    deploymentRes = await deploymentAdapter.create(octokit, context)
  } catch (err) {
    return cancelPipeline(octokit, context, state, err, log)
  }
  state.deploymentId = deploymentRes.data.id
  log.info({ deploymentId: state.deploymentId }, 'github-deployment.created')

  const succeeded = await streamDeploy(octokit, context, state, log)
  if (!succeeded) return

  const finalStatus = state.lastEnvStatus
  await checkRunAdapter.setStatusFromLog(octokit, context, state.checkRunId, state.log, finalStatus)
  await deploymentAdapter.setStatus(octokit, context, state.checkRunId, state.deploymentId, deploymentAdapter.toGitHubState(finalStatus))
  log.info({ finalStatus }, 'deploy.complete')
}

function streamDeploy (octokit, context, state, log) {
  state.log = []
  return new Promise(resolve => {
    cdService.deploy(context).subscribe({
      next: resp => {
        state.log.push(resp.d)
        state.lastEnvStatus = resp.d.status
        log.info({ status: resp.d.status, message: resp.d.data?.message ?? '' }, 'cd-service.event')
        checkRunAdapter
          .setStatusFromLog(octokit, context, state.checkRunId, state.log, resp.d.status)
          .catch(err => log.error({ err }, 'check-run.stream-update-failed'))
      },
      error: err => {
        log.error({ err }, 'cd-service.stream-error')
        const output = {
          ...cfg.checkRunTemplates.cancelled,
          text: `${cfg.checkRunTemplates.cancelled.text}\nreason: ${err.d?.errorMessage ?? err.message}`
        }
        checkRunAdapter
          .setStatus(octokit, context, state.checkRunId, 'cancelled', output)
          .then(res => { state.checkRunId = res.data.id })
        deploymentAdapter.setStatus(octokit, context, state.checkRunId, state.deploymentId, 'inactive')
        resolve(false)
      },
      complete: () => {
        log.info('cd-service.stream-complete')
        resolve(true)
      }
    })
  })
}

async function cancelPipeline (octokit, context, state, err, log) {
  log.error({ err }, 'deploy.cancelled')
  const output = { ...cfg.checkRunTemplates.cancelled }
  if (err.status === 403 && err.message === 'Resource not accessible by integration') {
    const url = `https://github.com/${context.owner}/${context.repo}/settings/installations`
    output.text = `Robokit GitHub App requires permission to create deployments\n${url}`
  } else {
    output.text = `${output.text}\nerror: ${err.message}`
  }
  await checkRunAdapter.setStatus(octokit, context, state.checkRunId, 'cancelled', output)
}

async function buildContext (probotContext) {
  const { payload } = probotContext
  const repo = payload.repository
  const sender = payload.sender
  const installation = payload.installation

  if (payload.check_run) {
    const cr = payload.check_run
    const releaseFields = await resolveRelease(
      probotContext.octokit, repo.owner.login, repo.name, cr.check_suite?.head_branch
    )
    return new DeploymentContext({
      owner: repo.owner.login,
      repo: repo.name,
      sha: cr.head_sha,
      branch: releaseFields.branch ?? cr.check_suite?.head_branch,
      checkRunName: cr.name,
      status: cr.status,
      conclusion: cr.conclusion,
      user: sender.login,
      avatar: sender.avatar_url,
      installationNodeId: installation.node_id,
      eventId: probotContext.id,
      ...releaseFields
    })
  }

  if (payload.release) {
    const r = payload.release
    return new DeploymentContext({
      owner: repo.owner.login,
      repo: repo.name,
      sha: r.target_commitish,
      branch: r.tag_name,
      namespace: '',
      checkRunName: cfg.robokitReleaseCheck,
      status: 'completed',
      conclusion: 'success',
      user: sender.login,
      avatar: sender.avatar_url,
      installationNodeId: installation.node_id,
      eventId: probotContext.id,
      release: true,
      prerelease: r.prerelease,
      tagName: r.tag_name.replace(/^v/, ''),
      releaseId: r.id,
      draft: r.draft
    })
  }

  throw new Error('Unsupported event: payload contains neither check_run nor release')
}

async function resolveRelease (octokit, owner, repo, branch) {
  if (cfg.isLocalDev || !branch) return { release: false }
  try {
    const res = await octokit.request(`GET /repos/${owner}/${repo}/releases/tags/${branch}`)
    const r = res.data
    logger.info({ owner, repo, tag: r.tag_name }, 'release.detected')
    return {
      release: true,
      branch: r.target_commitish,
      prerelease: r.prerelease,
      tagName: r.tag_name.replace(/^v/, ''),
      releaseId: r.id,
      draft: r.draft
    }
  } catch {
    return { release: false }
  }
}

function onInstall (probotContext) {
  if (probotContext.payload.action !== 'created') return
  const owner = probotContext.payload.installation.account.login
  probotContext.payload.repositories?.forEach(repo =>
    registry.register(owner, repo.name, probotContext.octokit)
  )
}

module.exports = { handle, onInstall, setCdService }
