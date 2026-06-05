const WebSocketClient = require('websocket').client
const axios = require('axios')
const { Subject } = require('rxjs')
const VaultAdapter = require('../vault/VaultAdapter')
const logger = require('../../logger')
const cfg = require('../../config')

class CdServiceClient {
  #ws = null
  #connecting = null
  #responses = new Map()

  async connect () {
    logger.info({ address: cfg.cdServiceAddress }, 'cd-service.connecting')
    const vault = new VaultAdapter()
    const token = await vault.k8sLogin(cfg.vault.role, cfg.vault.jwtPath)
    const oidcUrl = `${cfg.vault.addr.replace(/\/$/, '')}/v1/identity/oidc/token/${cfg.cdServiceRole}`
    const oidcRes = await axios.get(oidcUrl, { headers: { 'X-Vault-Token': token.client_token } })
    return this.#openConnection(cfg.cdServiceAddress, oidcRes.data.data.token)
  }

  #openConnection (address, token) {
    return new Promise((resolve, reject) => {
      const client = new WebSocketClient()
      client.on('connectFailed', reject)
      client.on('connect', connection => {
        logger.info({ address }, 'cd-service.connected')
        connection.on('error', err => { logger.error({ err }, 'cd-service.connection-error'); this.#ws = null })
        connection.on('close', () => { logger.info('cd-service.connection-closed'); this.#ws = null })
        connection.on('message', msg => this.#onMessage(msg))
        this.#ws = connection
        resolve(connection)
      })
      client.connect(address, undefined, undefined, { 'X-Exberry-Token': token })
    })
  }

  #onMessage (message) {
    if (message.type !== 'utf8') return
    const json = JSON.parse(message.utf8Data)
    const subject = this.#responses.get(json.sid)
    if (!subject) return
    if (json.sig) this.#responses.delete(json.sid)
    if (json.sig === 1)                    subject.complete()
    else if (json.sig === 2 || json.sig === 3) subject.error(json)
    else                                   subject.next(json)
  }

  async #getConnection () {
    if (this.#ws?.connected) return this.#ws
    if (this.#connecting) return this.#connecting
    this.#connecting = this.connect().finally(() => { this.#connecting = null })
    return this.#connecting
  }

  async #send (qualifier, data, sid) {
    const conn = await this.#getConnection()
    const payload = JSON.stringify({ q: qualifier, sid, d: data })
    logger.debug({ qualifier, sid }, 'cd-service.send')
    conn.sendUTF(payload)
  }

  deploy (context) {
    const sid = `${context.owner}/${context.repo}:${Date.now()}`
    const subject = new Subject()
    this.#responses.set(sid, subject)
    const request = context.release
      ? { service: { owner: context.owner, repo: context.repo } }
      : { service: { owner: context.owner, repo: context.repo }, branch: context.branch }
    logger.info({ request, sid }, 'cd-service.deploy')
    this.#send('v3/deployments/deployService', request, sid)
      .catch(err => { this.#responses.delete(sid); subject.error(err) })
    return subject.asObservable()
  }

  isConnected () {
    return this.#ws?.connected ?? false
  }
}

module.exports = new CdServiceClient()
