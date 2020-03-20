const GithubService = require('./github/github-service')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const express = require('express')
const cfg = require('./config')
const util = require('./utils')

const githubAuth = require('./github/github-passport')

class ApiGateway {

  constructor (app, cache) {
    this.app = app
    this.cache = cache

    this.router = app.route()
    this.router.use('/ui/', express.static(path.join(__dirname, 'views')))
    this.router.use(cors())
    this.router.use(express.json())
    this.router.use(githubAuth.passport.initialize())
    this.router.use(githubAuth.passport.session())
    this.router.use(require('cookie-parser')());

    this.githubService = new GithubService(app, cache)
    this.performanceService = require('./perfromance/performance-service')

    const Pipeline = require('./pipelines/pipeline')
    this.pipeline = new Pipeline(this.githubService);
  }

  start () {

    this.router.get('/namespaces/', async (request, response) => {
      this.thenResponse(k8s.namespaces(), response)
    })
    this.router.get('/login',(request, response) => {
      this.sendResponse(response, { time: Date.now() })
    })

    this.router.get('/auth/github', githubAuth.authenticate('github'))

    this.router.get('/auth/github/callback', (req, res) => {
      // Successful authentication, redirect home.
      let rk_token = new Buffer(req.query.code+req.id).toString('base64');
      res.cookie('rk_token' ,rk_token);
      githubAuth.approve(rk_token)
      res.redirect(302, '/ui/index.html')
    })

    this.router.get('/server/ping/', (request, response) => {
        this.sendResponse(response, { time: Date.now() })
    })

    this.router.get('/items/*',githubAuth.isAuthenticated, (req, res) => {
      let file = req.originalUrl.replace('/items/', '')
      let fullPath = path.join(__dirname, file)
      fs.readFile(fullPath, (err, json) => {
        try {
          let obj = JSON.parse(json)
          res.json(obj)
        } catch (e) {
          console.log(e)
        }
      })
    })

    this.router.post('/checks/status/:owner/:repo/:sha', (request, response) => {
      console.log('### checks status request: ' + JSON.stringify(request.body))
      const ctx = this.cache.get(request.params.owner, request.params.repo)
      if (ctx) {
        request.body.owner = request.params.owner
        request.body.repo = request.params.repo
        request.body.sha = request.params.sha

        this.githubService.createCheckRun(ctx, util.mapToChecks(request.body), response).then(res => {
          response.send(res)
        })
      } else {
        this.sendResponse(response, 'no context was found for repo:' + request.body.owner + '/' + request.body.repo)
      }
    })

    this.router.post('/comment/:owner/:repo/', (request, response) => {
      const ctx = this.cache.get(request.params.owner, request.params.repo)
      if (ctx) {
        request.body.owner = request.params.owner
        request.body.repo = request.params.repo
        this.thenResponse(this.githubService.updateComment(ctx, request.body), response)
      } else {
        this.sendResponse(response, 'no context was found for repo:' + request.body.owner + '/' + request.body.repo)
      }
    })

    this.router.post('/comment/:owner/:repo/:issue_number/', (request, response) => {
      const ctx = this.cache.get(request.params.owner, request.params.repo)
      if (ctx) {
        request.body.owner = request.params.owner
        request.body.repo = request.params.repo
        request.body.issue_number = request.params.issue_number
        this.thenResponse(this.githubService.createComment(ctx, request.body), response)
      } else {
        this.sendResponse(response, 'no context was found for repo:' + request.body.owner + '/' + request.body.repo)
      }
    })

    this.router.get('/templates/:template?',githubAuth.isAuthenticated, (request, response) => {
      this.thenResponse(this.performanceService.getTemplates(request.params.template), response)
    })

    this.router.get('/commits/:owner/:repo/',githubAuth.isAuthenticated, (request, response) => {
      this.performanceService.listCommits(
        request.params.owner,
        request.params.repo).then(commits => {
        response.send(Array.from(commits.entries()))
      })

    })

    this.router.get('/traces/:owner/:repo/:sha/:filter?', (request, response) => {
      let filter
      if (request.params.filter) filter = JSON.parse(request.params.filter)
      this.performanceService.findReport(request.params.owner,
        request.params.repo,
        request.params.sha,
        filter).then(r => {
        const result = []
        r.forEach(e => {
          result.push(e.data)
        })
        response.send(result)
      })
    })

    this.router.post('/traces/:owner/:repo/:sha/', (request, response) => {
      request.body.owner = request.params.owner
      request.body.repo = request.params.repo
      request.body.sha = request.params.sha

      this.thenResponse(this.performanceService.addReport(
        request.body.owner,
        request.body.repo,
        request.body.sha,
        request.body.traces),
        response)
    })

    this.router.get('/commits/:owner?/:repo?/',githubAuth.isAuthenticated, (request, response) => {

      this.performanceService.listCommits(request.params.owner,
        request.params.repo).then((r) => {
        writeResponse(r, response)
      }).catch((err) => {
        console.log(err)
      })
    })
    this.pipeline.start()
  }

  async deployContext (context) {
    let deploy

    if (context.payload.check_run) {
      deploy = util.toCheckRunDeployContext(context)
    } else {
      deploy = util.toPullRequestDeployContext(context)
    }

    if (deploy.is_pull_request && deploy.issue_number) {
      try {
        let labels = await this.githubService.labels(deploy.owner, deploy.repo, deploy.issue_number)
        deploy.labeled = util.isLabeled(labels, cfg.deploy.on.pull_request.labeled)
        deploy.labels = labels.map(i => i.name)
      } catch (e) {
        console.error(e)
      }
    } else {
      deploy.labeled = false
    }

    return deploy
  }

