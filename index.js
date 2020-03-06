const { createProbot } = require('probot')

const ApiGateway = require('./app/http-gateway')
const Cache = require('./app/cache')
const hbs  = require('express-handlebars');

const probot = createProbot({
  id: process.env.APP_ID,
  port: process.env.PORT || 3000,
  secret: process.env.WEBHOOK_SECRET,
  cert: process.env.PRIVATE_KEY
})

const expressApp = probot.server

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
const robokit = app => {
  const cache = new Cache(app)

  // Use `.hbs` for extensions and find partials in `views/partials`.
  expressApp.engine('handlebars', hbs());
  expressApp.set('view engine', 'handlebars');

  app.log('Starting the TxBot service.')
  const api = new ApiGateway(app, cache)

  app.on('schedule.repository', async context => {
    cache.set(context.payload.repository.owner.login, context.payload.repository.name, context.github)
  })

  app.on('installation', async context => {
    api.onAppInstall(context)
    console.log('installation event:' + JSON.stringify(context))
  })

  app.on('check_run', async context => {
    if(context.payload.requested_action){
      let action = context.payload.requested_action.identifier
      context.user_action = action
    }
    return api.onCheckRun(context)
  })

  app.on([
    // 'pull_request.synchronize',
    // 'pull_request.labeled',
    // 'pull_request.opened',
    // 'pull_request.reopened',
    'pull_request.unlabeled',
    'pull_request.closed'
  ], async context => {
    return api.onPullRequest(context)
  })

  app.on([
    'issue_comment',
    'issues',
    'push'], async context => {
    // api.route(context);
  })

  console.log('Server Started.')

  if(process.env.SUBDOMAIN){
    const SmeeClient = require('smee-client')

    const smee = new SmeeClient({
      source: `https://smee.io/${process.env.SUBDOMAIN}`,
      target: `http://localhost:${process.env.PORT}`,
      logger: console
    })

    const events = smee.start()
  }
}
probot.load(robokit)
module.exports = robokit
// For more information on building apps:
// https://probot.github.io/docs/

// To get your app running against GitHub, see:
// https://probot.github.io/docs/development/
// Authenticate as the App
