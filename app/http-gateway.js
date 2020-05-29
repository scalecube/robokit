const GithubService = require('./github/github-service')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const express = require('express')
const cfg = require('./config')
const U = require('./utils')
const githubAuth = require('./github/github-passport')
const templates = require('./statuses/templates')
const pipeline = require('./pipelines/pipeline')
const EnvironmentRepo = require('./environment/repository')

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
    this.repo = new EnvironmentRepo('robokit')
    this.repo.connect('environments')
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
    pipeline.start()
  }

  async onRelease (context) {
    const release = await this.deployContext(context)
    pipeline.release(release).then(resp => {
      // Create Deployment with log_url
    })
  }

  async closePullRequest (context, ctx) {
    if (ctx.namespace !== 'master' && ctx.namespace !== 'develop') {
      for (const i in ctx.robokit.kuberneteses) {
        const k = ctx.robokit.kuberneteses[i]
        const namespaces = await pipeline.getNamespaces(k.cluster)
        if (namespaces && namespaces.includes(`${k.cluster}/${ctx.namespace}`)) {
          pipeline.deleteNamespace(k.cluster, ctx.namespace)
        }
      }
    }
  }

  /**
   ref string Required. The ref to deploy. This can be a branch, tag, or SHA.
   task string Specifies a task to execute (e.g., deploy or deploy:migrations). Default: deploy
   auto_merge boolean Attempts to automatically merge the default branch into the requested ref, if it's behind the default branch. Default: true
   required_contexts array The status contexts to verify against commit status checks. If you omit this parameter, GitHub verifies all unique contexts before creating a deployment. To bypass checking entirely, pass an empty array. Defaults to all unique contexts.
   payload string JSON payload with extra information about the deployment. Default: ""
   environment string Name for the target deployment environment (e.g., production, staging, qa). Default: production
   description string Short description of the deployment. Default: ""
   transient_environment boolean Specifies if the given environment is specific to the deployment and will no longer exist at some point in the future. Default: false
   Note: This parameter requires you to use the application/vnd.github.ant-man-preview+json custom media type.
   production_environment boolean Specifies if the given environment is one that end-users directly interact with. Default: true when environment is production and false otherwise.
   Note: This parameter requires you to use the application/vnd.github.ant-man-preview+json custom media type.
   */
  createDeployment (context, deploy) {
    const deployment = ApiGateway.toDeployment(deploy)
    deployment.environment = deploy.namespace
    return context.github.repos.createDeployment(deployment)
  }

  deploymentStatus (context, deploy, state) {
    const deployment = ApiGateway.toDeployment(deploy, state)
    deployment.deployment_id = deploy.deployment_id
    deployment.description = 'Deployment status: ' + state
    deployment.log_url = `https://github.com/${deploy.owner}/${deploy.repo}/runs/${deploy.check_run_id}`
    deployment.environment_url = process.env.DEPLOYMENT_URL
    return context.github.repos.createDeploymentStatus(deployment)
  }

  static toDeployment (deploy, state) {
    const deployment = {}
    deployment.task = 'deploy'
    deployment.auto_merge = false
    deployment.payload = deploy
    deployment.owner = deploy.owner
    deployment.repo = deploy.repo
    deployment.ref = deploy.branch_name
    deployment.required_contexts = []
    if (state) deployment.state = state
    if (state === 'inactive') {
      deployment.headers = {
        accept: 'application/vnd.github.ant-man-preview+json'
      }
    } else if (state === 'in_progress' || state === 'queued') {
      deployment.headers = {
        accept: 'application/vnd.github.flash-preview+json'
      }
    }
    return deployment
  }

  async deploy (context, deploy) {
    console.log(deploy.check_run_name + ' :  ' + deploy.owner + '/' + deploy.repo + '/' + deploy.namespace + ' - ' + deploy.user)
    const checkRunName = deploy.check_run_name
    const conclusion = deploy.conclusion
    const status = deploy.status
    if (context.user_action === 'cancel_deploy_now') {
      if (context.payload.check_run.external_id) {
        pipeline.cancel(context.payload.check_run.external_id)
          .then(res => {
            this.updateCheckRunStatus(context, deploy, 'cancelled', cfg.deploy.check.canceled)
          }).catch(err => {
            console.error(err)
          })
      }
    } else if (this.checkDeploy(deploy, context.user_action, checkRunName, status, conclusion)) {
      if (!this.isFeatureBranch(deploy)) {
        const deployBranch = this.clone(deploy)
        deployBranch.is_pull_request = false
        deployBranch.check_run_name = cfg.deploy.check.name
        deployBranch.namespace = deploy.branch_name
        delete deployBranch.issue_number
        delete deployBranch.base_branch_name
        this.spinlessDeploy(context, deployBranch)
      }

      if (deploy.is_pull_request) {
        const deployPullRequest = this.clone(deploy)
        deployPullRequest.check_run_name = cfg.deploy.check.name + ' (pull_request)'
        this.spinlessDeploy(context, deployPullRequest)
      }
    }
    return 'OK'
  }

  checkDeploy (deploy, userAction, checkRunName, status, conclusion) {
    if (deploy.check_run_name === 'pull_request' && this.isFeatureBranch(deploy)) {
      return true
    } else if (deploy.check_run_name === 'pull_request' && deploy.base_branch_name === 'master') {
      return true
    } else if (userAction === 'deploy_now') {
      return true
    } else if (this.isRobokitTrigger(checkRunName, status, conclusion) && this.isKnownBranch(deploy)) {
      return true
    } else if (this.isRobokitTrigger(checkRunName, status, conclusion) && this.isFeatureBranch(deploy)) {
      return true
    } else {
      return false
    }
  }

  isFeatureBranch (deploy) {
    return (deploy.is_pull_request &&
      deploy.base_branch_name === 'develop' &&
      U.isLabeled(deploy.labels, [cfg.ROBOKIT_LABEL]))
  }

  isRobokitTrigger (checkRunName, status, conclusion) {
    return (checkRunName === cfg.ROBOKIT_DEPLOY && status === 'completed' && conclusion === 'success')
  }

  isKnownBranch (deploy) {
    return (deploy.branch_name === 'develop' || deploy.branch_name === 'master')
  }

  async spinlessDeploy (context, deploy) {
    const res = await this.updateCheckRunStatus(context, deploy, 'in_progress', cfg.deploy.check.starting)
    deploy.check_run_id = res[0].data.id
    this.createDeployment(context, deploy, 'in_progress')
      .then(async res => {
        deploy.deployment_id = res.data.id
        const trigger = await this.toTrigger(deploy)
        if (trigger.service || trigger.services.length > 0) {
          pipeline.deploy(trigger).then(async resp => {
            if (resp.data) {
              deploy.external_id = resp.data.id
              pipeline.status(resp.data.id, async (log) => {
                deploy.details = log
                const res = await this.checkRunStatus(context, deploy, log, U.tail(log).status)
                deploy.check_run_id = res[0].data.id
                /**
                 state string Required.
                 The state of the status. Can be one of error, failure, inactive, in_progress, queued pending, or success.
                 To use the in_progress and queued states, you must provide the application/vnd.github.flash-preview+json custom media type.
                 */
                this.deploymentStatus(context, deploy, ApiGateway.getState(U.tail(log).status))
              })
            } else {
              const res = await this.updateCheckRunStatus(context, deploy, 'cancelled', cfg.deploy.check.canceled)
              deploy.check_run_id = res[0].data.id
              this.deploymentStatus(context, deploy, 'inactive')
            }
          })
        } else {
          const cancel = cfg.deploy.check.canceled
          cancel.text = cancel.text + '\n< Nothing to deploy! \n< service was not included in configuration file and no additional services configured'
          const res = await this.updateCheckRunStatus(context, deploy, 'cancelled', cancel)
          deploy.check_run_id = res[0].data.id
          this.deploymentStatus(context, deploy, 'inactive')
        }
      }).catch(err => {
        if (err.code === 403 && err.message === 'Resource not accessible by integration') {
          const cancel = cfg.deploy.check.canceled
          const url = `https://github.com/${deploy.owner}/${deploy.repo}/settings/installations`
          cancel.text = `Robokit Github Application requires permissions to create deployments\n ${url}\n ${err.request.url} \n ${err.documentation_url}`
          this.updateCheckRunStatus(context, deploy, 'cancelled', cancel)
        } else {
          const cancel = cfg.deploy.check.canceled
          cancel.text = cancel.text + '\n error message: ' + err.message
          this.updateCheckRunStatus(context, deploy, 'cancelled', cancel)
        }
      })
  }

  static getState (status) {
    let state = 'in_progress'
    if (status === 'ERROR') {
      state = 'error'
    } else if (status === 'SUCCESS') {
      state = 'success'
    }
    return state
  }

  async deployContext (context) {
    let deploy = {}
    if (context.payload.check_run) {
      deploy = U.toCheckRunDeployContext(context)
      try {
        if (deploy.is_pull_request) {
          const labels = await this.githubService.labels(deploy.owner, deploy.repo, deploy.issue_number)
          deploy.labeled = U.isLabeled(labels, cfg.deploy.on.pull_request.labeled)
          deploy.labels = labels.map(i => i.name)
        }
      } catch (e) {
        console.error(e)
      }
    } else if (context.payload.release) {
      deploy = U.toReleaseDeployContext(context)
    } else if (context.payload.pull_request) {
      deploy = U.toPullRequestDeployContext(context)
    }
    deploy.namespace = U.targetNamespace(deploy)
    try {
      const yml = await this.githubService.deployYaml(deploy.owner, deploy.repo, deploy.branch_name)
      deploy.config = yml
      if (yml.source.github) {
        const cfg = yml.source.github
        deploy.robokit = await this.githubService.configYaml(cfg.owner, cfg.repo, cfg.branch, cfg.path)
      }
    } catch (e) {
    }

    deploy.id = context.id
    deploy.user = context.payload.sender.login
    deploy.avatar = context.payload.sender.avatar_url
    deploy.node_id = context.payload.installation.node_id

    return deploy
  }

  async toTrigger (deploy) {
    const trigger = {
      id: deploy.id,
      node_id: deploy.node_id,
      namespace: deploy.namespace,
      sha: deploy.sha,
      labels: deploy.labels,
      user: {
        id: deploy.user
      }
    }

    if (deploy.issue_number) {
      trigger.pr = deploy.issue_number
      trigger.base_namespace = deploy.base_branch_name
    }

    if (deploy.base_branch_name && (deploy.base_branch_name === 'develop' || deploy.base_branch_name === 'master')) {
      trigger.base_namespace = deploy.base_branch_name
    }

    trigger.env = deploy.env

    if (deploy.robokit) {
      if (deploy.robokit.kuberneteses && deploy.robokit.kuberneteses.length > 0) {
        trigger.services = []
        for (const i in deploy.robokit.kuberneteses) {
          const kubernetes = deploy.robokit.kuberneteses[i]
          for (const k in kubernetes.services) {
            const deployment = kubernetes.services[k]
            const service = {
              cluster: kubernetes.cluster,
              repo: deployment.repo,
              owner: deployment.owner || deploy.owner,
              branch: deployment.branch || deploy.base_branch_name || deploy.branch_name,
              image_tag: deployment.branch || deploy.base_branch_name || deploy.branch_name,
              registry: deployment.registry || deploy.robokit.registry
            }
            if (deploy.owner === service.owner && deploy.repo === service.repo) {
              service.image_tag = deploy.branch_name
              trigger.service = service
            } else {
              if (!deploy.config.include) {
                trigger.services.push(service)
              } else {
                for (const inc in deploy.config.include.services) {
                  const branch = deploy.config.include.services[inc].branch
                  if (branch === '*') {
                    trigger.services.push(service)
                  } else if (deploy.is_pull_request && (branch === 'pull_request')) {
                    trigger.services.push(service)
                  } else if (deploy.branch_name === branch) {
                    trigger.services.push(service)
                  }
                }
              }
            }
          }
        }
      }
    }
    trigger.env = await this.repo.environment({
      NAMESPACE: deploy.namespace,
      OWNER: deploy.owner
    })

    return trigger
  }

  toChecks (deploy, log, status) {
    const startDate = new Date(U.head(log).timestamp)
    const endDate = new Date(U.tail(log).timestamp)
    const check = {
      name: deploy.check_run_name,
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
    const checkrun = ApiGateway.checkStatus(deploy, status)
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
  static checkStatus (deploy, status) {
    const result = {
      name: deploy.check_run_name,
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
        } else if (context.payload.action === 'deleted') {
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

  clone (obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}

module.exports = ApiGateway
