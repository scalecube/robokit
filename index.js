const createScheduler = require('probot-scheduler');
const ApiGateway = require('./app/http-gateway');
const Cache = require('./app/cache');
const cache = new Cache();
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {

  createScheduler(app, {
    delay: false, // delay is enabled on first run
    interval: 1000 * 60 * 5 // 1 day
  });

  app.on('schedule.repository', context => {
    cache.set(context.payload.repository.owner.login , context.payload.repository.name ,context.github);
  });

  app.on('*', async context => {
    cache.set(context.payload.repository.owner.login , context.payload.repository.name ,context.github);
  });

  app.log('Starting the T+Bot service.');
  const api = new ApiGateway(app,cache);

  app.on('issues.opened', async context => {
    const issueComment = context.issue({ body: 'Thanks for opening this issue!' });
    return context.github.issues.createComment(issueComment);
  });

  app.on('check_suite', async context => {
    return api.onCheckSuite(context);
  });

  app.on('pull_request.synchronize', async context => {
    return api.onPullRequest(context);
  });

  console.log("Server Started.");
};

// For more information on building apps:
// https://probot.github.io/docs/

// To get your app running against GitHub, see:
// https://probot.github.io/docs/development/
// Authenticate as the App
