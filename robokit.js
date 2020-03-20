async function start () {
  require('dotenv').config()
  require('./app/vault/vault-api')
    .load(process.env.VAULT_PATH)
    .then(values => {
      require('child_process').spawn('npm start', ['-pe', 'process.env.PATH'], {
        cwd: process.cwd() + '/backend',
        env: {
          NODE_CONFIG_DIR: process.cwd() + '/config'
        },
        stdio: 'inherit',
        shell: true // doesn't matter if shell: true is here or not.
      })
    })
}
start()
