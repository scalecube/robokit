const logger = require('../../logger')

const registry = new Map()
const key = (owner, repo) => `${owner}/${repo}`

function register (owner, repo, octokit) {
  registry.set(key(owner, repo), octokit)
}

function get (owner, repo) {
  const octokit = registry.get(key(owner, repo))
  if (!octokit) logger.warn({ owner, repo }, 'octokit-registry.miss')
  return octokit
}

module.exports = { register, get }
