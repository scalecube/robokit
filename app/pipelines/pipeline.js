const axios = require('axios')
const Stream = require('./stream')

class PipelineAPI {
  constructor (githubService) {
    const Notifications = require('./notifications')
    this.notifications = new Notifications(this, githubService)
  }

  install (owner, repo) {
    return this.execute({
      action_type: 'install',
      owner: owner,
      repo: repo
    })
  }

  uninstall (owner, repo) {
    return this.execute({
      action_type: 'uninstall',
      owner: owner,
      repo: repo
    })
  }

  cancel (pipelineId) {
    return this.execute({
      action_type: 'cancel',
      id: pipelineId
    })
  }

  execute (trigger) {
    const url = `${process.env.SPINLESS_URL}/kubernetes/deploy`
    console.log('>>>>> TRIGGER DEPLOY:\n POST ' + url + '\n' + JSON.stringify(trigger))
    return this.post(url, trigger)
  }

  status (owner, repo, id, callback) {
    const log = []
    const uri = `${process.env.SPINLESS_URL}/kubernetes/status/${owner}/${repo}/${id}`
    Stream.from(uri).on((event) => {
      return new Promise((resolve, reject) => {
        const events = event.split('\n')
        events.forEach(event => {
          try {
            if (event === 'EOF') {
              resolve(log)
            } else {
              log.push(JSON.parse(event))
              if (callback) callback(log)
            }
          } catch (e) {
            log.push(event)
          }
        })
      })
    })
  }

  get (url) {
    return axios.get(url)
  }

  post (url, data) {
    return axios.post(url, data)
  }

  start () {
    this.notifications.start()
  }
}

module.exports = PipelineAPI
