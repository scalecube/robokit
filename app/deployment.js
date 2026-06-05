function toPayload (deploy, state) {
  const d = {
    task: 'deploy',
    auto_merge: false,
    payload: deploy,
    owner: deploy.owner,
    repo: deploy.repo,
    ref: deploy.branch_name,
    required_contexts: []
  }
  if (state) d.state = state
  if (state === 'inactive') {
    d.headers = { accept: 'application/vnd.github.ant-man-preview+json' }
  } else if (state === 'in_progress' || state === 'queued') {
    d.headers = { accept: 'application/vnd.github.flash-preview+json' }
  }
  return d
}

async function create (octokit, deploy) {
  if (process.env.LOCAL_DEV) {
    console.log('LOCAL_DEV mock createDeployment: ' + deploy.owner + '/' + deploy.repo)
    return { data: { id: Date.now() } }
  }
  const d = toPayload(deploy)
  d.environment = deploy.namespace
  return octokit.repos.createDeployment(d)
}

async function setStatus (octokit, deploy, state) {
  if (process.env.LOCAL_DEV) {
    console.log('LOCAL_DEV mock deploymentStatus: ' + state)
    return { data: {} }
  }
  const d = toPayload(deploy, state)
  d.deployment_id = deploy.deployment_id
  d.description = 'Deployment status: ' + state
  d.log_url = `https://github.com/${deploy.owner}/${deploy.repo}/runs/${deploy.check_run_id}`
  d.environment_url = process.env.DEPLOYMENT_URL
  return octokit.repos.createDeploymentStatus(d)
}

function githubState (envStatus) {
  if (envStatus === 'ERROR') return 'error'
  if (envStatus === 'SUCCESS') return 'success'
  return 'in_progress'
}

module.exports = { create, setStatus, githubState }
