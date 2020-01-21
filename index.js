const ApiGateway = require('./app/http-gateway');
const Cache = require('./app/cache');

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  const cache = new Cache(app);

  app.log('Starting the T+Bot service.');
  const api = new ApiGateway(app,cache);

  app.on('check_run', async context => {
    return api.onCheckRun(context);
  });

  app.on('check_suite', async context => {
    return api.onCheckSuite(context);
  });

  app.on('pull_request.synchronize', async context => {
    return api.onPullRequest(context);
  });

  app.on('installation', async context => {
    console.log("installation event:" + JSON.stringify(context));
  });

  console.log("Server Started.");
};

// For more information on building apps:
// https://probot.github.io/docs/

// To get your app running against GitHub, see:
// https://probot.github.io/docs/development/
// Authenticate as the App
