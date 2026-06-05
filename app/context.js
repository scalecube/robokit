function fromCheckRun (context) {
  return {
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    branch_name: context.payload.check_run.check_suite.head_branch,
    sha: context.payload.check_run.head_sha,
    check_run_name: context.payload.check_run.name,
    conclusion: context.payload.check_run.conclusion,
    status: context.payload.check_run.status,
    action: context.payload.action
  }
}

function fromRelease (context) {
  return {
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    ...context.payload.release
  }
}

function targetNamespace (deploy) {
  if (deploy.prerelease || deploy.release) return ''
  if (deploy.branch_name === 'master' || deploy.branch_name === 'develop') return deploy.branch_name
  return undefined
}

module.exports = { fromCheckRun, fromRelease, targetNamespace }
