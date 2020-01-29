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
                    master,
                    develop
                ],
                actions:[
                    'Travis CI - Branch',
                    'robo_kit_deploy'
                ]
            },
            pull_request: {
                labeled: ["DEPLOY"],
                actions:[
                    'Travis CI - Pull Request',
                    'robo_kit_deploy'
                ]
            }
        }
    },
    labels:[{
        name: "DEPLOY"
    }]
}

