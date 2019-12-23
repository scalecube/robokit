const httpClient = require('../http-client');
const Repository = require('./repository');

class WebhooksRouter {

    constructor() {
        new Repository("github-gateway").connect("webhooks").then(r=>{
            this.repo = r;
            this.loadRoutes();
        });

    }

    route(payload, onRoute, onError) {

        this.routes.forEach(route => {
            let owner = payload.repository.owner.login;
            let repo = payload.pull_request.head.repo.name;
            if(route.owner && route.owner   === owner ) {
                if(route.repo == repo || !route.repo) {
                    httpClient.post(route.url, payload).then((msg) => {
                        onRoute(msg);
                    }).catch(function (err) {
                        onError(error);
                    });
                }
            }
        });

    }

    loadRoutes() {
        return new Promise((resolve, reject) => {
            this.repo.findAll().then(all => {
                this.routes = all;
                resolve();
            });
        });
    };

    createWebhook (hook) {
        return new Promise((resolve, reject) => {
            this.repo.insert(hook);
            this.loadRoutes();
            resolve();
        });
    }
}

module.exports = WebhooksRouter;