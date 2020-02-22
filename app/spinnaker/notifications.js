const Repository = require('./repository')
const CronJob = require('cron').CronJob
const cfg = require('../config')
const spinnakerAPI = require('./spinnaker-client')
const templates = require('../statuses/templates')
const util = require('../utils')

class Notifications {
  constructor (githubService) {
    this.githubService = githubService
    this.repository = new Repository('github-gateway')
    this.repository.connect('executions')
    this.job = new CronJob('*/25 * * * * *', async () => {
      this._poll()
    }, null, true, 'America/Los_Angeles')
    spinnakerAPI.login()

    this.loginjob = new CronJob('10 * * * * *', async () => {
      spinnakerAPI.login()
    }, null, true, 'America/Los_Angeles')
    this.loginjob.start()
  }

  start () {
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
      if (count !== 0) {
        this.repository.findOldest()
          .then(async item => {

            let res = await spinnakerAPI.applicationExecutions(item.application, item.eventId)
            if(res.length>0) {
              let pipeline = res[0]
              if(pipeline.status != "RUNNING" || pipeline.status=="NOT_STARTED") {
                this.repository.delete(item._id)
              }
              let owner =  pipeline.trigger.payload.owner;
              let repo = pipeline.trigger.payload.repo;
              if(owner && repo){
                const check = this.toChecks(pipeline)
                const github = this.githubService.cache.get(owner, repo)
                this.githubService.createCheckRun(github, check )
              }
            }
          }).catch(err => {
            console.error(err)
          })

        count = await this.repository.count()
      } else {
        this.job.stop()
      }
    }
  }

  toChecks (pipeline) {
    let startDate = new Date (pipeline.startTime)
    let endDate = new Date (pipeline.endTime)
    let duration  = endDate.getSeconds() - startDate.getSeconds()
    let check = {
      owner: pipeline.trigger.payload.owner,
      repo: pipeline.trigger.payload.repo,
      head_sha: pipeline.trigger.payload.sha,
      name: pipeline.trigger.payload.check_run_name,
      status: util.getStatus(pipeline.status).status,
      output : this.toOutput(cfg.deploy.check.update, pipeline)
    }
    if(util.getStatus(pipeline.status).conclusion) {
      check.completed_at = endDate.toISOString()
      check.started_at = startDate.toISOString()
      check.conclusion = util.getStatus(pipeline.status).conclusion
    }
    return [check]
  }

  toOutput(template, pipeline) {

    let startDate = new Date (pipeline.startTime)
    let endDate = new Date (pipeline.endTime)
    let duration  = endDate.getSeconds() - startDate.getSeconds()

    let md = templates.get(template.template)
    md = md.replace("${progress}",util.toPrgress(pipeline.status))
    md = md.replace("${namespace}", pipeline.trigger.payload.namespace)
    md = md.replace("${branch_name}", pipeline.trigger.payload.branch_name)
    md = md.replace("${sha}", pipeline.trigger.payload.sha)
    md = md.replace("${duration}", duration + "s")
    md = md.replace("${details}", util.toDetails(pipeline))
    return {
      title: pipeline.status,
      summary: template.summary.replace("${conclusion}",util.getStatus(pipeline.status).conclusion),
      text: md
    }
  }

}
module.exports = Notifications
