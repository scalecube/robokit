module.exports = {

    deploy : {
        check:{
            name: "Robo-Kit Deploy",
            queued: {
                title: "Deploy is Waiting for ci to complete.",
                summary: "deploy will start when check suite completes",
                text: "waiting for CI to complete successfully"
            },
            trigger_pipeline: {
                title: "Robo-kit Triggered a continues delivery pipeline ",
                summary: "Triggered a Continues-Delivery pipeline",
                text: "Waiting for Continues Delivery pipeline acknowledgment"
            },
            cd_pipeline_started: {
                title: "Robo-kit Continues Delivery pipeline is running",
                summary: "Continues-Delivery pipeline is running",
                text: "Waiting for Continues Delivery pipeline status updates"
            }
        },
        on: {
            push: {
                actions:[
                    'Travis CI - Branch',
                    'trigger_deploy'
                ]
            },
            pull_request: {
                labeled: ["DEPLOY"],
                actions:[
                    'Travis CI - Pull Request',
                    'trigger_deploy'
                ]
            }
        }
    },
    labels:[{
        name: "DEPLOY"
    }]
}

