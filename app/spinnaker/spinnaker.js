const rp = require('request-promise');
const URL_TEMPLATE = "https://spinnakerapi.genesis.om2.com/applications/${APP_NAME}/executions/search?triggerTypes=webhook&eventId=${EVENT_ID}";

class Spinnaker {

    constructor() {
        this.events = new Map();
    }

    monitor(props) {
        this.events.set(props.eventId, props);
    }

    async run() {
        for(let entry in this.events.entries()) {

            const url = URL_TEMPLATE.replace("${APP_NAME}", "scalecube-gw").replace("${EVENT_ID}",entry.key());

            this.get(url).then( (pipeline) => {

            });

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