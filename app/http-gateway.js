const GithubService = require('./github-service')
const cfg = require('./config')
const U = require('./utils')
const templates = require('./statuses/templates')
const envService = require('./environments')

class ApiGateway {
  constructor (app, cache) {
    this.app = app
    this.cache = cache
    this.githubService = new GithubService(app, cache)
    envService.connect()
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
    return context.octokit.repos.createDeployment(deployment)
  }

  deploymentStatus (context, deploy, state) {
    const deployment = ApiGateway.toDeployment(deploy, state)
    deployment.deployment_id = deploy.deployment_id
    deployment.description = 'Deployment status: ' + state
    deployment.log_url = `https://github.com/${deploy.owner}/${deploy.repo}/runs/${deploy.check_run_id}`
    deployment.environment_url = process.env.DEPLOYMENT_URL
    return context.octokit.repos.createDeploymentStatus(deployment)
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
    console.log(deploy.check_run_name + ' :  ' + deploy.owner + '/' + deploy.repo + '/' + deploy.namespace + ' - ' + deploy.user + ' - ' + deploy.status + ' - ' + deploy.conclusion)
    const checkRunName = deploy.check_run_name
    const conclusion = deploy.conclusion
    const status = deploy.status
    if (context.user_action === 'cancel_deploy_now') {
      if (context.payload.check_run.external_id) {
        this.updateCheckRunStatus(context, deploy, 'cancelled', cfg.deploy.check.canceled)
      }
    } else if (this.checkDeploy(deploy, context.user_action, checkRunName, status, conclusion)) {
      if (!this.isFeatureBranch(deploy)) {
        const deployBranch = this.clone(deploy)
        deployBranch.is_pull_request = false
        deployBranch.check_run_name = cfg.deploy.check.name
        if (!deploy.release) {
          deployBranch.namespace = deploy.branch_name
        }
        delete deployBranch.issue_number
        delete deployBranch.base_branch_name
        this.enviromentDeploy(context, deployBranch)
      }

      if (deploy.is_pull_request && U.isLabeled(deploy.labels, cfg.ROBOKIT_LABEL)) {
        const deployPullRequest = this.clone(deploy)
        deployPullRequest.check_run_name = cfg.deploy.check.name + ' (pull_request)'
        this.enviromentDeploy(context, deployPullRequest)
      }
    }
    return 'OK'
  }

  checkDeploy (deploy, userAction, checkRunName, status, conclusion) {
    if (this.isRobokitTrigger(checkRunName, status, conclusion)) {
      console.log('robokit deploy job finished successfully')
    }

    if (deploy.check_run_name === 'pull_request' && this.isFeatureBranch(deploy)) {
      return true
    } else if (userAction === 'deploy_now') {
      return true
    } else if (this.isRobokitTrigger(checkRunName, status, conclusion)) {
      return deploy.release || this.isKnownBranch(deploy) || this.isFeatureBranch(deploy)
    } else if (this.isRobokitRelease(checkRunName, status, conclusion)) {
      return true
    } else {
      return false
    }
  }

  isFeatureBranch (deploy) {
    return (deploy.is_pull_request && U.isLabeled(deploy.labels, [cfg.ROBOKIT_LABEL]))
  }

  isRobokitRelease (checkRunName, status, conclusion) {
    return (checkRunName === 'Robokit CD (release)' && status === 'completed' && conclusion === 'success')
  }

  isRobokitTrigger (checkRunName, status, conclusion) {
    return (checkRunName === cfg.ROBOKIT_DEPLOY && status === 'completed' && conclusion === 'success')
  }

  isKnownBranch (deploy) {
    return (deploy.branch_name === 'develop' || deploy.branch_name === 'master')
  }

  async enviromentDeploy (context, deploy) {
    const res = await this.updateCheckRunStatus(context, deploy, 'in_progress', cfg.deploy.check.starting)
    deploy.check_run_id = res[0].data.id

    this.createDeployment(context, deploy, 'in_progress')
      .then(async res => {
        deploy.deployment_id = res.data.id
        const log = []
        const self = this
        console.log('Environment Service Deploy Request: ' + JSON.stringify(deploy))
        envService.deploy(deploy).subscribe({
          next (resp) {
            log.push(resp.d)
            deploy.details = log
          },
          async error (err) {
            const output = cfg.deploy.check.canceled
            output.text = output.text + '\n reason: ' + err.d.errorMessage
            const res = await self.updateCheckRunStatus(context, deploy, 'cancelled', output)
            deploy.check_run_id = res[0].data.id
            self.deploymentStatus(context, deploy, 'inactive')
          },
          async complete () {
            console.log('Stream completed updating status')
            const res = await self.checkRunStatus(context, deploy, log, U.tail(log).status)
            deploy.check_run_id = res[0].data.id
            /**
             state string Required.
             The state of the status. Can be one of error, failure, inactive, in_progress, queued pending, or success.
             To use the in_progress and queued states, you must provide the application/vnd.github.flash-preview+json custom media type.
             */
            self.deploymentStatus(context, deploy, ApiGateway.getState(U.tail(log).status))
          }
        })
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
      await this.tryReleaseVersion(deploy)
    } else if (context.payload.release) {
      deploy = U.toReleaseDeployContext(context)
    } else if (context.payload.pull_request) {
      deploy = U.toPullRequestDeployContext(context)
    }

    deploy.namespace = U.targetNamespace(deploy)
    deploy.id = context.id
    deploy.user = context.payload.sender.login
    deploy.avatar = context.payload.sender.avatar_url
    deploy.node_id = context.payload.installation.node_id

    return deploy
  }

  async tryReleaseVersion (deploy) {
    try {
      const release = await this.githubService.release(deploy.owner, deploy.repo, deploy.branch_name)
      deploy.branch_name = release.target_commitish
      deploy.release = true
      deploy.prerelease = release.prerelease
      deploy.tag_name = release.tag_name.replace(/^v/, '')
      deploy.draft = release.draft
      deploy.release_id = release.id
      console.log('Release Version')
    } catch (e) {
      deploy.release = false
    }
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

    // eslint-disable-next-line no-template-curly-in-string
    md = md.split('${progress}').join(status)
    // eslint-disable-next-line no-template-curly-in-string
    md = md.split('${duration}').join(duration + 's')
    // eslint-disable-next-line no-template-curly-in-string
    md = md.split('${log_details}').join(U.toDetails(log))

    if (md.includes('object')) {
      console.log(md)
    }

    return {
      title: status,
      // eslint-disable-next-line no-template-curly-in-string
      summary: template.summary.replace('${conclusion}', U.getStatus(status).conclusion),
      text: md
    }
  }

  updateCheckRunStatus (context, deploy, status, output) {
    const checkrun = ApiGateway.checkStatus(deploy, status)
    checkrun.output = output
    return this.githubService.createCheckRun(context.octokit, [checkrun], deploy)
  }

  checkRunStatus (context, deploy, log, status) {
    const checks = this.toChecks(deploy, log, status)
    return this.githubService.createCheckRun(context.octokit, checks, deploy)
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
    this.cache.set(owner, repo, context.octokit)
  }

  installAppLabels (owner, repo, context) {
    cfg.labels.forEach(label => {
      this.githubService.createLabel(owner, repo, label)
    })
  }

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
