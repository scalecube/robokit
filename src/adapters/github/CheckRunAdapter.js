const cfg = require('../../config')
const registry = require('./OctokitRegistry')
const renderer = require('../../templates/renderer')
const { toGitHub, toMarker } = require('../../domain/PipelineStatus')
const logger = require('../../logger')

async function upsert (octokit, context, checkRunId, check) {
  const s = check.conclusion ? `${check.status}/${check.conclusion}` : check.status
  logger.info({ repo: `${check.owner}/${check.repo}`, name: check.name, status: s }, 'github.check-run.upsert')
  const client = octokit ?? registry.get(check.owner, check.repo)
  if (checkRunId) {
    return client.checks.update({
      check_run_id: checkRunId,
      owner: check.owner,
      repo: check.repo,
      status: check.status,
      conclusion: check.conclusion,
      completed_at: check.completed_at,
      started_at: check.started_at,
      output: check.output,
      actions: check.actions
    })
  }
  return client.checks.create(check)
}

function buildInitialCheck (context, status) {
  const check = {
    name: context.checkRunName,
    owner: context.owner,
    repo: context.repo,
    head_sha: context.sha,
    status
  }
  if (status === 'completed') {
    check.conclusion = 'success'
    check.completed_at = new Date().toISOString()
    check.actions = cfg.userActions.done
  } else if (status === 'cancelled') {
    check.status = 'completed'
    check.conclusion = 'cancelled'
    check.actions = cfg.userActions.done
  } else if (status === 'in_progress') {
    check.started_at = new Date().toISOString()
  }
  return check
}

function buildCheckFromLog (context, log, envStatus) {
  const first = log[0]
  const last = log[log.length - 1]
  const { status, conclusion } = toGitHub(envStatus)
  const durationSeconds = Math.round((new Date(last.timestamp) - new Date(first.timestamp)) / 1000)
  const vars = {
    owner: context.owner,
    repo: context.repo,
    sha: context.sha,
    branch: context.branch,
    namespace: context.namespace ?? '',
    user: context.user,
    progress: envStatus,
    duration: `${durationSeconds}s`,
    log_details: toLogDetails(log),
    conclusion: conclusion ?? 'in_progress'
  }
  const check = {
    name: context.checkRunName,
    owner: context.owner,
    repo: context.repo,
    head_sha: context.sha,
    status,
    external_id: first.id,
    output: {
      title: envStatus,
      summary: `Continuous Delivery pipeline: ${conclusion ?? 'in_progress'}`,
      text: renderer.render('status', vars)
    }
  }
  if (conclusion) {
    try {
      check.started_at = new Date(first.timestamp).toISOString()
      check.completed_at = new Date(last.timestamp).toISOString()
    } catch (e) {
      logger.warn({ err: e.message }, 'check-run.timestamp-parse-failed')
    }
    check.conclusion = conclusion
    check.actions = cfg.userActions.done
  } else {
    check.actions = cfg.userActions.inProgress
  }
  return check
}

function toLogDetails (log) {
  let details = ''
  for (let i = 0; i < log.length; i++) {
    const entry = log[i]
    const message = JSON.stringify(entry.data, null, 2)
    const status = i < log.length - 1 ? 'SUCCESS' : entry.status
    if (message !== undefined) {
      for (const line of message.split(/\r?\n/)) {
        details += `${toMarker(status)} ${line.replace(/(\r\n|\r|\n)/g, ' ')} \n`
      }
    }
  }
  return details
}

async function setStatus (octokit, context, checkRunId, status, output) {
  const check = buildInitialCheck(context, status)
  check.output = output
  return upsert(octokit, context, checkRunId, check)
}

async function setStatusFromLog (octokit, context, checkRunId, log, envStatus) {
  const check = buildCheckFromLog(context, log, envStatus)
  return upsert(octokit, context, checkRunId, check)
}

module.exports = { setStatus, setStatusFromLog }
