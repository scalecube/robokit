class GithubService {
  constructor (app, cache) {
    this.app = app
    this.cache = cache
  }

  async createCheckRun (octokit, checks) {
    const all = []
    for (const check of checks) {
      if (!octokit) octokit = this.cache.get(check.owner, check.repo)
      const p = octokit.checks.create(check)
      console.log('>>>> UPDATE GITHUB JOB STATUS  >>>> \n' + JSON.stringify(check))
      all.push(p)
    }
    return await Promise.all(all)
  }

  release (owner, repo, releaseId) {
    return new Promise((resolve, reject) => {
      const ctx = this.cache.get(owner, repo)
      if (!ctx) { return }
      // /repos/:owner/:repo/releases/tags/:tag
      // /repos/{owner}/{repo}/releases/tags/{tag}
      ctx.request(`GET /repos/${owner}/${repo}/releases/tags/${releaseId}`)
        .then(res => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  }

  //  POST /repos/:owner/:repo/labels
  //  Example:
  // {
  //   "name": "bug",
  //   "description": "Something isn't working",
  //   "color": "f29513"
  // }
  createLabel (owner, repo, label) {
    const github = this.cache.get(owner, repo)
    return github.request(`POST /repos/${owner}/${repo}/labels`, label)
  }

}

module.exports = GithubService
