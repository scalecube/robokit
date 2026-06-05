const cfg = require('./config')
const templates = require('./statuses/templates')
const cache = require('./cache')

async function create (octokit, checks) {
  if (process.env.LOCAL_DEV) {
    console.log('LOCAL_DEV mock createCheckRun: ' + checks.map(c => c.name).join(', '))
    return checks.map((_, i) => ({ data: { id: Date.now() + i } }))
  }
  return Promise.all(checks.map(check => {
    const client = octokit ?? cache.get(check.owner, check.repo)
    console.log('>>>> UPDATE GITHUB JOB STATUS  >>>> \n' + JSON.stringify(check))
    return client.checks.create(check)
  }))
}

function buildCheck (deploy, status) {
  const result = {
    name: deploy.check_run_name,
    owner: deploy.owner,
    repo: deploy.repo,
    head_sha: deploy.sha,
    status
  }
  if (deploy.external_id) result.external_id = deploy.external_id
  if (status === 'completed') {
    result.conclusion = 'success'
    result.completed_at = new Date().toISOString()
    result.actions = cfg.user_actions.done
  } else if (status === 'cancelled') {
    result.status = 'completed'
    result.conclusion = 'cancelled'
    result.actions = cfg.user_actions.done
  } else if (status === 'in_progress') {
    result.started_at = new Date().toISOString()
  }
  return result
}

function buildOutput (template, log, deploy) {
  const startDate = new Date(head(log).timestamp)
  const endDate = new Date(tail(log).timestamp)
  const duration = Math.round((endDate - startDate) / 1000)
  const status = tail(log).status
  let md = templates.get(template.template)
  Object.entries(deploy).forEach(([k, v]) => { md = md.split('${' + k + '}').join(v) })
  // eslint-disable-next-line no-template-curly-in-string
  md = md.split('${progress}').join(status)
  // eslint-disable-next-line no-template-curly-in-string
  md = md.split('${duration}').join(duration + 's')
  // eslint-disable-next-line no-template-curly-in-string
  md = md.split('${log_details}').join('> DATE: ' + startDate + '\n' + toDetails(log))
  return {
    title: status,
    summary: template.summary.replace('${conclusion}', logStatus(tail(log).status).conclusion),
    text: md
  }
}

function buildChecksFromLog (deploy, log, status) {
  const startDate = new Date(head(log).timestamp)
  const endDate = new Date(tail(log).timestamp)
  const s = logStatus(status)
  const check = {
    name: deploy.check_run_name,
    owner: deploy.owner,
    repo: deploy.repo,
    head_sha: deploy.sha,
    status: s.status,
    output: buildOutput(cfg.deploy.check.update, log, deploy),
    external_id: log[0].id
  }
  if (s.conclusion) {
    try {
      check.completed_at = endDate.toISOString()
      check.started_at = startDate.toISOString()
    } catch (e) {
      console.warn('Could not parse log timestamps:', e.message)
    }
    check.conclusion = s.conclusion
    check.actions = cfg.user_actions.done
  } else {
    check.actions = cfg.user_actions.in_progress
  }
  return [check]
}

async function setStatus (octokit, deploy, status, output) {
  const check = buildCheck(deploy, status)
  check.output = output
  return create(octokit, [check])
}

async function setStatusFromLog (octokit, deploy, log, status) {
  return create(octokit, buildChecksFromLog(deploy, log, status))
}

function logStatus (status) {
  if (status === 'SUCCEEDED' || status === 'SUCCESS') return { status: 'completed', conclusion: 'success' }
  if (status === 'TERMINAL' || status === 'FAILED_CONTINUE' || status === 'ERROR') return { status: 'completed', conclusion: 'failure' }
  if (status === 'CANCELLED' || status === 'PAUSED' || status === 'SUSPENDED') return { status: 'completed', conclusion: 'cancelled' }
  return { status: 'in_progress' }
}

function tail (log) { return log[log.length - 1] }
function head (log) { return log[0] }

function toDetails (logs) {
  let details = ''
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i]
    const message = JSON.stringify(log.data, null, 2)
    const status = i < logs.length - 1 ? 'SUCCESS' : log.status
    if (message !== undefined) {
      for (const line of message.split(/\r?\n/)) {
        details += `${marker(status)} ${line.replace(/(\r\n|\r|\n)/g, ' ')} \n`
      }
    }
  }
  return details
}

function marker (status) {
  if (status === 'SUCCEEDED' || status === 'SUCCESS') return '>'
  if (status === 'TERMINAL' || status === 'FAILED_CONTINUE' || status === 'ERROR') return '<'
  if (status === 'CANCELED' || status === 'PAUSED' || status === 'SUSPENDED') return '#'
  if (status === 'RUNNING') return '*'
  return ' '
}

module.exports = { setStatus, setStatusFromLog, logStatus, tail }
