module.exports = {

    deploy : {
        check:{
            name: "Robo-Kit Deploy",
            queued: {
                title: "Starting Continues-Delivery.",
                summary: "Deploy pipeline initializing",
                text: "About to trigger a deployment pipeline."
            },
            trigger_pipeline: {
                title: "Triggered Pipeline ",
                summary: "Triggered a Continues-Delivery pipeline",
                text: "Waiting for Continues Delivery pipeline acknowledgment"
            },
            cd_pipeline_started: {
                title: "Pipeline is Running",
                summary: "Continues-Delivery pipeline is running",
                text: "Waiting for Continues Delivery pipeline status updates"
            }
        },
        on: {
            push: {
                branches:[
                    'master',
                    'develop'
                ],
                actions:[{
                    name: 'Travis CI - Branch', create_on: "in_progress", trigger_on: "completed"
                },{
                    name: 'robo_kit_deploy', create_on: "queued", trigger_on: "completed"
                }]
            },
            pull_request: {
                labeled: ["DEPLOY"],
                actions:[{
                    name: 'Travis CI - Pull Request', create_on: "in_progress", trigger_on: "completed"
                },{
                    name: 'robo_kit_deploy', create_on: "queued", trigger_on: "queued"
                }]
            }
        }
    },
    labels:[{
        name: "DEPLOY"
    }]
}

