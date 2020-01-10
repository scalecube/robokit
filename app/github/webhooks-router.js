const httpClient = require('../http-client')
const Repository = require('./repository')

class WebhooksRouter {
  constructor () {
    new Repository('github-gateway').connect('webhooks').then(r => {
      this.repo = r
      this.loadRoutes().then(routes => {
        console.log('routes loaded: ' + JSON.stringify(routes))
      })
    })
  }

  route (ctx, onRoute, onError) {
    this.routes.forEach(route => {
      const owner = ctx.payload.repository.owner.login;
      const repo = ctx.payload.repository.name;
      if (route.owner && route.owner === owner) {
        if (route.repo === repo || !route.repo) {
          httpClient.post(route.url, ctx).then((msg) => {
            onRoute(msg);
          }).catch(function (err) {
            onError(err);
          })
        }
      }
    })
  }

  loadRoutes () {
    return new Promise((resolve, reject) => {
      this.repo.find().then(all => {
        this.routes = all
        resolve(all)
      }).catch(err => {
        console.log('loadRoutes failed: ' + JSON.stringify(err))
      })
    })
  };

  saveWebhook (hook) {
    return new Promise((resolve, reject) => {
      this.repo.save(hook).then((docs) => {
        console.log(docs)
        this.loadRoutes()
        resolve(docs)
      }).catch((err) => {
        reject(new Error('update webhook failed!. did you provide wrong _id?'))
      })
    })
  }

  findWebhooks (query) {
    return this.repo.find(query)
  }
}

module.exports = WebhooksRouter