const axios = require('axios')


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

  execute (data) {
    return this.post(`${process.env.SPINLESS_URL}`, data).then(res => {
      if (data.action_type === 'deploy') {
        this.notifications.store(data)
      }
    })
  }

  status (pipelineId) {
    return this.get(`${process.env.SPINLESS_URL}/pipeline/${pipelineId}`)
  }

  get (url) {
    return axios.get(url)
  }

  post (url, data) {
    return axios.post(url,data)
  }

  start () {
    this.notifications.start()
  }
}

module.exports = PipelineAPI