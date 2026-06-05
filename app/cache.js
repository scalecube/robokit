const store = new Map()
const key = (owner, repo) => `${owner}/${repo}`

module.exports = {
  set: (owner, repo, ctx) => store.set(key(owner, repo), ctx),
  get: (owner, repo) => store.get(key(owner, repo))
}
