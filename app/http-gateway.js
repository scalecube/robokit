const GithubService = require('./github/github-service');
const cors = require('cors');
const yaml = require('js-yaml');
const express = require('express');
const cfg = require('./config');
const util = require('./utils');
const Notifications = require('./spinnaker/notifications');

class ApiGateway {
  constructor(app, cache) {
    this.app = app;
    this.cache = cache;
    this.githubService = new GithubService(app, cache);
    this.performanceService = require('./perfromance/performance-service');
    this.router = app.route();
    this.router.use(cors());
    this.router.use(express.json());
    this.start(this.router);
    this.notifications = new Notifications(this.githubService);
  }

  start() {
    this.router.get('/server/ping/', (request, response) => {
      console.log('ping request arrived -> reply with pong.');
      response.send({time: Date.now()})
    });

    this.router.post('/checks/status/:owner/:repo/:sha', (request, response) => {
      console.log("### checks status request: " + JSON.stringify(request.body));
      let ctx = this.cache.get(request.params.owner, request.params.repo);
      if (ctx) {
        request.body.owner = request.params.owner;
        request.body.repo = request.params.repo;
        request.body.sha = request.params.sha;

        this.githubService.createCheckRun(ctx,util.mapToChecks(request.body),response).then(res=>{
          response.send(res);
        });

      } else {
        this.sendResponse(response, "no context was found for repo:" + request.body.owner + "/" + request.body.repo);
      }
    });

    this.router.post('/comment/:owner/:repo/', (request, response) => {
      let ctx = this.cache.get(request.params.owner, request.params.repo);
      if (ctx) {
        request.body.owner = request.params.owner;
        request.body.repo = request.params.repo;
        this.thenResponse(this.githubService.updateComment(ctx, request.body), response);
      } else {
        this.sendResponse(response, "no context was found for repo:" + request.body.owner + "/" + request.body.repo);
      }
    });

    this.router.post('/comment/:owner/:repo/:issue_number/', (request, response) => {
      let ctx = this.cache.get(request.params.owner, request.params.repo);
      if (ctx) {
        request.body.owner = request.params.owner;
        request.body.repo = request.params.repo;
        request.body.issue_number = request.params.issue_number;
        this.thenResponse(this.githubService.createComment(ctx, request.body), response);
      } else {
        this.sendResponse(response, "no context was found for repo:" + request.body.owner + "/" + request.body.repo);
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
        r.forEach(e => {
          result.push(e.data)
        });
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
      if (request.params.owner) {
        request.body.owner = request.params.owner
      }
      if (request.params.repo) {
        request.body.repo = request.params.repo
      }
      this.thenResponse(this.githubService.saveWebhook(request.body), response);
    });

    this.router.get('/webhooks/:owner?/:repo?', (request, response) => {
      let msg = {};
      if (request.params.owner) {
        msg.owner = request.params.owner
      }
      if (request.params.repo) {
        msg.repo = request.params.repo
      }
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

  async deployContext(context) {
    let deploy = util.toDeployContext(context);

    if (deploy.is_pull_request && deploy.issue_number) {
      let labels = await this.githubService.labels(deploy.owner, deploy.repo, deploy.issue_number);
      deploy.labeled = util.isLabeled(labels, cfg.deploy.on.pull_request.labeled);
      deploy.labels = labels.map(i => i.name);
    } else {
      deploy.labeled = false;
    }
    return deploy;
  }

  is_check_run_in_status(deploy, propName) {
    if (deploy.is_pull_request) {
      for (let i = 0; i < cfg.deploy.on.pull_request.actions.length; i++) {
        if ((deploy.labeled) && (deploy.check_run_name == cfg.deploy.on.pull_request.actions[i].name)){
          if(deploy.status == cfg.deploy.on.pull_request.actions[i][propName]){
            return true;
          }
        }
      }
    } else {
      for (let i = 0; i < cfg.deploy.on.push.actions.length; i++) {
        if ((deploy.check_run_name == cfg.deploy.on.push.actions[i].name) &&
            (deploy.status == cfg.deploy.on.push.actions[i][propName])) {

          for(let j = 0 ; j< cfg.deploy.on.push.branches.length; j++ ) {
            if(cfg.deploy.on.push.branches[j] == deploy.branch_name){
              if(deploy.status == cfg.deploy.on.push.actions[j][propName]){
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  async onCheckRun(context) {
    console.log(context.payload.check_run.name + " - " + context.payload.check_run.status + " - " + context.payload.check_run.conclusion);
    let deploy = await this.deployContext(context);

    if (this.is_check_run_in_status(deploy,'create_on')) {
      let res = await this.updateCheckRunStatus(context, deploy ,"queued", cfg.deploy.check.queued)
    }
    if (this.is_check_run_in_status(deploy, 'trigger_on')) {
      let res = this.updateCheckRunStatus(context, deploy,"in_progress", cfg.deploy.check.trigger_pipeline)
          .then(res => {
            deploy.check_run_name = util.deployCheckRunName(deploy.is_pull_request);
            deploy.action_type = "deploy";

            console.log(">>>>> TRIGGER CONTINUES DELIVERY PIPELINE >>> " + JSON.stringify(deploy));
            this.route(deploy.owner, deploy.repo, deploy).then( resp => {
              console.log(">>>>> CONTINUES DELIVERY PIPELINE EVENT >>> " + JSON.stringify(resp));
              this.updateCheckRunStatus(context, deploy ,"in_progress", cfg.deploy.check.cd_pipeline_started);
            });
          }).catch(err => {
            console.log(err);
          });
    }
  }

  updateCheckRunStatus(context, deploy, status, output) {
    let check_run = this.checkStatus(deploy, util.deployCheckRunName(deploy.is_pull_request), status);
    check_run.output = output;
    return this.githubService.createCheckRun(context.github, [check_run]);
  }

  createPullRequest(ctx) {
    this.githubService.createPullRequest(ctx);
  }



  route(owner, repo, context) {
    return this.githubService.route(owner, repo, context);
  }

  /**
   * The current status. Can be one of queued, in_progress, or completed. Default: queued
   *
   * Required if you provide completed_at or a status of completed.
   * The final conclusion of the check.
   * Can be one of success, failure, neutral, cancelled, timed_out, or action_required.
   * When the conclusion is action_required, additional details should be provided on the site specified by details_url.
   *   Note: Providing conclusion will automatically set the status parameter to completed.
   * @param deploy
   * @param name
   * @param status
   * @returns {{owner: *, repo: *, name: *, sha: (*|number), status: *}}
   */
  checkStatus(deploy, name, status) {
    let result = {
      name: name,
      owner: deploy.owner,
      repo: deploy.repo,
      head_sha: deploy.sha,
      status: status
    };

    if (status == 'completed') {
      result.conclusion = "success";
      result.completed_at = new Date().toISOString();
    } else if (status == 'cancelled') {
      result.status = 'completed';
      result.conclusion = "cancelled";
    } else if(status == 'in_progress') {
      result.status = 'in_progress';
      result.started_at = new Date().toISOString();
    } else if(status == 'queued') {
      result.status = 'queued';
    }
    return result;
  }

  async onPullRequest(context) {
    let deploy = await this.deployContext(context);
    deploy.action_type = "delete";
    console.log(">>>>> TRIGGER CONTINUES DELIVERY PIPELINE >>> " + JSON.stringify(deploy));
    this.route(deploy.owner, deploy.repo, deploy).then( resp => {
      console.log(">>>>> CONTINUES DELIVERY PIPELINE EVENT >>> " + JSON.stringify(resp));
    });

    return undefined;
  }

  thenResponse(p, response) {
    p.then((r) => {
      response.send(r)
    }).catch((err) => {
      console.error(err);
      response.status(500);
      response.send(err.message)
    });
  };

  sendResponse(response, result) {
    if (result === 'ok') {
      response.send(result)
    } else {
      response.status(500);
      response.send(result);
    }
  };
}

module.exports = ApiGateway;
