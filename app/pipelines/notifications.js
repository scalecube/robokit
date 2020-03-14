const Repository = require('./repository')
const CronJob = require('cron').CronJob
const cfg = require('../config')
const util = require('../utils')
const templates = require('../statuses/templates')

class Notifications {
  constructor (pipeline, githubService) {
    this.githubService = githubService
    this.repository = new Repository(process.env.MONGO_DB_COLLECTION)
    this.repository.connect('executions')
    this.pipeline = pipeline

    setTimeout(() => {
      console.log("START POLL")
      this.job = new CronJob('*/15 * * * * *', async () => {
        this._poll()
      }, null, true, 'America/Los_Angeles')
    }, 15000)
  }

  async start () {
    this.job.start()
  }

  store (data) {
    return this.repository.insert(data).then(res => {
      this.job.start()
    })
  }

  async _poll () {
    if (this.repository) {
      let count = await this.repository.count()
      this.repository.find()
        .then(async items => {
          items.forEach(async (deploy) => {
            try {
              let res = await this.pipeline.status(deploy.external_id)
              let pipeline = res.data.status
              if (pipeline) {
                let owner = deploy.owner
                let repo = deploy.repo
                if (owner && repo) {
                  const github = this.githubService.cache.get(owner, repo)
                  this.githubService.createCheckRun(github, this.toChecks(pipeline, deploy))
                    .then(res => {
                      if (pipeline.status != 'RUNNING' || pipeline.status == 'NOT_STARTED') {
                        this.repository.delete(item._id)
                      }
                    })
                }
              } else {
                this.cancel(deploy)
                this.repository.delete(deploy._id)
              }
            } catch (err) {
              this.cancel(deploy)
              this.repository.delete(deploy._id)
            }
          })
        }).catch(err => {
        console.error(err)
      })
    }
  }

  async delay (sec) {
    return new Promise((resolve, reject) => {
      sec = Math.floor(Math.random() * Math.floor(sec))
      setTimeout(() => { resolve(new Date()) }, sec * 1000)
    })
  }

  toChecks (pipeline, deploy) {
    let startDate = new Date(pipeline.startTime)
    let endDate = new Date(pipeline.endTime)
    let duration = endDate.getSeconds() - startDate.getSeconds()
    let check = {
      name: cfg.deploy.check.name,
      owner: deploy.owner,
      repo: deploy.repo,
      head_sha: deploy.sha,
      status: util.getStatus(pipeline.status).status,
      output: this.toOutput(cfg.deploy.check.update, pipeline, deploy),
      external_id: pipeline.id
    }

    if (util.getStatus(pipeline.status).conclusion) {
      try {
        check.completed_at = endDate.toISOString()
        check.started_at = startDate.toISOString()
      } catch (e) {}
      check.conclusion = util.getStatus(pipeline.status).conclusion
      check.actions = cfg.user_actions.done
    } else {
      check.actions = cfg.user_actions.in_progress
    }
    return [check]
  }

  toOutput (template, pipeline, deploy) {

    let startDate = new Date(pipeline.startTime)
    let endDate = new Date(pipeline.endTime)
    let duration = endDate.getSeconds() - startDate.getSeconds()

    let md = templates.get(template.template)

    md = md.split('${progress}').join(util.toPrgress(pipeline.status))
    md = md.split('${namespace}').join(deploy.namespace)
    md = md.split('${branch_name}').join(deploy.branch_name)
    md = md.split('${sha}').join(deploy.sha)
    md = md.split('${duration}').join(duration + 's')
    md = md.split('${details}').join(util.toDetails(pipeline))

    return {
      title: pipeline.status,
      summary: template.summary.replace('${conclusion}', util.getStatus(pipeline.status).conclusion),
      text: md
    }
  }

  updateCheckRunStatus (context, deploy, status, output) {
    const check_run = this.githubService.checkStatus(deploy, cfg.deploy.check.name, status)
    check_run.output = output
    return this.githubService.createCheckRun(context.github, [check_run], deploy)
  }

  checkStatus (deploy, name, status) {
    const result = {
      name: name,
      owner: deploy.owner,
      repo: deploy.repo,
      head_sha: deploy.sha,
      status: status
    }

    if (status == 'completed') {
      result.conclusion = 'success'
      result.completed_at = new Date().toISOString()
    } else if (status == 'cancelled') {
      result.status = 'completed'
      result.conclusion = 'cancelled'
    } else if (status == 'in_progress') {
      result.status = 'in_progress'
      result.started_at = new Date().toISOString()
    } else if (status == 'queued') {
      result.status = 'queued'
    }
    return result
  }

  async cancel (deploy) {
    if (item.deploy) {
      await this.delay(5)
      const github = this.githubService.cache.get(deploy.owner, deploy.repo)
      const check_run = this.checkStatus(deploy, cfg.deploy.check.name, 'cancelled')
      this.githubService.createCheckRun(github, [check_run], deploy).then(res => {

      })
    }
  }
}

module.exports = Notifications
