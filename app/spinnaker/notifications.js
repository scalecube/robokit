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
    this.job = new CronJob('*/30 * * * * *', async () => {
      this._poll()
    }, null, true, 'America/Los_Angeles')
    spinnakerAPI.login()
    this.lastActivity = new Date()
  }

  async start () {
    this.job.start()
  }

  store (data) {
    return this.repository.insert(data).then(res => {
      this.job.start()
    })
  }
  async checkLogin() {
    let diff =(new Date().getTime() - this.lastActivity.getTime()) / 60000;
    let diffMinutes = Math.abs(Math.round(diff))
    if( diffMinutes > 30 ) {
      console.log(`Time diff from last activity : ${diffMinutes}`)
      let resp = await spinnakerAPI.login()
      this.lastActivity = new Date()
      if(resp && resp.auth){
        console.log(`Auth result: ${resp.auth}`)
      }
    }
  }

  async _poll () {
    await this.checkLogin()
    if (this.repository) {
      let count = await this.repository.count()
        this.repository.find()
          .then(async items => {
            let res = []
            items.forEach(async (item)=> {
              if(!item) return
              try{
                 res = await spinnakerAPI.applicationExecutions(item.application, item.eventId)
              } catch(err) {
                if(err.statusCode == 403) {
                  if(item.deploy) {
                    await this.delay(5)
                    const github = this.githubService.cache.get(item.deploy.owner, item.deploy.repo)
                    const check_run = this.checkStatus(item.deploy, cfg.deploy.check.name, 'cancelled')
                    this.githubService.createCheckRun(github, [check_run], item.deploy).then(res => {
                      this.repository.delete(item._id)
                    })
                  } else {
                    this.repository.delete(item._id)
                  }
                }else{
                  spinnakerAPI.login()
                }
              }
              if(res.length>0) {
                let pipeline = res[0]
                if (pipeline.trigger) {
                  let owner = pipeline.trigger.payload.owner;
                  let repo = pipeline.trigger.payload.repo;
                  if (owner && repo) {
                    const check = this.toChecks(pipeline)
                    const github = this.githubService.cache.get(owner, repo)
                    await this.delay(5)
                    this.githubService.createCheckRun(github, check).then(res => {
                      if (pipeline.status != "RUNNING" || pipeline.status == "NOT_STARTED") {
                        this.repository.delete(item._id)
                      }
                    })
                  }
                }
              }
            })
          }).catch(err => {
          console.error(err)
        })
    }
  }

  async delay(sec){
    return new Promise((resolve, reject)=>{
      sec = Math.floor(Math.random() * Math.floor(sec))
      setTimeout(() => {  resolve(new Date()) }, sec*1000);
    })
  }

  toChecks (pipeline) {
    let startDate = new Date (pipeline.startTime)
    let endDate = new Date (pipeline.endTime)
    let duration  = endDate.getSeconds() - startDate.getSeconds()
    let check = {
      owner: pipeline.trigger.payload.owner,
      repo: pipeline.trigger.payload.repo,
      head_sha: pipeline.trigger.payload.sha,
      name:cfg.deploy.check.name,
      status: util.getStatus(pipeline.status).status,
      output : this.toOutput(cfg.deploy.check.update, pipeline),
      external_id: pipeline.id
    }

    if(util.getStatus(pipeline.status).conclusion) {
      try{
        check.completed_at = endDate.toISOString()
        check.started_at = startDate.toISOString()
      } catch (e) {}
      check.conclusion = util.getStatus(pipeline.status).conclusion
      check.actions = cfg.user_actions.done
    }else{
      check.actions = cfg.user_actions.in_progress
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
}
module.exports = Notifications
