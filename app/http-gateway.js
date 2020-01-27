const GithubService = require('./github/github-service');
const cors = require('cors');
const yaml = require('js-yaml');
const express = require('express');
const cfg = require('./config');

class ApiGateway {
  constructor (app, cache) {
    this.app = app;
    this.cache = cache;
    this.githubService = new GithubService(app,cache);
    this.performanceService = require('./perfromance/performance-service');
    this.router = app.route();
    this.router.use(cors());
    this.router.use(express.json());
    this.start(this.router);
  }

  start () {
    this.router.get('/server/ping/', (request, response) => {
      console.log('ping request arrived -> reply with pong.');
      response.send({ time: Date.now() })
    });

    this.router.post('/pulls/status/:owner/:repo/:sha', (request, response) => {
      let ctx = this.cache.get(request.params.owner, request.params.repo);
      if(ctx) {
        request.body.owner = request.params.owner;
        request.body.repo = request.params.repo;
        request.body.sha = request.params.sha;
        this.thenResponse(this.githubService.updateStatus(ctx, request.body),response);
      } else {
        this.sendResponse(response,"no context was found for repo:" + request.body.owner+ "/" + request.body.repo );
      }
    });

    this.router.post('/checks/status/:owner/:repo/:sha', (request, response) => {
      console.log("### checks status request: " + JSON.stringify(request.body));
      let ctx = this.cache.get(request.params.owner, request.params.repo);
      if(ctx) {
        request.body.owner = request.params.owner;
        request.body.repo = request.params.repo;
        request.body.sha = request.params.sha;

        this.thenResponse(this.githubService.createCheckRun(ctx, request.body),response);
      } else {
        this.sendResponse(response,"no context was found for repo:" + request.body.owner+ "/" + request.body.repo );
      }
    });

    this.router.post('/comment/:owner/:repo/', (request, response) => {
      let ctx = this.cache.get(request.params.owner, request.params.repo);
      if(ctx) {
        request.body.owner = request.params.owner;
        request.body.repo = request.params.repo;
        this.thenResponse(this.githubService.updateComment(ctx,request.body), response);
      } else {
        this.sendResponse(response,"no context was found for repo:" + request.body.owner+ "/" + request.body.repo );
      }
    });

    this.router.post('/comment/:owner/:repo/:issue_number/', (request, response) => {
      let ctx = this.cache.get(request.params.owner, request.params.repo);
      if(ctx) {
        request.body.owner = request.params.owner;
        request.body.repo = request.params.repo;
        request.body.issue_number = request.params.issue_number;
        this.thenResponse(this.githubService.createComment(ctx, request.body), response);
      } else {
        this.sendResponse(response,"no context was found for repo:" + request.body.owner+ "/" + request.body.repo );
      }
    });

    this.router.get('/commits/:owner/:repo/', (request, response) => {
      this.thenResponse(this.performanceService.listCommits(
        request.params.owner,
        request.params.repo), response)
    });

    this.router.get('/traces/:owner/:repo/:sha/:filter?', (request, response) => {
      let filter;
      if (request.params.filter) filter = JSON.parse(request.params.filter)
      this.performanceService.findReport(request.params.owner,
          request.params.repo,
          request.params.sha,
          filter).then(r => {
        const result = [];
        r.forEach(e => { result.push(e.data) });
        response.send(result);
      });
    });

    this.router.post('/traces/:owner/:repo/:sha/', (request, response) => {
      request.body.owner = request.params.owner;
      request.body.repo = request.params.repo;
      request.body.sha = request.params.sha;
      this.thenResponse(this.performanceService.addReport(
          request.body.owner,
          request.body.repo,
          request.body.sha,
          request.body.traces),
      response);
    });

    this.router.post('/webhooks/:owner?/:repo?', (request, response) => {
      if (request.params.owner) { request.body.owner = request.params.owner }
      if(request.params.repo)   { request.body.repo = request.params.repo   }
      this.thenResponse(this.githubService.saveWebhook(request.body), response);
    });

    this.router.get('/webhooks/:owner?/:repo?', (request, response) => {
      let msg = {};
      if (request.params.owner) { msg.owner = request.params.owner }
      if(request.params.repo)   { msg.repo = request.params.repo   }
      this.thenResponse(this.githubService.findWebhook(msg), response);
    });

    this.router.get('/webhooks/:owner/:repo/:sha/', (request, response) => {
      this.performanceService.findReport(
          request.params.owner,
          request.params.repo,
          request.params.sha)
          .then(r => {
              const result = [];
              r.forEach(e => {
                result.push(e.data);
              });
        this.writeResponse(result, response);
      });
    });

    this.router.get('/commits/:owner/:repo/', (request, response) => {
      this.performanceService.listCommits(request.params.owner,
        request.params.repo).then((r) => {
        writeResponse(r, response)
      }).catch((err) => {
        console.log(err)
      });
    });
  }

  async labels(owner,repo,issue_number){
    try {
      return await this.githubService.labels(owner,repo,issue_number);
    } catch(err) {
      console.error(err);
    }
  }

  async onPullRequest(context) {
    return this.githubService.onPullRequest(context);
  }

  isLabeled(labels, names) {
    let result = false;
    if(labels && Array.isArray(labels)) {
      labels.forEach(label => {
        names.forEach(name=>{
          if(label.name == name){
            result = true;
            return true;
          }
        });
      });
    }
    return result;
  }

