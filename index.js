const ApiGateway = require('./app/http-gateway');
const Cache = require('./app/cache');

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  const cache = new Cache(app);

  app.log('Starting the TxBot service.');
  console.log('PRIVATE_KEY=' +process.env.PRIVATE_KEY);
  const api = new ApiGateway(app,cache);

  app.on('schedule.repository', context => {
    console.log("####### ON: " + context.name);
    cache.set(context.payload.repository.owner.login , context.payload.repository.name ,context.github);
  });

  app.on('installation', async context => {
    console.log("installation event:" + JSON.stringify(context));
  });

  app.on('check_suite', async context => {
  });

  app.on('check_run', async context => {
    return api.onCheckRun(context);
  });

  app.on([
      //'pull_request.synchronize',
      //'pull_request.opened',
      //'pull_request.reopened',
      //'pull_request.labeled',
      'pull_request.unlabeled',
      'pull_request.closed'
  ], async context => {
    return api.onPullRequest(context);
  });

  app.on([
      'issue_comment',
      'issues',
      'push'], async context => {
    //api.route(context);
  });

  console.log("Server Started.");
};

// For more information on building apps:
// https://probot.github.io/docs/

// To get your app running against GitHub, see:
// https://probot.github.io/docs/development/
// Authenticate as the App