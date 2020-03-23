async function start () {
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })

  rl.on('line', (line) => {
    const values = JSON.parse(line)
    for (var key in values) {
      process.env[key] = values[key]
    }
    rl.close()
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
}
start()
