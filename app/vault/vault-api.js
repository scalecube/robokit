const VaultClient = require('node-vault-client');

class Vault {
  constructor () {
    this.vaultClient = VaultClient.boot('main', {
      api: { url: process.env.VAULT_ADDR },
      auth: {
        type: 'token', // or 'token', 'iam'
        config: {
          token: process.env.VAULT_TOKEN
        }
      }
})
  }

  load (path) {
    return new Promise((resolve, reject) => {
      this.vaultClient.read(path).then(values => {
        const secrets = values.__data
        for (var key in secrets) {
          process.env[key] = secrets[key]
        }
        resolve(secrets)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
module.exports = new Vault()