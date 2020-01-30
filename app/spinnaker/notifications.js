
class Notifications {

    constructor(githubService) {
        this.githubService = githubService;
        this.cache = githubService.cache;
    }

    onEvent(event) {
        let github = this.cache.get(event.owner,event.repo);

        this.githubService.createCheckRun(github,[{

        }]);
    }

}

module.exports = Notifications;