const fs = require('fs')
const axios = require('axios')
const utils = require('../utils')

class Vault {
  constructor (options) {
    this.vaultAddress = options.VAULT_ADDR || process.env.VAULT_ADDR
  }

  read (token, path) {
    return new Promise((resolve, reject) => {
      const uri = utils.urlConcat([this.vaultAddress, '/v1/', path])
      axios.get(uri, { headers: { 'X-Vault-Token': token } }).then(response => {
        resolve(response.data.data)
      }).catch((error) => {
        reject(error)
      })
    })
  }

  k8sLogin (role, jwtPath) {
    if (!jwtPath) jwtPath = '/var/run/secrets/kubernetes.io/serviceaccount/token'
    return new Promise((resolve, reject) => {
      var currentDir = process.cwd()
      const token = fs.readFileSync(currentDir + "\\" + jwtPath)
      const params = {
        role: role,
        jwt: token.toString('utf8')
      }
      const url = utils.urlConcat([this.vaultAddress, `/v1/auth/${process.env.VAULT_JWT_PROVIDER}/login`])
      axios.post(url, params).then(resp => {
        resolve(resp.data.auth)
      }).catch(err => reject(err))
    })
  }
}
module.exports = Vault
