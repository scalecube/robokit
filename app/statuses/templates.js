const fs = require('fs')
const path = require('path')

class Templates {
  constructor () {
    this.statusContent = new Map()
    this.statusContent.set('running', this.env(fs.readFileSync(path.resolve(__dirname, './running.md'), 'utf8')))
    this.statusContent.set('starting', this.env(fs.readFileSync(path.resolve(__dirname, './starting.md'), 'utf8')))
    this.statusContent.set('waiting', this.env(fs.readFileSync(path.resolve(__dirname, './waiting.md'), 'utf8')))
    this.statusContent.set('canceled', this.env(fs.readFileSync(path.resolve(__dirname, './canceled.md'), 'utf8')))
    this.statusContent.set('status', this.env(fs.readFileSync(path.resolve(__dirname, './status.md'), 'utf8')))
  }

  get (key) {
    return this.statusContent.get(key)
  }

  env (data) {
    // eslint-disable-next-line no-template-curly-in-string
    data = data.replace('${GRAPHANA_URL}', process.env.GRAPHANA_URL)
    // eslint-disable-next-line no-template-curly-in-string
    data = data.replace('${ROBOKIT_URL}', process.env.ROBOKIT_URL)
    // eslint-disable-next-line no-template-curly-in-string
    data = data.replace('${VAULT_URL}', process.env.VAULT_URL)
    return data
  }
}

module.exports = new Templates()
