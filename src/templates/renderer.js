const fs = require('fs')
const path = require('path')

const cache = new Map()

function load (name) {
  if (!cache.has(name)) {
    cache.set(name, fs.readFileSync(path.join(__dirname, `${name}.md`), 'utf8'))
  }
  return cache.get(name)
}

function render (templateName, vars) {
  let md = load(templateName)
  for (const [key, value] of Object.entries(vars)) {
    if (typeof value === 'string' || typeof value === 'number') {
      md = md.split('${' + key + '}').join(String(value))
    }
  }
  return md
}

module.exports = { render }
