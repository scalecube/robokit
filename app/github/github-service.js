const WebhooksRouter = require('./webhooks-router');

class GithubService {

  constructor (app,cache) {
    this.router = new WebhooksRouter();
    this.app = app;
    this.cache = cache;
  }

  onPullRequest (context) {
      try {
        const owner = ctx.payload.repository.owner.login;
        const repo = ctx.payload.repository.name;
        this.router.route(owner,repo,context, (resp) => {

          console.log('<<< ### router response: \n' + JSON.stringify(resp));
          this.updateStatus(context.github, resp);
        }, (err) => {
          console.error(err)
        })
      } catch (e) {
        console.error(e)
      }
  }

  onCheckSuite(context) {
    try {
        const owner = context.payload.repository.owner.login;
        const repo = context.payload.repository.name;
        this.router.route(owner,repo,context, (resp) => {
          if(resp && Array.isArray(resp.checks)) {
            console.log('<<< ###  router response: \n' + JSON.stringify(resp));
            return this.createCheckRun(context.github, resp);
          } else {
            console.log('<<< ###  router response: \n' + resp);
            return Promise.resolve("OK");
          }
      }, (err) => {
        console.error(err)
      })
    } catch (e) {
      console.error(e);
    }
  }

  async createCheckRun(github, msg) {
    let all = [];
    msg.checks.forEach(async check => {
      let req = {
        owner: msg.owner,
        repo: msg.repo,
        head_sha: msg.sha,
        name: check.name,
        status: check.status,
        output: check.output
      };

      if(check.conclusion) {
        req.conclusion = check.conclusion;
      }

      all.push(github.checks.create().then(res=>{
        console.log(res);
      }).catch(err=>{
        console.error(e);
      }));
    });

    return await all;
  }

  updateStatus (context, msg) {
    let all = [];
    if(msg.statuses) msg.statuses.forEach(async element => {
      all.push(context.repos.createStatus({
        owner: msg.owner,
        repo: msg.repo,
        sha: msg.sha,
        state: element.status || "pending",
        context: element.name,
        target_url: element.target_url,
        description: element.message
      }))
    });
    return Promise.all(all);
  };


  updateComment (context, msg) {
    return this.commentAction(msg, context.issues.updateComment)
  }

  createComment (context, msg) {
    return this.commentAction(msg, context.issues.createComment)
  }

  labels(owner,repo,issue_number) {
    return new Promise((resolve, reject) => {
      let ctx = this.cache.get(owner,repo);
      if(ctx) ctx.request('GET /repos/' + owner+ "/" + repo + '/issues/' + issue_number +'/labels')
          .then(res => {
            resolve(res.data);
          }).catch((err) => {
            reject(err);
          })
    })
  }


  content (owner,repo, path, base64) {
    return new Promise((resolve, reject) => {
      let ctx = this.cache.get(owner,repo);
      if(ctx) ctx.request('GET /repos/' + owner+ "/" + repo + '/contents/' + path)
        .then(res => {
          if(!base64)
            resolve(Buffer.from(res.data.content, 'base64').toString('ascii'));
          else{
            resolve(res.data.content);
          }
        }).catch((err) => {
          reject(err);
        })
    })
  }

  commentAction (msg, action) {
    return new Promise((resolve, reject) => {
      if (msg.template) { // create comment from a template managed by this github app.
        if(!msg.template.owner || !msg.template.repo){
          msg.template.owner = msg.owner;
          msg.template.repo = msg.repo;
        }
        this.content(msg.template.owner ,msg.template.repo, msg.template.path).then(r => {
          msg.body = r;
          msg.body = this._formatComment(msg);
          resolve(action(msg))
        }).catch((err) => {
          console.error(err);
          reject(err);
        })
      } else if (msg.url) { // create comment from external source
        httpClient.get(msg.template_url).then(r => {
          msg.body = r;
          msg.body = this._formatComment(msg);
          resolve(action(msg));
        })
      } else { // create comment from simple text 'body'
        msg.body = this._formatComment(msg);
        resolve(action(msg));
      }
    })
  }

  createPullRequest(ctx) {

    this.openPullRequest(ctx,{
      source:{
        owner: "jivygroup",
        repo: "cicd-template",
        files: "template-index.json"
      },
      pr : {
        body: 'Install ci-cd template files on the repository this will enable CI and packaging',
        title: 'Install ci-cd template files'
      },
      branch: "install-CI-files"
    });
  }

  async openPullRequest (context, request) {
    const branch = request.branch; // your branch's name
    const reference = await context.github.gitdata.getRef(context.repo({ ref: 'heads/master' })); // get the reference for the master branch
    const sha =reference.data.object.sha; // reference master sha.

    let ref = await this._getOrCreateRef(context,branch,reference.data.object.sha);
    let resp = await this.content(request.source.owner, request.source.repo, request.source.files,false);
    let files = JSON.parse(resp);

    files.forEach(async (file) =>{
      let content = await this.content(request.source.owner, request.source.repo, file,true);
      try {
      const result = await context.github.repos.createOrUpdateFile(context.repo({
        path: file, // the path to your config file
        message: `adds ${file}`, // a commit message
        content,
        branch,
        sha: sha
      })); // create your config file
      } catch (e) {
        console.info(e.message);
      }
      try{
        return await context.github.pullRequests.create(context.repo({
          title: request.pr.title, // the title of the PR
          head: branch,
          base: 'master', // where you want to merge your changes
          body: request.pr.body, // the body of your PR,
          maintainer_can_modify: true // allows maintainers to edit your app's PR
        }));
      } catch (err) {
        console.error(err)
      }
    });
  };
  async _getOrCreateRef(context,branch,sha){
    let repo = context.payload.repository.name;
    let owner = context.payload.repository.owner.login;
    let reference;

    let get = await context.github.gitdata.listRefs({
      owner,
      repo
    }).then(result => {
      result.data.forEach(ref=>{
        if(ref.ref === `refs/heads/${ branch }`){
          reference = ref;
          sha = sha;
        }
      });
      if(!reference) {
        // create a reference in git for your branch
        context.github.gitdata.createRef(context.repo({
          ref: `refs/heads/${branch}`,
          sha: sha
        })).then(result => {
          reference = result;
        }).catch(err => {
          console.error(err);
        }) // create a reference in git for your branch
      }
    }); // create a reference in git for your branch

    return reference;
  }
  _formatComment (msg) {
    let body = msg.body;
    Object.entries(msg).forEach((e) => {
      body = body.replace('${' + e[0] + '}', e[1])
    });
    return body
  }

  saveWebhook (msg) {
    return this.router.saveWebhook(msg)
  }

  findWebhook (msg) {
    return this.router.findWebhooks(msg)
  }

  route(owner,repo,context) {
    this.router.route(owner,repo,context, (resp) => {
        if((resp) && resp instanceof String) {
          console.log('<<< ###  router response: \n' + resp);
        } else if(resp !== undefined){
          console.log('<<< ###  router response: \n' + JSON.stringify(resp));
        } else{
          console.log('<<< ###  router response: \n' + resp);
        }
    }, (err) => {
      console.error(err)
    });
  }
}


module.exports = GithubService;
