const VaultClient = require('node-vault-client')
const fs = require('fs')
const axios = require('axios')

class Vault {

  constructor (options) {
    this.vaultAddress = options.VAULT_ADDR || process.env.VAULT_ADDR
    if (this.vaultAddress.endsWith('/')) {
      this.vaultAddress = this.vaultAddress.slice(0, -1)
    }
  }

  read (token, path) {
    return new Promise((resolve, reject) => {
      const url = this.vaultAddress + '/v1/' + path
      axios.get(url, { headers: { 'X-Vault-Token': token } }).then(response => {
        resolve(response.data.data)
      }).catch((error) => {
        reject(error)
      })
    })
  }

  k8sLogin (role, jwtPath) {
    if (!jwtPath) jwtPath = '/var/run/secrets/kubernetes.io/serviceaccount/token'
    return new Promise((resolve, reject) => {
      const token = fs.readFileSync(jwtPath)
      const params = {
        role: role,
        jwt: token.toString('utf8')
      }
      const url = this.vaultAddress + '/v1/auth/kubernetes/login'
      axios.post(url, params).then(resp => {
        resolve(resp.data.auth)
      }).catch(err => reject(err))
    })
  }
}

module.exports = Vault
