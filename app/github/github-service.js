const WebhooksRouter = require('./webhooks-router')
const util = require('../utils')

class GithubService {
  constructor (app, cache) {
    this.router = new WebhooksRouter()
    this.app = app
    this.cache = cache
  }

  async createCheckRun (github, checks, context) {
    const all = []
    checks.forEach(async check => {
      check.output = this.formatOutput(check.output, context)
      const p = github.checks.create(check)
      console.log('>>>> UPDATE STATUS  >>>> ' + JSON.stringify(check))
      all.push(p)
    })

    return await Promise.all(all)
  }

  formatOutput (output, context) {
    if (output && context) {
      output.title = util.format(output.title, context)
      output.summary = util.format(output.summary, context)
      output.text = util.format(output.text, context)
    }
    return output
  }

  updateComment (context, msg) {
    return this.commentAction(msg, context.issues.updateComment)
  }

  createComment (context, msg) {
    return this.commentAction(msg, context.issues.createComment)
  }

  labels (owner, repo, issue_number) {
    return new Promise((resolve, reject) => {
      const ctx = this.cache.get(owner, repo)
      if (ctx) {
        ctx.request(`GET /repos/${owner}/${repo}/issues/${issue_number}/labels`)
          .then(res => {
            resolve(res.data)
          }).catch((err) => {
            reject(err)
          })
      }
    })
  }

  //  POST /repos/:owner/:repo/labels
  //  Example:
  // {
  //   "name": "bug",
  //   "description": "Something isn't working",
  //   "color": "f29513"
  // }
  createLabel (owner, repo, label) {
    const github = this.cache.get(owner, repo)
    return github.request(`POST /repos/${owner}/${repo}/labels`, label)
  }

  content (owner, repo, path, base64) {
    return new Promise((resolve, reject) => {
      const ctx = this.cache.get(owner, repo)
      if (ctx) {
        ctx.request('GET /repos/' + owner + '/' + repo + '/contents/' + path)
          .then(res => {
            if (!base64) { resolve(Buffer.from(res.data.content, 'base64').toString('ascii')) } else {
              resolve(res.data.content)
            }
          }).catch((err) => {
            reject(err)
          })
      }
    })
  }

  commentAction (msg, action) {
    return new Promise((resolve, reject) => {
      if (msg.template) { // create comment from a template managed by this github app.
        if (!msg.template.owner || !msg.template.repo) {
          msg.template.owner = msg.owner
          msg.template.repo = msg.repo
        }
        this.content(msg.template.owner, msg.template.repo, msg.template.path).then(r => {
          msg.body = r
          msg.body = this._formatComment(msg)
          resolve(action(msg))
        }).catch((err) => {
          console.error(err)
          reject(err)
        })
      } else if (msg.url) { // create comment from external source
        httpClient.get(msg.template_url).then(r => {
          msg.body = r
          msg.body = this._formatComment(msg)
          resolve(action(msg))
        })
      } else { // create comment from simple text 'body'
        msg.body = this._formatComment(msg)
        resolve(action(msg))
      }
    })
  }

  saveWebhook (msg) {
    return this.router.saveWebhook(msg)
  }

  findWebhook (msg) {
    return this.router.findWebhooks(msg)
  }

  route (owner, repo, context) {
    return this.router.route(owner, repo, context, (resp) => {
      if ((resp) && resp instanceof String) {
        console.log('<<< ###  router response: \n' + resp)
      } else if (resp !== undefined) {
        console.log('<<< ###  router response: \n' + JSON.stringify(resp))
      } else {
        console.log('<<< ###  router response: \n' + resp)
      }
    }, (err) => {
      console.error(err)
    })
  }
}

module.exports = GithubService
