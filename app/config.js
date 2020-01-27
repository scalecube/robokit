module.exports = {
    deploy : {
        name: "Robo-Kit Deploy",
        on: [
            'Travis CI - Pull Request',
            'trigger_deploy'
        ],
        label: {
            name: "DEPLOY"
        }
    },
    labels:[{
        name: "DEPLOY"
    }]
}