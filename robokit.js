async function start () {
  require('dotenv').config()
  require('./app/vault/vault-api')
    .load(process.env.VAULT_PATH)
    .then(values => {
      for (var key in values) {
        process.env[key] = values[key]
      }
      const options = {
        id: values.APP_ID,
        port: values.PORT || 3000,
        secret: values.WEBHOOK_SECRET,
        cert: values.PRIVATE_KEY,
        webhookProxy: process.env.WEBHOOK_PROXY_URL
      }

      const p = require('probot')
      const probot = p.createProbot(options)
      const robokit = require('./index.js')
      probot.setup([robokit])
      probot.start()
    })
}
start()
