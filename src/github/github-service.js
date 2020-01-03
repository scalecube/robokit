const Octokit = require("@octokit/rest");
const WebhooksRouter = require("./webhooks-router");
const httpClient = require("../http-client");
const WebhooksApi = require("@octokit/webhooks");

const octokit = Octokit({
    secret: process.env.GITHUB_SECRET,
    auth: process.env.GITHUB_TOKEN,
    userAgent: "pullreq",
    baseUrl: "https://api.github.com"
});

const webhooks = new WebhooksApi({
    secret: process.env.GITHUB_SECRET
});

webhooks.on("*", async ({ id, name, payload }) => {
    console.log("request arrived name: " + name );
    try {
        const event = {
            id: id,
            name : name,
            payload: payload
        };

        if(name === 'pull_request') {
            try {
                github.onPullRequest({ octokit, event });
            } catch (error) {
                console.log(error);
            }
        } else {
            github.router.route(event, (result)=>{},(error)=>{});

        }
    } catch (error) {
        console.log(error);
    }
});

class GithubService {

    constructor() {
        this.router = new WebhooksRouter();
        this.octokitClient = new Octokit({
          auth: process.env.GITHUB_TOKEN
        });
        this.webhooks = webhooks;

        this.statusUpdater = (octokit, owner, repo, sha) => (context, defaultDescription) => (state, description,target_url) => {
            return octokit.repos.createStatus({
            owner,
            repo,
            sha,
            state,
            context,
            target_url: target_url,
            description: description || defaultDescription
          });
        };



    }

    async onPullRequest (options = {}) {
        const { octokit, event } = options;
        const { pull_request = {} } = event.payload;
        const { head: { sha, repo: { name, owner: { login } = {}, clone_url } = {} } = {} } = pull_request;
        const statusAPI = this.statusUpdater(octokit, login, name, sha);

        try {
            this.router.route(event,(resp) => {
                if(process.env.DEBUG) {
                    let result = require("../examples/status-update.json");
                    /// DELETE THESE LINES!!! DEBUGGING!!!! DEBUGGING!!!!
                    result.sha = resp.data.pull_request.head.sha;
                    result.pull_request_url = resp.data.pull_request.url;
                    result.owner = resp.data.repository.owner.login;
                    result.repo = resp.data.pull_request.head.repo.name;
                    result.pr_number = resp.data.pull_request.number;
                    resp = result;
                    /// DELETE THESE LINES!!! DEBUGGING!!!!DEBUGGING!!!!

                }
                this.update(resp);
            } ,(err) => {
                console.error(err + "");
            });

            console.log(payload.pull_request.url + " - " + sha);
        } catch (e) {
            console.error(e);
        }
    };

    update (msg) {
        const target_url="https://api.github.com/repos/"+ msg.owner +"/"+ msg.repo + "/pulls/" + msg.pr_number;
        const statusAPI = this.statusUpdater(octokit, msg.owner, msg.repo, msg.sha);

        let result = 'ok';
        msg.statuses.forEach(element => {
            const updateProjectStatus = statusAPI(element.name, element.status);
            updateProjectStatus(element.status, element.message, target_url);
        });
        return result;
    };

    updateComment(msg) {
        return this.commentAction(msg,this.octokitClient.issues.updateComment);
    }

    createComment(msg) {
        return this.commentAction(msg,this.octokitClient.issues.createComment);
    }

    content(repoName, path) {
        return new Promise((resolve, reject) => {
            octokit.request('GET /repos/'+repoName+'/contents/'+path)
                .then(res=>{
                    let buff = Buffer.from(res.data.content, 'base64');
                    resolve(buff.toString('ascii'));
                }).catch((err)=>{
                    reject(err);
                });
        });
    }

    commentAction(msg, action) {
        return new Promise((resolve,reject) => {
            if(msg.path){
                this.content(msg.owner + "/" + msg.repo, msg.path).then(r => {
                    msg.body = r;
                    msg.body = this._formatComment(msg);
                    resolve( action(msg));
                }).catch((err) => {
                    console.error(err);
                    reject(err);
                });
            }else if (msg.url) {
                httpClient.get(msg.template_url).then(r=>{
                    msg.body = r;
                    msg.body = this._formatComment(msg);
                    resolve( action(msg));
                });
            } else{
                msg.body = this._formatComment(msg);
                resolve( action(msg))
            }
        });
    }

    _formatComment (msg) {
        let body = msg.body;
        Object.entries(msg).forEach((e)=>{
            body = body.replace("${"+e[0]+"}",e[1])
        });
        return body;
    }
    createWebhook(msg) {
        return this.router.createWebhook(msg);
    }

}

const github = new GithubService();
module.exports = github;
