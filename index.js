/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
const robokit = app => {
  const ApiGateway = require('./app/http-gateway')
  const Cache = require('./app/cache')
  const cache = new Cache(app)

  app.log('Starting the TxBot service.')
  const api = new ApiGateway(app, cache)

  app.on('schedule.repository', async context => {
    cache.set(context.payload.repository.owner.login, context.payload.repository.name, context.github)
  })

  app.on('installation', context => {
    api.onAppInstall(context)
    console.log('installation event:' + JSON.stringify(context))
  })

  app.on('check_run', context => {
    console.log(context.payload.check_run.name + ' - ' + context.payload.check_run.status + ' - ' + context.payload.check_run.conclusion)
    if (context.payload.requested_action) {
      const action = context.payload.requested_action.identifier
      context.user_action = action
    }

    api.deployContext(context).then(deploy => {
      console.log(deploy.check_run_name)
      if (deploy.is_pull_request || api.isKnownBranch(deploy) || deploy.release) {
        api.deploy(context, deploy)
      }
    })
  })

  app.on([
    'pull_request.synchronize',
    'pull_request.labeled',
    'pull_request.opened',
    'pull_request.reopened',
    'pull_request.unlabeled',
    'pull_request.closed'
  ], context => {
    if (context.payload.action === 'opened' || context.payload.action === 'reopened') {
      const deploy = api.deployContext(context)
      if (deploy.is_pull_request || api.isKnownBranch(deploy)) {
        api.deploy(context, deploy)
      }
    }
  })

  app.on([
    'issue_comment',
    'issues',
    'push'], async context => {
    // api.route(context);
  })

  console.log('Server Started.')

  api.start()
  //smee()
}
function smee () {
  if (global.env.WEBHOOK_PROXY_URL) {
    const SmeeClient = require('smee-client')
    const smee = new SmeeClient({
      source: global.env.WEBHOOK_PROXY_URL,
      target: `http://localhost:${global.env.PORT}`,
      logger: console
    })

    smee.start()
  }
}
module.exports = robokit

// For more information on building apps:
// https://probot.github.io/docs/

// To get your app running against GitHub, see:
// https://probot.github.io/docs/development/
// Authenticate as the App
