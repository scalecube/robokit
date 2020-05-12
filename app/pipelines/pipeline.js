const axios = require('axios')
const Stream = require('./stream')

class PipelineAPI {
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

  deleteNamespace (clusterName, namespace) {
    if (namespace === 'develop' || namespace === 'master') {
      throw new Error('its not allowed to delete namespace:' + namespace)
    }

    const url = `${process.env.SPINLESS_URL}/clusters/${clusterName}/namespaces/${namespace}`
    console.log('>>>>> DELETE NAMESPACE:\n DELETE ' + url)
    return this.delete(url).then((resp) => {
      console.log('<<<<< DELETED NAMESPACE: ' + JSON.stringify(resp.data.result))
      return resp
    })
  }

  getNamespaces (clusterName) {
    const url = `${process.env.SPINLESS_URL}/clusters/${clusterName}/namespaces`
    console.log('>>>>> GET NAMESPACE:\n POST ' + url)
    return this.get(url).then((resp) => {
      console.log('<<<<< GET NAMESPACE:\n ' + JSON.stringify(resp.data))
      return resp.data.result
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

  status (id, callback) {
    const log = []
    let end = false
    let timer = setTimeout(() => {
      if (!end) {
        log.push({
          id: id,
          status: 'CANCELLED',
          timestamp: Date.now(),
          message: 'Timeout reached! deployment was not started for 3 minutes'
        })
        callback(log)
      }
    }, 180 * 1000)
    const uri = `${process.env.SPINLESS_URL}/helm/deploy/${id}`
    console.log('>>>>> TRIGGER STATUS:\n POST ' + uri)
    Stream.from(uri).on((event) => {
      const events = event.split('\n')
      events.forEach(event => {
        try {
          if (event !== '') {
            try {
              const record = JSON.parse(event)
              if (record.status !== 'EOF') {
                record.message = this.redacted(record.message)
                log.push(record)
              }
              clearTimeout(timer)
              timer = setTimeout(() => {
                if (!end) callback(log)
              }, 4000)
            } catch (e) {
              console.log('NOT JSON: ' + event)
              log.push({
                id: id,
                status: 'RUNNING',
                timestamp: Date.now(),
                message: `Error while reading log: ${e.message}`
              })
              callback(log)
            }
          }
        } catch (e) {
          console.error(e)
        }
      })
    }, () => {
      end = true
      clearTimeout(timer)
      callback(log)
    })
  }

  redacted (message) {
    return message.replace(/(dockerjsontoken).*(=|:)(.*)?\s*(>*)/g, '$1$2[REDACTED]')
      .replace(/(dockerconfigjson).*(=|:)(.*)?\s*(>*)/g, '$1$2[REDACTED]')
  }

  get (url) {
    return axios.get(url)
  }

  delete (url) {
    return axios.delete(url)
  }

  post (url, data) {
    return axios.post(url, data)
  }

  start () {
  }
}

module.exports = new PipelineAPI()
