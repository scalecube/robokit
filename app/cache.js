const createScheduler = require('probot-scheduler');
const contexts = new Map();

class Cache {
    constructor(app){
        createScheduler(app, {
            delay: false, // delay is enabled on first run
            interval: 15 * 60 * 1000 // 15 minutes
        });

        app.on('schedule.repository', context => {
            this.set(context.payload.repository.owner.login , context.payload.repository.name ,context.github);
        });

        app.on('*', async context => {
            console.log("####### EVENT NAME: " + context.name);
            this.set(context.payload.repository.owner.login , context.payload.repository.name ,context.github);
        });
    }
    set(owner,repo, ctx) {
        contexts.set(owner+ "/" + repo, ctx);
    }

    get(owner,repo) {
        return contexts.get(owner+ "/" + repo);
    }
}

module.exports = Cache;