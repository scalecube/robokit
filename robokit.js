require('dotenv').config()

const { Server, Probot } = require('probot')
const app = require('./index.js')
const Vault = require('./app/vault-api')

async function startServer () {
  const serverOptions = {
    port: process.env.PORT || 3000,
    webhooks: {
      path: '/api/github/webhooks',
      secret: process.env.WEBHOOK_SECRET
    },
    Probot: Probot.defaults({
      appId: process.env.APP_ID,
      privateKey: process.env.PRIVATE_KEY,
      secret: process.env.WEBHOOK_SECRET
    })
  }

  if (process.env.WEBHOOK_PROXY_URL) {
    serverOptions.webhookProxy = process.env.WEBHOOK_PROXY_URL
    console.log('Webhook proxy: ' + process.env.WEBHOOK_PROXY_URL)
  }

  const server = new Server(serverOptions)
  await server.load(app)
  await server.start()
}

async function start () {
  if (process.env.LOCAL_DEV) {
    console.log('LOCAL_DEV mode: skipping Vault auth, using .env credentials')
    await startServer()
    return
  }

  try {
    const vault = new Vault()
    const token = await vault.k8sLogin(process.env.VAULT_ROLE, process.env.VAULT_JWT_PATH)
    const values = await vault.read(token.client_token, process.env.VAULT_SECRETS_PATH)
    Object.assign(process.env, values)
    console.log('PORT: ' + process.env.PORT)
    await startServer()
  } catch (err) {
    console.error('Startup failed:', err)
    process.exit(1)
  }
}

start()
