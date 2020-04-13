const GithubService = require('./github/github-service')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const express = require('express')
const cfg = require('./config')
const U = require('./utils')
const githubAuth = require('./github/github-passport')
const templates = require('./statuses/templates')

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
    this.router.use(require('cookie-parser')())

    this.githubService = new GithubService(app, cache)
    this.performanceService = require('./perfromance/performance-service')

    const Pipeline = require('./pipelines/pipeline')
    this.pipeline = new Pipeline(this.githubService)
  }

  start () {
    this.router.get('/namespaces/', async (request, response) => {
      // eslint-disable-next-line no-undef
      this.thenResponse(k8s.namespaces(), response)
    })
    this.router.get('/login', (request, response) => {
      ApiGateway.sendResponse(response, { time: Date.now() })
    })

    this.router.get('/auth/github', githubAuth.authenticate('github'))

    this.router.get('/auth/github/callback', (req, res) => {
      // Successful authentication, redirect home.
      // eslint-disable-next-line camelcase,node/no-deprecated-api
      const rk_token = new Buffer(req.query.code + req.id).toString('base64')
      res.cookie('rk_token', rk_token)
      githubAuth.approve(rk_token)
      res.redirect(302, '/ui/index.html')
    })

    this.router.get('/server/ping/', (request, response) => {
      ApiGateway.sendResponse(response, { time: Date.now() })
    })

    this.router.get('/items/*', githubAuth.isAuthenticated, (req, res) => {
      const file = req.originalUrl.replace('/items/', '')
      const fullPath = path.join(__dirname, file)
      // eslint-disable-next-line handle-callback-err
      fs.readFile(fullPath, (err, json) => {
        try {
          const obj = JSON.parse(json)
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

        this.githubService.createCheckRun(ctx, U.mapToChecks(request.body), response).then(res => {
          response.send(res)
        })
      } else {
        ApiGateway.sendResponse(response, 'no context was found for repo:' + request.body.owner + '/' + request.body.repo)
      }
    })

    this.router.post('/comment/:owner/:repo/', (request, response) => {
      const ctx = this.cache.get(request.params.owner, request.params.repo)
      if (ctx) {
        request.body.owner = request.params.owner
        request.body.repo = request.params.repo
        this.thenResponse(this.githubService.updateComment(ctx, request.body), response)
      } else {
        ApiGateway.sendResponse(response, 'no context was found for repo:' + request.body.owner + '/' + request.body.repo)
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
        ApiGateway.sendResponse(response, 'no context was found for repo:' + request.body.owner + '/' + request.body.repo)
      }
    })

    this.router.get('/templates/:template?', githubAuth.isAuthenticated, (request, response) => {
      this.thenResponse(this.performanceService.getTemplates(request.params.template), response)
    })

    this.router.get('/commits/:owner/:repo/', githubAuth.isAuthenticated, (request, response) => {
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

    this.router.get('/commits/:owner?/:repo?/', githubAuth.isAuthenticated, (request, response) => {
      this.performanceService.listCommits(request.params.owner,
        request.params.repo).then((r) => {
        this.writeResponse(r, response)
      }).catch((err) => {
        console.log(err)
      })
    })
    this.pipeline.start()
  }

  async onRelease (context) {
    const release = await this.deployContext(context)
    this.pipeline.release(release).then(resp => {

      // Create Deployment with log_url
    })
  }

  async onCheckRun (context) {
    console.log(context.payload.check_run.name + ' - ' + context.payload.check_run.status + ' - ' + context.payload.check_run.conclusion)
    const deploy = await this.deployContext(context)

    if (context.user_action === 'cancel_deploy_now') {
      if (context.payload.check_run.external_id) {
        this.pipeline.cancel(context.payload.check_run.external_id)
          .then(res => {
            this.updateCheckRunStatus(context, deploy, 'cancelled', cfg.deploy.check.canceled)
          }).catch(err => {
            console.error(err)
          })
      }
    } else if (context.user_action === 'deploy_now' || U.on(deploy, cfg.ROBOKIT_DEPLOY, cfg.queued)) {
      this.updateCheckRunStatus(context, deploy, 'in_progress', cfg.deploy.check.starting)
        .then(res => {
          const trigger = ApiGateway.toTrigger(deploy)
          this.pipeline.deploy(trigger).then(resp => {
            if (resp.data) {
              deploy.external_id = resp.data.id
              this.pipeline.status(deploy.owner, deploy.repo, resp.data.id, (log) => {
                deploy.details = log
                this.checkRunStatus(context, deploy, log, U.tail(log).status)
              })
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

  async deployContext (context) {
    let deploy = {}
    if (context.payload.check_run) {
      deploy = U.toCheckRunDeployContext(context)
    } else if (context.payload.release) {
      deploy = U.toReleaseDeployContext(context)
    }
    if (deploy.is_pull_request && deploy.issue_number) {
      try {
        const labels = await this.githubService.labels(deploy.owner, deploy.repo, deploy.issue_number)
        deploy.labeled = U.isLabeled(labels, cfg.deploy.on.pull_request.labeled)
        deploy.labels = labels.map(i => i.name)
      } catch (e) {
        console.error(e)
      }
    } else {
      deploy.labeled = false
    }
    try {
      deploy.robokit = await this.githubService.deployYaml(deploy.owner, deploy.repo)
    } catch (e) {
    }

    deploy.id = context.id
    deploy.user = context.payload.sender.login
    deploy.avatar = context.payload.sender.avatar_url
    deploy.node_id = context.payload.installation.node_id

    return deploy
  }

  static toTrigger (deploy) {
    const trigger = {
      owner: deploy.owner,
      repo: deploy.repo,
      branch_name: deploy.branch_name,
      sha: deploy.sha,
      is_pull_request: deploy.is_pull_request,
      issue_number: deploy.issue_number,
      namespace: deploy.namespace,
      labeled: deploy.labeled,
      labels: deploy.labels,
      user: deploy.user,
      avatar: deploy.avatar,
      id: deploy.id,
      node_id: deploy.node_id
    }
    if (deploy.robokit) {
      if (deploy.robokit.registry) {
        trigger.registry = {}
        if (deploy.robokit.registry.helm) {
          trigger.registry.helm = deploy.robokit.registry.helm
        }

        if (deploy.robokit.registry.docker) {
          trigger.registry.docker = deploy.robokit.registry.docker
        }
      }

      if (deploy.robokit.kubernetes) {
        if (deploy.robokit.kubernetes.context) {
          trigger.kubernetes = {
            cluster_name: deploy.robokit.kubernetes.cluster_name
          }
        }

        if (deploy.robokit.kubernetes.namespace) {
          trigger.namespace = deploy.robokit.kubernetes.namespace
        }
      }
    }
    return trigger
  }

  toChecks (deploy, log, status) {
    const startDate = new Date(U.head(log).timestamp)
    const endDate = new Date(U.tail(log).timestamp)
    const check = {
      name: cfg.deploy.check.name,
      owner: deploy.owner,
      repo: deploy.repo,
      head_sha: deploy.sha,
      status: U.getStatus(status).status,
      output: this.toOutput(cfg.deploy.check.update, log, deploy),
      external_id: log[0].id
    }

    if (U.getStatus(status).conclusion) {
      try {
        check.completed_at = endDate.toISOString()
        check.started_at = startDate.toISOString()
      } catch (e) {}
      check.conclusion = U.getStatus(status).conclusion
      check.actions = cfg.user_actions.done
    } else {
      check.actions = cfg.user_actions.in_progress
    }
    return [check]
  }

  toOutput (template, log, deploy) {
    const startDate = new Date(U.head(log).timestamp)
    const endDate = new Date(U.tail(log).timestamp)
    const duration = endDate.getSeconds() - startDate.getSeconds()
    const status = U.tail(log).status
    let md = templates.get(template.template)

    Object.entries(deploy).forEach((e) => {
      md = md.split('${' + e[0] + '}').join(e[1])
    })

    md = md.split('${progress}').join(status)
    md = md.split('${duration}').join(duration + 's')
    md = md.split('${log_details}').join(U.toDetails(log))

    if (md.includes('object')) {
      console.log(md)
    }

    return {
      title: status,
      summary: template.summary.replace('${conclusion}', U.getStatus(status).conclusion),
      text: md
    }
  }

  updateCheckRunStatus (context, deploy, status, output) {
    const checkrun = ApiGateway.checkStatus(deploy, cfg.deploy.check.name, status)
    checkrun.output = output
    return this.githubService.createCheckRun(context.github, [checkrun], deploy)
  }

  checkRunStatus (context, deploy, log, status) {
    const checks = this.toChecks(deploy, log, status)
    return this.githubService.createCheckRun(context.github, checks, deploy)
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
  static checkStatus (deploy, name, status) {
    const result = {
      name: name,
      owner: deploy.owner,
      repo: deploy.repo,
      head_sha: deploy.sha,
      status: status
    }
    if (deploy.external_id) {
      result.external_id = deploy.external_id
    }
    if (status === 'completed') {
      result.status = 'completed'
      result.conclusion = 'success'
      result.completed_at = new Date().toISOString()
      result.actions = cfg.user_actions.done
    } else if (status === 'cancelled') {
      result.status = 'completed'
      result.conclusion = 'cancelled'
      result.actions = cfg.user_actions.done
    } else if (status === 'in_progress') {
      result.status = 'in_progress'
      result.started_at = new Date().toISOString()
    } else if (status === 'queued') {
      result.status = 'queued'
    }
    return result
  }

  onAppInstall (context) {
    const owner = context.payload.installation.account.login
    if (context.payload.repositories) {
      context.payload.repositories.forEach(repo => {
        const repoName = repo.name
        if (context.payload.action === 'created') {
          this.installCache(owner, repoName, context)
          this.installAppLabels(owner, repoName)
          // this.installPipeline(owner, repoName)
        } else if (context.payload.action === 'deleted') {
          // this.uninstallPipeline(owner, repoName)
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
    console.log(`>> UNINSTALL APPLICATION: ${owner}/${repoName}`)
    this.pipeline.uninstall(owner, repoName).then(resp => {
      console.log('<< UNINSTALL APPLICATION RESPONSE' + resp.status)
    })
  }

  async onPullRequest (context) {
    // Verify that the label removed is DEPLOY
    if (context.payload.action === 'unlabeled' && context.payload.label.name !== cfg.deploy.label) {
      return
    }
    const deploy = await this.deployContext(context)
    console.log('>> TRIGGER DELETE >>> ' + JSON.stringify(deploy))
    this.pipeline.execute(ApiGateway.toTrigger(deploy, 'delete')).then(resp => {
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

  static sendResponse (response, result) {
    if (result === 'ok') {
      response.send(result)
    } else {
      response.status(500)
      response.send(result)
    }
  };
}

module.exports = ApiGateway
