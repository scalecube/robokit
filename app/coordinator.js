const cfg = require('./config')
const cache = require('./cache')
const ctx = require('./context')
const checkRun = require('./check-run')
const deployment = require('./deployment')
const env = require('./environment')

async function handle (context) {
  const deploy = await buildDeployCtx(context)
  console.log(deploy.check_run_name)

  if (context.user_action === 'cancel_deploy_now') {
    if (context.payload.check_run?.external_id) {
      checkRun.setStatus(context.octokit, deploy, 'cancelled', cfg.deploy.check.canceled)
    }
    return
  }

  if (!isKnownBranch(deploy) && !deploy.release) return
  if (!shouldTrigger(deploy, context.user_action)) return

  const deployBranch = { ...deploy, check_run_name: cfg.deploy.check.name }
  if (!deploy.release) deployBranch.namespace = deploy.branch_name

  execute(context, deployBranch).catch(err => printError('Unhandled execute error', err))
}

const shouldTrigger = (deploy, userAction) =>
  userAction === 'deploy_now' || isRobokitTrigger(deploy) || isRobokitRelease(deploy)

async function execute (context, deploy) {
  const [startRes] = await checkRun.setStatus(context.octokit, deploy, 'in_progress', cfg.deploy.check.starting)
  deploy.check_run_id = startRes.data.id

  let ghDeploy
  try {
    ghDeploy = await deployment.create(context.octokit, deploy)
  } catch (err) {
    return cancelDeploy(context.octokit, deploy, err)
  }
  deploy.deployment_id = ghDeploy.data.id

  const log = []
  const succeeded = await new Promise(resolve => {
    env.deploy(deploy).subscribe({
      next: resp => { log.push(resp.d); deploy.details = log },
      error: err => {
        const output = { ...cfg.deploy.check.canceled, text: `${cfg.deploy.check.canceled.text}\n reason: ${err.d?.errorMessage}` }
        checkRun.setStatus(context.octokit, deploy, 'cancelled', output)
          .then(([r]) => { deploy.check_run_id = r.data.id })
        deployment.setStatus(context.octokit, deploy, 'inactive')
        resolve(false)
      },
      complete: () => resolve(true)
    })
  })

  if (!succeeded) return

  console.log('Stream completed, updating status')
  const finalStatus = checkRun.tail(log).status
  const [r] = await checkRun.setStatusFromLog(context.octokit, deploy, log, finalStatus)
  deploy.check_run_id = r.data.id
  deployment.setStatus(context.octokit, deploy, deployment.githubState(finalStatus))
}

async function cancelDeploy (octokit, deploy, err) {
  printError(err.message, err)
  const cancel = { ...cfg.deploy.check.canceled }
  if (err.code === 403 && err.message === 'Resource not accessible by integration') {
    const url = `https://github.com/${deploy.owner}/${deploy.repo}/settings/installations`
    cancel.text = `Robokit Github Application requires permissions to create deployments\n ${url}\n ${err.request?.url} \n ${err.documentation_url}`
  } else {
    cancel.text = `${cancel.text}\n error message: ${err.message}`
  }
  await checkRun.setStatus(octokit, deploy, 'cancelled', cancel)
}

async function buildDeployCtx (context) {
  let deploy = {}
  if (context.payload.check_run) {
    deploy = ctx.fromCheckRun(context)
    await tryReleaseVersion(deploy)
  } else if (context.payload.release) {
    deploy = ctx.fromRelease(context)
  }
  deploy.namespace = ctx.targetNamespace(deploy)
  deploy.id = context.id
  deploy.user = context.payload.sender.login
  deploy.avatar = context.payload.sender.avatar_url
  deploy.node_id = context.payload.installation.node_id
  return deploy
}

async function tryReleaseVersion (deploy) {
  if (process.env.LOCAL_DEV) { deploy.release = false; return }
  try {
    const octokit = cache.get(deploy.owner, deploy.repo)
    const res = await octokit.request(`GET /repos/${deploy.owner}/${deploy.repo}/releases/tags/${deploy.branch_name}`)
    const release = res.data
    deploy.branch_name = release.target_commitish
    deploy.release = true
    deploy.prerelease = release.prerelease
    deploy.tag_name = release.tag_name.replace(/^v/, '')
    deploy.draft = release.draft
    deploy.release_id = release.id
    console.log('Release Version')
  } catch (e) {
    deploy.release = false
    console.log(`No release tag for ${deploy.branch_name}: ${e.message}`)
  }
}

function isKnownBranch (deploy) {
  return deploy.branch_name === 'develop' || deploy.branch_name === 'master'
}

function isRobokitTrigger (deploy) {
  return deploy.check_run_name === cfg.ROBOKIT_DEPLOY && deploy.status === 'completed' && deploy.conclusion === 'success'
}

function isRobokitRelease (deploy) {
  return deploy.check_run_name === cfg.ROBOKIT_RELEASE_CHECK && deploy.status === 'completed' && deploy.conclusion === 'success'
}

function onInstall (context) {
  if (context.payload.action !== 'created') return
  const owner = context.payload.installation.account.login
  context.payload.repositories?.forEach(repo => cache.set(owner, repo.name, context.octokit))
}

function printError (message, err) {
  console.error(message)
  const out = {
    message: err?.message,
    name: err?.name,
    code: err?.code,
    errno: err?.errno,
    syscall: err?.syscall,
    isAxiosError: !!err?.isAxiosError,
    request: { method: err?.config?.method, url: err?.config?.url ?? err?.config?.baseURL, timeout: err?.config?.timeout }
  }
  if (err?.response) {
    out.response = { status: err.response.status, statusText: err.response.statusText, headers: err.response.headers, data: err.response.data }
  } else if (err?.request) {
    out.response = null
  }
  console.dir(out, { depth: null, colors: true })
}

module.exports = { handle, onInstall, isKnownBranch }