  isPullRequest(context){
    if(context.payload.check_suite){
      return (context.payload.check_run.check_suite && context.payload.check_suite.pull_requests>0);
    } else {
      return (context.payload.check_run.pull_requests && context.payload.check_run.pull_requests.length>0);
    }
  }

  issueNumber(context) {
    if (context.payload.check_run) {
      if (context.payload.check_run.check_suite) {
        if (context.payload.check_run.check_suite.pull_requests.length > 0) {
          return context.payload.check_run.check_suite.pull_requests[0].number;
        }
      } else {
        if (context.payload.check_run.pull_requests.length > 0) {
          return context.payload.check_run.pull_requests[0].number;
        }
      }
    }
  }

  branchName(context) {
    if(context.payload.check_suite) {
      return context.payload.check_suite.head_branch;
    } else if (context.payload.check_run) {
      return context.payload.check_run.check_suite.head_branch;
    }
  }

  async onCheckSuite(context) {
    /*
    if (context.payload.action != 'completed') {
      check_run = this.checkStatus(owner, repo, sha, cfg.deploy.name, "cancelled");
      check_run.checks[0].output = {
        title: "Robo-kit is Deploying branch: " + branchName + " cancelled",
        summary: "Cancelled a Continues-Deployment pipeline",
        text: "the deployment is cancelled because CI failed"
      }
    }*/
  }

  async deployContext(context) {
    let deploy = {
      owner : context.payload.repository.owner.login,
      repo : context.payload.repository.name,
      sha : context.payload.check_run.head_sha,
      conclusion: context.payload.check_run.conclusion,
      checkName: context.payload.check_run.name,
      action: context.payload.action,
      branchName : this.branchName(context),
      isPullRequest : this.isPullRequest(context)
    };

    if (deploy.isPullRequest) {
      deploy.issue_number = this.issueNumber(context);

      if(deploy.issue_number){
        let labels = await this.labels(deploy.owner, deploy.repo, deploy.issue_number);
        deploy.labeled =this.isLabeled(labels, cfg.deploy.on.pull_request.labeled);
      } else{
        deploy.labeled = false;
      }
    }
    return deploy;
  }

  ci_action_status(deploy, action) {

      if(deploy.isPullRequest) {
        for(let i =0; i < cfg.deploy.on.actions.length ; i++) {
          if ((deploy.checkName == cfg.deploy.on.pull_request.actions[i]) && (deploy.action == action)) {
            if (deploy.labeled) {
              return true;
            } else if (!(deploy.isPullRequest) && (deploy.branchName == 'develop' || deploy.branchName === 'master')) {
              return true;
            }
          }
        }
      } else {
        for(let i =0; i < cfg.deploy.on.push.actions.length ; i++) {
          if ( (deploy.checkName == cfg.deploy.on.push.actions[i]) && (deploy.action == action)) {
            return true;
          }
        }
    }
    return false;
  }


  async onCheckRun(context) {
    console.log(context.payload.check_run.name + " - " +context.payload.check_run.conclusion);
    let deploy = await this.deployContext(context);

    if (this.ci_action_status(deploy,'created')) {
      let check_run = this.checkStatus(deploy, cfg.deploy.check.name, "queued");
      check_run.checks = [{output: cfg.deploy.check.queued}];
      this.githubService.createCheckRun(context.github, check_run);
    }

    if (this.ci_action_status(deploy,'completed')) {
      let check_run = this.checkStatus(deploy, cfg.deploy.check.name, "in_progress");
      check_run.checks = [{output: cfg.deploy.check.in_progress}];

      return this.githubService.createCheckRun(context.github, check_run).then(res=>{
        // TRIGGER CD SERVER DEPLOY AND THEN:
        let req = {
          url: deploy.owner + "-" + deploy.repo + "-" + deploy.branchName,
          namespace: "scalecube-gihub-gateway-pr-111",
          vault_path: "secrets/scalecube/gihub-gateway/pr-111"
        };
        this.route(deploy.owner, deploy.repo, deploy);
      }).catch(err=>{
        console.log(err);
      });

    }
  }


  createPullRequest(ctx) {
    this.githubService.createPullRequest(ctx);
  }

  async deployYaml(context){
    try {
      let deploy = await this.githubService.content(context.payload.repository.owner.login,
          context.payload.repository.name,
          "deploy.yml");

      if(deploy) context.deploy = yaml.load(deploy);
    } catch(err) {
      console.error(err);
    }
    return context;
  }

  thenResponse (p, response) {
    p.then((r) => {
      response.send(r)
    }).catch((err) => {
      console.error(err);
      response.status(500);
      response.send(err.message)
    });
  };

  sendResponse (response, result) {
    if (result === 'ok') {
      response.send(result)
    } else {
      response.status(500)
      response.send('PR URL is wrong/ not found or not waiting for update.')
    }
  };


  route(owner,repo,context) {
    this.githubService.route(owner,repo,context);
  }

  checkStatus(deploy,name, status) {
    let result = {
      owner: deploy.owner,
      repo: deploy.repo,
      sha: deploy.sha
    };

    if (status == 'completed') {
      return result.checks = [{
          name: name,
          status: 'completed',
          conclusion: "success"
        }]
      }
    else if (status == 'cancelled') {
      return result.checks =[{
          name: name,
          status: "completed",
          conclusion: "cancelled"
        }]
    } else {
      return result.checks = [{
          name: name,
          status: status
        }]
      }
    }
  }

module.exports = ApiGateway;
