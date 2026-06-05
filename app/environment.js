const WebSocketClient = require('websocket').client
const axios = require('axios')
const Vault = require('./vault-api')
const Rx = require('rxjs/Rx')

let ws = null

class Environment {
  constructor () {
    this.responses = new Map()
  }

  async connect (address = process.env.ENV_SERVICE_ADDRESS) {
    if (process.env.LOCAL_DEV) {
      console.log('LOCAL_DEV mode: skipping env service connection')
      return
    }
    console.log('connect websocket: ' + address)
    const vault = new Vault()
    const token = await vault.k8sLogin(process.env.VAULT_ROLE, process.env.VAULT_JWT_PATH)
    const oidcPath = `${process.env.VAULT_ADDR.replace(/\/$/, '')}/v1/identity/oidc/token/${process.env.ENV_SERVICE_ROLE}`
    const oidcRes = await axios.get(oidcPath, { headers: { 'X-Vault-Token': token.client_token } })
    return this.openWebSocketConnection(address, oidcRes.data.data.token)
  }

  openWebSocketConnection (address, token) {
    return new Promise((resolve, reject) => {
      const client = new WebSocketClient()

      client.on('connectFailed', reject)

      client.on('connect', connection => {
        console.log('WebSocket Connected to Environment Service: ' + address)
        connection.on('error', reject)
        connection.on('close', () => { console.log('Connection Closed'); ws = null })
        connection.on('message', message => {
          if (message.type !== 'utf8') return
          const json = JSON.parse(message.utf8Data)
          const subject = this.responses.get(json.sid)
          if (!subject) return
          if (json.sig) this.responses.delete(json.sid)
          if (json.sig === 1) subject.complete()
          else if (json.sig === 2 || json.sig === 3) subject.error(json)
          else subject.next(json)
        })
        ws = connection
        resolve(connection)
      })

      client.connect(address, undefined, undefined, { 'X-Exberry-Token': token })
    })
  }

  deploy (data) {
    if (process.env.LOCAL_DEV) return this.mockDeploy(data)
    return this.deployStream(this.toRequest(data))
  }

  mockDeploy (data) {
    console.log('LOCAL_DEV mode: mock deploy for ' + data.owner + '/' + data.repo)
    const subject = new Rx.Subject()
    const id = 'mock-' + Date.now()
    const event = (status, message) => ({ d: { status, id, timestamp: new Date().toISOString(), data: { message } } })
    setTimeout(() => subject.next(event('RUNNING', 'Preparing deployment (mock)')), 200)
    setTimeout(() => subject.next(event('RUNNING', 'Deploying (mock)...')), 1200)
    setTimeout(() => { subject.next(event('SUCCEEDED', 'Deployment complete (mock)')); subject.complete() }, 2500)
    return subject.asObservable()
  }

  toRequest (data) {
    const req = { service: { owner: data.owner, repo: data.repo } }
    if (!data.release) req.branch = data.branch_name
    return req
  }

  deployStream (request) {
    const sid = Date.now()
    const subject = new Rx.Subject()
    this.responses.set(sid, subject)
    this.send('v3/deployments/deployService', request, sid)
      .catch(err => { this.responses.delete(sid); subject.error(err) })
    return subject.asObservable()
  }

  async send (qualifier, data, sid) {
    if (!ws) {
      console.log('Reconnect to Environment Service: ' + process.env.ENV_SERVICE_ADDRESS)
      await this.connect()
      console.log('Connected to Environment Service: ' + process.env.ENV_SERVICE_ADDRESS)
    }
    const payload = JSON.stringify({ q: qualifier, sid, d: data })
    console.log('>>> SEND to ' + process.env.ENV_SERVICE_ADDRESS + '\n' + payload)
    ws.sendUTF(payload)
  }
}

module.exports = new Environment()
