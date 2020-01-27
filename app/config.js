module.exports = {
    deploy : {
        check:{
            name: "Robo-Kit Deploy",
            queued: {
                title: "Deploy is Waiting for ci to complete.",
                summary: "deploy will start when check suite completes",
                text: "waiting for CI to complete successfully"
            },
            in_progress: {
                title: "Robo-kit is Deploying branch: ",
                summary: "Triggered a Continues-Deployment pipeline",
                text: "Waiting for Continues deployment status updates"
            }
        },
        on: {
            actions:[
                'Travis CI - Pull Request',
                'trigger_deploy'
            ],
            pull_request: {
                labeled: ["DEPLOY"]
            }
        }
    },
    labels:[{
        name: "DEPLOY"
    }]
}

