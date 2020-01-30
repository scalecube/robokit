const rp = require('request-promise');
const URL_TEMPLATE = "https://spinnakerapi.genesis.om2.com/applications/${APPLICATION}/executions/search?triggerTypes=webhook&eventId=${EVENT_ID}";
const CronJob = require('cron').CronJob;

class Spinnaker {

    constructor() {
        this.events = new Map();
        this.job = new CronJob('*/4 * * * * *', () => {
            this.run();
        });
    }

    monitor(event) {
        this.events.set(props.eventId, event);
        this.job.start();
    }

    async run() {

        console.log("#### PIPELINE RESULT");

        for(let entry in this.events.entries()) {
            const url = URL_TEMPLATE.replace("${APPLICATION}", "scalecube-gw").replace("${EVENT_ID}",entry.key());
            this.get(url).then( (pipeline) => {
                console.log("#### PIPELINE RESULT: " + JSON.stringify(pipeline));
            });
        }

        if(this.events.size==0){
            this.job.stop();
        }
    }

    get (uri) {
        return rp({
            method: 'GET',
            uri: uri,
            json: true // Automatically stringifies the body to JSON
        })
    };
}

module.exports = new Spinnaker();