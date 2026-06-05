const coordinator = require('./app/coordinator')
const cache = require('./app/cache')

const robokit = app => {
  app.on('installation', context => {
    coordinator.onInstall(context)
  })

  app.on('check_run', context => {
    cache.set(
      context.payload.repository.owner.login,
      context.payload.repository.name,
      context.octokit
    )
    if (context.payload.requested_action) {
      context.user_action = context.payload.requested_action.identifier
    }
    coordinator.handle(context)
  })

  console.log('Server Started.')
}

module.exports = robokit
