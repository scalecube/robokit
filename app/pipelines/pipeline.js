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

  sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  status (owner, repo, id, callback) {
    const log = []
    let timer = setTimeout(() => {
      log.push({
        id: id,
        status: 'ERROR',
        timestamp: Date.now(),
        message: 'Timeout reached!'
      })
      callback(log)
    }, 180 * 1000)
    let end = false
    const uri = `${process.env.SPINLESS_URL}/helm/deploy/${owner}/${repo}/${id}`
    console.log('>>>>> TRIGGER STATUS:\n POST ' + uri)
    Stream.from(uri).on((event) => {
      console.log(event)
      const events = event.split('\n')
      events.forEach(event => {
        try {
          if (event !== '') {
            clearTimeout(timer)
            const record = JSON.parse(event)
            if (record.status !== 'EOF') {
              log.push(record)
            }
            if ((!end) && (record.status !== 'SUCCESS' || record.status !== 'ERROR')) {
              timer = setTimeout(() => {
                if (!end) callback(log)
              }, 2000, log)
            } else if (!end) {
              callback(log)
            }
          }
        } catch (e) {}
      })
    }, () => {
      end = true
      clearTimeout(timer)
      callback(log)
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
