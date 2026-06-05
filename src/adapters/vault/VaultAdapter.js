const axios = require('axios')
const { readFile } = require('fs').promises

function urlConcat (parts) {
  let url = new URL(parts[0])
  for (let i = 1; i < parts.length; i++) url = new URL(parts[i], url)
  return url.toString()
}

class VaultAdapter {
  constructor (addr = process.env.VAULT_ADDR) {
    this.addr = addr
  }

  async read (token, path) {
    const res = await axios.get(urlConcat([this.addr, '/v1/', path]), {
      headers: { 'X-Vault-Token': token }
    })
    return res.data.data
  }

  async k8sLogin (role, jwtPath = '/var/run/secrets/kubernetes.io/serviceaccount/token') {
    const jwt = await readFile(jwtPath, 'utf8')
    const url = urlConcat([this.addr, `/v1/auth/${process.env.VAULT_JWT_PROVIDER}/login`])
    const res = await axios.post(url, { role, jwt })
    return res.data.auth
  }
}

module.exports = VaultAdapter
