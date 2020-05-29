const axios = require('axios')
const Stream = require('./stream')

class PipelineAPI {
  cancel (pipelineId) {
    const url = `${process.env.SPINLESS_URL}/helm/deploy/cancel/${pipelineId}`
    return this.get(url)
  }

  deploy (data) {
    const url = `${process.env.SPINLESS_URL}/helm/install`
    console.log('>>>>> TRIGGER DEPLOY:\n POST ' + url + '\n' + JSON.stringify(data))
    return this.post(url, data).then((resp) => {
      console.log('<<<<< TRIGGER DEPLOY RESPONSE:\n ' + JSON.stringify(resp.data))
      return resp
    })
  }

  undeploy (data) {
    if (data.namespace === 'develop' || data.namespace === 'master') {
      throw new Error('its not allowed to delete namespace:' + data.namespace)
    }

    const url = `${process.env.SPINLESS_URL}/helm/uninstall`
    console.log('>>>>> DELETE NAMESPACE:\n DELETE ' + url)
    return this.post(url, PipelineAPI.toDeleteRequest(data)).then((resp) => {
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

  static toDeleteRequest (deploy) {
    const trigger = {
      namespace: deploy.namespace
    }
    if (deploy.robokit) {
      if (deploy.robokit.kuberneteses && deploy.robokit.kuberneteses.length > 0) {
        trigger.services = []
        for (const i in deploy.robokit.kuberneteses) {
          const kubernetes = deploy.robokit.kuberneteses[i]
          for (const k in kubernetes.services) {
            const deployment = kubernetes.services[k]
            const service = {
              cluster: kubernetes.cluster,
              repo: deployment.repo,
              owner: deployment.owner || deploy.owner
            }
            trigger.services.push(service)
          }
        }
      }
    }
    return trigger
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
