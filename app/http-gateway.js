const GithubService = require('./github/github-service');
const cors = require('cors');
const express = require('express');

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

    this.router.post('/pulls/update/status/:owner/:repo/:sha', (request, response) => {
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

    this.router.post('/checks/update/status/:owner/:repo/:sha', (request, response) => {
      console.log("### update status request: " + JSON.stringify(request.body));
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

    this.router.post('/comment/update/:owner/:repo/', (request, response) => {
      let ctx = this.cache.get(request.params.owner, request.params.repo);
      if(ctx) {
        request.body.owner = request.params.owner;
        request.body.repo = request.params.repo;
        this.thenResponse(this.githubService.updateComment(ctx,request.body), response);
      } else {
        this.sendResponse(response,"no context was found for repo:" + request.body.owner+ "/" + request.body.repo );
      }
    });

    this.router.post('/comment/create/:owner/:repo/:issue_number/', (request, response) => {
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

    this.router.get('/traces/get/:owner/:repo/:sha/:filter?', (request, response) => {
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

    this.router.get('/commit/list/:owner/:repo/', (request, response) => {
      this.performanceService.listCommits(request.params.owner,
        request.params.repo).then((r) => {
        writeResponse(r, response)
      }).catch((err) => {
        console.log(err)
      });
    });
  }

  onPullRequest(context) {
    return this.githubService.onPullRequest(context);
  }

  onCheckSuite(context) {
    return this.githubService.onCheckSuite(context);
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


}
module.exports = ApiGateway;
