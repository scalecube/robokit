const httpClient = require('../http-client')
const Repository = require('./repository')
const cfg = require('../config')

class WebhooksRouter {
  constructor () {
    new Repository(cfg.ROBOKIT_DB).connect('webhooks').then(r => {
      this.repo = r
      this.loadRoutes().then(routes => {
        console.log('routes loaded: ' + JSON.stringify(routes))
      })
    })
  }

  route (owner, repo, ctx, onRoute, onError) {
    const promises = []
    this.routes.forEach(route => {
      if (route.owner && route.owner === owner) {
        if (route.repo === repo || !route.repo) {
          let url = route.url
          for (const [key, value] of Object.entries(ctx)) {
            url = url.replace('${' + key + '}', value)
          }
          promises.push(new Promise((resolve, reject) => {
            console.log('>>> ROUTE URL: ' + url)
            httpClient.post(url, ctx).then((msg) => {
              onRoute(msg)
              resolve(msg)
            }).catch(function (err) {
              onError(err)
              reject(err)
            })
          }))
        }
      }
    })
    return Promise.all(promises)
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
