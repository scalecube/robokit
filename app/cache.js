const createScheduler = require('probot-scheduler')
const contexts = new Map()

class Cache {
  constructor (app) {
    createScheduler(app, {
      delay: false, // delay is enabled on first run
      interval: 15 * 60 * 1000 // 15 minutes
    })
  }

  set (owner, repo, ctx) {
    contexts.set(owner + '/' + repo, ctx)
  }

  get (owner, repo) {
    return contexts.get(owner + '/' + repo)
  }

  keys () {
    return contexts.keys()
  }
}
module.exports = Cache
