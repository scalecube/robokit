const logger = require('../../logger')
const cfg = require('../../config')

async function create (octokit, context) {
  logger.info({ owner: context.owner, repo: context.repo, env: context.namespace }, 'github.deployment.create')
  return octokit.repos.createDeployment({
    task: 'deploy',
    auto_merge: false,
    payload: {},
    owner: context.owner,
    repo: context.repo,
    ref: context.branch,
    environment: context.namespace,
    required_contexts: []
  })
}

async function setStatus (octokit, context, checkRunId, deploymentId, state) {
  logger.info({ state, deploymentId }, 'github.deployment.set-status')
  return octokit.repos.createDeploymentStatus({
    owner: context.owner,
    repo: context.repo,
    deployment_id: deploymentId,
    state,
    description: `Deployment: ${state}`,
    log_url: `https://github.com/${context.owner}/${context.repo}/runs/${checkRunId}`,
    environment_url: cfg.deploymentUrl || undefined
  })
}

function toGitHubState (envStatus) {
  if (envStatus === 'ERROR') return 'error'
  if (envStatus === 'SUCCESS' || envStatus === 'SUCCEEDED') return 'success'
  return 'in_progress'
}

module.exports = { create, setStatus, toGitHubState }
