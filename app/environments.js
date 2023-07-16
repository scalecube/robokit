const WebSocketClient = require('websocket').client
const axios = require('axios')
const vault = new (require('./vault-api'))(process.env.VAULT_ADDR)
const Rx = require('rxjs/Rx')

var ws = null
class Environments {
  constructor () {
    this.responses = new Map()
  }

  getEnviromentServiceToken (clientToken) {
    const path = `${process.env.VAULT_ADDR.replace(/\/$/, '')}/v1/identity/oidc/token/${process.env.ENV_SERVICE_ROLE}`
    console.log('get Enviroment Service Token: ' + path)
    // curl -H "X-Vault-Token: $clientToken" path
    return this.httpGet(path, clientToken)
  }

  connect (address) {
    if (!address) {
      address = process.env.ENV_SERVICE_ADDRESS
    }
    console.log('connect websocket: ' + address)
    return new Promise((resolve, reject) => {
      vault.k8sLogin(
        process.env.VAULT_ROLE,
        process.env.VAULT_JWT_PATH)
        .then(async token => {
          const res = await this.getEnviromentServiceToken(token.client_token)
          resolve(this.openWebSocketConnection(address, res.data.data.token))
        })
    })
  }

  openWebSocketConnection (address, token) {
    return new Promise((resolve, reject) => {
      const client = new WebSocketClient()

      client.on('connectFailed', (error) => {
        console.log('Connect Error: ' + error.toString())
      })

      client.on('connect', (connection) => {
        console.log('WebSocket Connected to Environment Service: ' + process.env.ENV_SERVICE_ADDRESS)
        connection.on('error', (error) => {
          console.log('Connection Error: ' + error.toString())
          reject(error)
        })

        connection.on('close', async () => {
          console.log('echo-protocol Connection Closed')
          ws = null
        })

        connection.on('message', (message) => {
          if (message.type === 'utf8') {
            const json = JSON.parse(message.utf8Data)
            const p = this.responses.get(json.sid)
            if (p) {
              if (json.sig) {
                this.responses.delete(json.sid)
              }
              if (json.sig === 1) {
                p.complete()
              } else if (json.sig === 2) {
                p.error(json)
              } else if (json.sig === 3) {
                p.error(json)
              } else {
                p.next(json)
              }
            }
          }
        })
        ws = connection
        resolve(connection)
      })
      client.connect(address, undefined, undefined, { 'X-Exberry-Token': token })
    })
  }

  deploy (data) {
    return this.deployService(this.toDeployRequest(data))
  }

  /*
    branch:
      {"site":"site","service":{"owner":"scalecube","repo":"abc-service","version":"develop"},"branch":"develop"}}
    prerelease:
      {"site":"site","service":{"owner":"scalecube","repo":"abc-service","version":"v1.2.3-rc1"},"isPrerelease":true}}
    release:
      {"site":"site","service":{"owner":"scalecube","repo":"abc-service","version":"v1.2.3"},"isPrerelease":false}}
  */
  toDeployRequest (data) {
    const res = {
      service: {
        owner: data.owner,
        repo: data.repo
      }
    }

    if (data.release && data.prerelease) {
      res.isPrerelease = true
      res.service.version = data.tag_name
    } else if (data.release) {
      res.isPrerelease = false
      res.service.version = data.tag_name
    } else {
      res.branch = data.branch_name
    }
    return res
  }

  deployService (deployRequest) {
    return this.requestStream('v3/deployments/deployService', deployRequest)
  }

  requestStream (qualifier, data) {
    const sid = Date.now()
    const subject = new Rx.Subject()
    this.send(qualifier, data, sid)
    this.responses.set(sid, subject)
    return subject.asObservable()
  }

  async send (qualifier, data, sid) {
    const msg = {
      q: qualifier,
      sid: sid,
      d: data
    }
    if (!ws) {
      console.log('Reconnect to Environment Service: ' + process.env.ENV_SERVICE_ADDRESS)
      await this.connect()
      console.log('Connected! to Environment Service: ' + process.env.ENV_SERVICE_ADDRESS)
    }
    const payload = JSON.stringify(msg)
    console.log(payload)
    ws.sendUTF(payload)
  }

  httpGet (url, vaultToken) {
    return axios.get(url, {
      headers: {
        'X-Vault-Token': vaultToken
      }
    })
  }
}
module.exports = new Environments()
