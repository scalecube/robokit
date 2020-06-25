async function start () {
  require('dotenv').config()
  const vault = new (require('./app/vault/vault-api'))(process.env.VAULT_ADDR)

  vault.k8sLogin(
    process.env.VAULT_ROLE,
    process.env.VAULT_JWT_PATH)
    .then(token => {
      // eslint-disable-next-line no-undef

      vault.read(token.client_token, process.env.VAULT_SECRETS_PATH)
        .then(async values => {
          for (var key in values) {
            process.env[key] = values[key]
          }
          const options = {
            id: process.env.APP_ID,
            port: process.env.PORT || 3000,
            secret: process.env.WEBHOOK_SECRET,
            cert: process.env.PRIVATE_KEY,
            webhookProxy: process.env.WEBHOOK_PROXY_URL
          }
          const p = require('probot')
          const probot = p.createProbot(options)
          const robokit = require('./index.js')
          probot.setup([robokit])
          probot.start()
        })
    })
}
start()
