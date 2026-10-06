class DeploymentContext {
  constructor (fields) {
    const {
      owner, repo, sha, branch, namespace,
      checkRunName, status, conclusion,
      user, avatar, installationNodeId, eventId,
      release, prerelease, tagName, releaseId, draft
    } = fields
    this.owner = owner
    this.repo = repo
    this.sha = sha
    this.branch = branch
    this.namespace = namespace ?? null
    this.checkRunName = checkRunName
    this.status = status ?? null
    this.conclusion = conclusion ?? null
    this.user = user
    this.avatar = avatar
    this.installationNodeId = installationNodeId
    this.eventId = eventId
    this.release = release ?? false
    this.prerelease = prerelease ?? false
    this.tagName = tagName ?? null
    this.releaseId = releaseId ?? null
    this.draft = draft ?? false
    Object.freeze(this)
  }

  withCheckRunName (name) {
    return new DeploymentContext({ ...this, checkRunName: name })
  }

  withNamespace (namespace) {
    return new DeploymentContext({ ...this, namespace })
  }
}

module.exports = { DeploymentContext }
