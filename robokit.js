const U = require('./app/utils')

async function start () {
  require('dotenv').config()
  const vault = new (require('./app/vault-api'))(process.env.VAULT_ADDR)

  vault.k8sLogin(process.env.VAULT_ROLE, process.env.VAULT_JWT_PATH)
    .then(async token => {
      vault.read(token.client_token, process.env.VAULT_SECRETS_PATH)
        .then(async values => {
          for (var key in values) {
            process.env[key] = values[key]
          }

          const { Server, Probot } = require('probot')
          const app = require('./index.js')
          console.log('process.env.WEBHOOK_PROXY_URL: ' + process.env.WEBHOOK_PROXY_URL)
          async function startServer () {
            const server = new Server({
              port: process.env.PORT || 3000,
              webhookProxy: process.env.WEBHOOK_PROXY_URL,
              Probot: Probot.defaults({
                appId: process.env.APP_ID,
                privateKey: process.env.PRIVATE_KEY,
                secret: process.env.WEBHOOK_SECRET
              })
            })

            await server.load(app)

            server.start()
          }
          await startServer()
        }).catch(err => {
          U.printError(`ERROR reading variables from vault \n 
          VAULT_SECRETS_PATH:${process.env.VAULT_SECRETS_PATH}\n
          VAULT_ADDR:${process.env.VAULT_ADDR}
          error:`, err)
        })
    }).catch(err => {
      U.printError('k8sLogin failed with error:', err)
    })
}
start()
