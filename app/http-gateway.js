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

  isLabeled(labels, name) {
    let result = false;
    if(labels && Array.isArray(labels)) {
      labels.forEach(label => {
        if(label.name == name){
          result = true;
          return true;
        }
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

  issueNumber(context){
    if(context.payload.check_suite){
      if (context.payload.check_run.check_suite && context.payload.check_suite.pull_requests>0) {
        context.payload.check_suite.pull_requests[0].number;
      }
    } else if(context.payload.check_run) {
      if (context.payload.check_run.pull_requests && context.payload.check_run.pull_requests.length>0) {
        context.payload.check_run.pull_requests[0].number;
      }
    }
  }

  branchName(context) {
    if (context.payload.check_run.head_branch == 'develop') {
      return 'develop';
    } else if (context.payload.check_run.head_branch == 'master') {
      return 'master';
    } else if (context.payload.check_run.check_suite) {
      if (context.payload.check_run.check_suite.head_branch == 'develop') {
        return 'develop';
      } else if (context.payload.check_run.check_suite.head_branch == 'master') {
        return 'master';
      }
    } else {
      return undefined;
    }
  }

  async onCheckSuite(context) {
    let owner = context.payload.repository.owner.login;
    let repo = context.payload.repository.name;
    let sha = context.payload.check_suite.head_sha;
    let branchName = this.branchName(context);
    let check_run;

    if (context.payload.action == 'requested') {
      check_run = this.checkStatus(owner, repo, sha, cfg.deploy.name, "queued");
      check_run.checks[0].output = {
        title: "Deploy is Waiting for status checks",
        summary: "deploy will start when check suite completes",
        text: "waiting for CI to complete successfully"
      }
    } else if (context.payload.action != 'completed') {
      check_run = this.checkStatus(owner, repo, sha, cfg.deploy.name, "cancelled");
      check_run.checks[0].output = {
        title: "Robo-kit is Deploying branch: " + branchName + " cancelled",
        summary: "Cancelled a Continues-Deployment pipeline",
        text: "the deployment is cancelled because CI failed"
      }
    }

    if (check_run) {
      this.githubService.createCheckRun(context.github, check_run);
    }
  }


  ciCompleted(check_run, name, action, conclusion,
                    labeled,branchName,isPullRequest) {

    if ( (check_run == name) && (action == 'completed') && (conclusion== 'success')) {
        if ((branchName == 'develop' || branchName === 'master')){
          return true;
        } else if(isPullRequest && labeled){
          return true;
        }
    }
    return false;
  }

  async onCheckRun(context) {
    console.log(context.payload.check_run.name + " - " +context.payload.check_run.conclusion);
    let owner = context.payload.repository.owner.login;
    let repo = context.payload.repository.name;
    let sha = context.payload.check_run.head_sha;
    let branchName = this.branchName(context);
    let isPullRequest = this.isPullRequest(context);
    let labeled = false;
    let issue_number = undefined;
    if(isPullRequest){
      issue_number = issueNumber(context);
    }


    if (isPullRequest) {
      issue_number = context.payload.check_run.pull_requests[0].number;
      let labels = await this.labels(owner, repo, issue_number);
      labeled =this.isLabeled(labels, cfg.deploy.label.name);
    }

    if (this.ciCompleted(context.payload.check_run.name,"trigger_deploy",
        context.payload.action,
        context.payload.check_run.conclusion,
        labeled,
        branchName,
        isPullRequest)) {

      let check_run = this.checkStatus(owner, repo, sha, cfg.deploy.name, "in_progress");
      check_run.checks[0].output = {
        title: "Robo-kit is Deploying branch: " + branchName,
        summary: "Triggered a Continues-Deployment pipeline",
        text: "Waiting for Continues deployment status updates"
      };

      return this.githubService.createCheckRun(context.github, check_run).then(res=>{
        // TRIGGER CD SERVER DEPLOY AND THEN:
        this.route(owner, repo, {
          owner: owner,
          repo: repo,
          sha: sha,
          tag: branchName,
          pr_num: issue_number
        });
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

  checkStatus(owner,repo,sha, name, status) {
    if (status == 'completed') {
      return {
        owner: owner,
        repo: repo,
        sha: sha,
        checks: [{
          name: name,
          status: status,
          conclusion: "success"
        }]
      }

    } else if (status == 'cancelled') {
      return {
        owner: owner,
        repo: repo,
        sha: sha,
        checks: [{
          name: name,
          status: "completed",
          conclusion: "cancelled"
        }]
      }

    } else {
      return {
        owner: owner,
        repo: repo,
        sha: sha,
        checks: [{
          name: name,
          status: status
        }]
      }
    }
  }
}
module.exports = ApiGateway;
