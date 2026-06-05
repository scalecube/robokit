const fs = require('fs')
const path = require('path')

const load = name => fs.readFileSync(path.join(__dirname, `${name}.md`), 'utf8')

const templates = new Map([
  ['starting', load('starting')],
  ['canceled', load('canceled')],
  ['status', load('status')]
])

module.exports = { get: key => templates.get(key) }
