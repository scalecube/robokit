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
          async function startServer () {
            const serverOptions = {
              port: process.env.PORT || 3000,
              webhooks: {
                path: '/',
                secret: process.env.WEBHOOK_SECRET
              },
              Probot: Probot.defaults({
                appId: process.env.APP_ID,
                privateKey: process.env.PRIVATE_KEY,
                secret: process.env.WEBHOOK_SECRET
              })
            }

            // only add webhookProxy if defined
            if (process.env.WEBHOOK_PROXY_URL) {
              serverOptions.webhookProxy = process.env.WEBHOOK_PROXY_URL
              console.log('process.env.WEBHOOK_PROXY_URL: ' + process.env.WEBHOOK_PROXY_URL)
            }

            const server = new Server(serverOptions)

            await server.load(app)
            await server.start()
          }

          startServer().catch(err => {
            console.error(err)
            process.exit(1)
          })
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