  async onCheckRun (context) {
    console.log(context.payload.check_run.name + ' - ' + context.payload.check_run.status + ' - ' + context.payload.check_run.conclusion)
    const deploy = await this.deployContext(context)

    if (util.is_check_run_in_status(deploy, 'create_on')) {
      const res = await this.updateCheckRunStatus(context, deploy, 'queued', cfg.deploy.check.queued)
    }

    if (context.user_action == 'cancel_deploy_now') {
      if (context.payload.check_run.external_id) {
        let application = `${deploy.owner}-${deploy.repo}`
        this.pipeline.cancel(context.payload.check_run.external_id)
          .then(res => {
            this.updateCheckRunStatus(context, deploy, 'cancelled', cfg.deploy.check.canceled)
          }).catch(err => {
          console.error(err)
        })
      }
    } else if (context.user_action == 'deploy_now' || util.is_check_run_in_status(deploy, 'trigger_on')) {
      const res = this.updateCheckRunStatus(context, deploy, 'in_progress', cfg.deploy.check.starting)
        .then(res => {
          let trigger = this.toTrigger(deploy,'deploy')
          console.log('>>>>> TRIGGER DEPLOY:\n ' + JSON.stringify(trigger))
          this.pipeline.execute(trigger).then(resp => {
            console.log('<<<<< TRIGGER DEPLOY RESPONSE:\n ' + JSON.stringify(resp.data))
            if (resp.data) {
              deploy.external_id = resp.data.pipeline_id
              this.updateCheckRunStatus(context, deploy, 'in_progress', cfg.deploy.check.running)
            } else {
              this.updateCheckRunStatus(context, deploy, 'cancelled', cfg.deploy.check.canceled)
            }
          })
        }).catch(err => {
          console.log(err)
        })
    }
    return 'OK'
  }

  toTrigger (deploy, action_type) {
    return {
      action_type: action_type,
      owner: deploy.owner,
      repo: deploy.repo,
      branch_name: deploy.branch_name,
      sha: deploy.sha,
      is_pull_request: deploy.is_pull_request,
      issue_number: deploy.issue_number,
      namespace: deploy.namespace,
      labeled: deploy.labeled,
      labels: deploy.labels
    }
  }

  updateCheckRunStatus (context, deploy, status, output) {
    const check_run = this.checkStatus(deploy, cfg.deploy.check.name, status)
    check_run.output = output
    return this.githubService.createCheckRun(context.github, [check_run], deploy)
  }

  createPullRequest (ctx) {
    this.githubService.createPullRequest(ctx)
  }

  route (owner, repo, context) {
    return this.githubService.route(owner, repo, context)
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
  checkStatus (deploy, name, status) {
    const result = {
      name: name,
      owner: deploy.owner,
      repo: deploy.repo,
      head_sha: deploy.sha,
      status: status
    }
    if(deploy.external_id){
      result.external_id = deploy.external_id;
    }
    if (status == 'completed') {
      result.status = 'completed'
      result.conclusion = 'success'
      result.completed_at = new Date().toISOString()
      result.actions = cfg.user_actions.done
    } else if (status == 'cancelled') {
      result.status = 'completed'
      result.conclusion = 'cancelled'
      result.actions = cfg.user_actions.done
    } else if (status == 'in_progress') {
      result.status = 'in_progress'
      result.started_at = new Date().toISOString()
    } else if (status == 'queued') {
      result.status = 'queued'
    }
    return result
  }

  onAppInstall (context) {
    const owner = context.payload.installation.account.login
    if (context.payload.repositories) {
      context.payload.repositories.forEach(repo => {
        let repoName = repo.name
        if (context.payload.action == 'created') {
          this.installCache(owner, repoName, context)
          this.installAppLabels(owner, repoName)
          //this.installPipeline(owner, repoName)
        } else if (context.payload.action == 'deleted') {
          //this.uninstallPipeline(owner, repoName)
        }
      })
    }
  }

  installCache (owner, repo, context) {
    this.cache.set(owner, repo, context.github)
  }

  installAppLabels (owner, repo, context) {
    cfg.labels.forEach(label => {
      this.githubService.createLabel(owner, repo, label)
    })
  }

  installPipeline (owner, repo) {
    console.log(`>> INSTALL APPLICATION: ${owner}/${repo}`)
    this.pipeline.install(owner, repo).then(resp => {
      console.log('<< INSTALL APPLICATION RESPONSE ' + JSON.stringify(resp))
    })
  }

  uninstallPipeline (owner, repoName) {
    console.log(`>> UNINSTALL APPLICATION: ${owner}/${repo}`)
    this.pipeline.uninstall(owner, repo).then(resp => {
      console.log('<< UNINSTALL APPLICATION RESPONSE' + resp.status)
    })
  }

  async onPullRequest (context) {
    // Verify that the label removed is DEPLOY
    if (context.payload.action == 'unlabeled' && context.payload.label.name !== cfg.deploy.label) {
      return
    }
    const deploy = await this.deployContext(context)
    console.log('>> TRIGGER DELETE >>> ' + JSON.stringify(deploy))
    this.pipeline.execute(this.toTrigger(deploy,'delete')).then(resp => {
      console.log('>> TRIGGER DELETE RESPONSE >>> ' + JSON.stringify(resp))
    })
  }

  thenResponse (p, response) {
    p.then((r) => {
      response.send(r)
    }).catch((err) => {
      console.error(err)
      response.status(500)
      response.send(err.message)
    })
  };

  sendResponse (response, result) {
    if (result === 'ok') {
      response.send(result)
    } else {
      response.status(500)
      response.send(result)
    }
  };


}

module.exports = ApiGateway
