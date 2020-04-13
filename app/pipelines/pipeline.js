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
    const url = `${process.env.SPINLESS_URL}/helm/deploy/cancel/${pipelineId}`
    return this.get(url)
  }

  deploy (trigger) {
    const url = `${process.env.SPINLESS_URL}/helm/deploy`
    console.log('>>>>> TRIGGER DEPLOY:\n POST ' + url + '\n' + JSON.stringify(trigger))
    return this.post(url, trigger).then((resp) => {
      console.log('<<<<< TRIGGER DEPLOY RESPONSE:\n ' + JSON.stringify(resp.data))
      return resp
    })
  }

  release (release) {
    const url = `${process.env.SPINLESS_URL}/helm/release`
    console.log('>>>>> TRIGGER RELEASE:\n POST ' + url + '\n' + JSON.stringify(release))
    return this.post(url, release).then((resp) => {
      console.log('<<<<< TRIGGER RELEASE RESPONSE:\n ' + JSON.stringify(resp.data))
      return resp
    })
  }

  status (owner, repo, id, callback) {
    const log = []
    const uri = `${process.env.SPINLESS_URL}/helm/deploy/${owner}/${repo}/${id}`
    Stream.from(uri).on((event) => {
      console.log(event)
      const events = event.split('\n')
      events.forEach(event => {
        try {
          if (event !== 'EOF') {
            log.push(JSON.parse(event))
            callback(log)
          }
        } catch (e) {
        }
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
