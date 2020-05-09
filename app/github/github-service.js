const util = require('../utils')
const templates = require('../statuses/templates')
const yaml = require('js-yaml')

class GithubService {
  constructor (app, cache) {
    this.app = app
    this.cache = cache
  }

  async createCheckRun (github, checks) {
    const all = []
    checks.forEach(async check => {
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
      context.progress = Utils.getPrgress(context.status, context.conclusion)
      if (output.template){
        if (context.stages) {
          context.details = util.toDetails(context)
        }
        output.text = util.format(templates.get(output.template), context)
      } else {
        output.text = util.format(output.text, context)
      }
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

  async runChecks (owner, repo, branch) {
    const github = this.cache.get(owner, repo)
    // https://api.github.com/repos/scalecube/robokit/commits/develop/check-runs
    const runs = await  github.request(`GET /repos/${owner}/${repo}/commits/${branch}/check-runs`)

    // POST /repos/:owner/:repo/actions/runs/:run_id/rerun
    // https://api.github.com/repos/scalecube/robokit/commits/develop/check-runs
    // Accept: application/vnd.github.antiope-preview+json

    return github.request(`POST /repos/${owner}/${repo}/labels`, label)
  }

  async deployYaml (owner, repo, branch) {
    const yml = await this.content(owner, repo, branch, '.github/robokit.yml', false)
    if (yml) {
      return yaml.safeLoad(yml)
    } else {
      return {}
    }
  }

  async configYaml (owner, repo, branch, path) {
    const yml = await this.content(owner, repo, branch, path, false)
    if (yml) {
      return yaml.safeLoad(yml)
    } else {
      return {}
    }
  }

  content (owner, repo, branch, path, base64) {
    return new Promise((resolve, reject) => {
      const ctx = this.cache.get(owner, repo)
      if (ctx) {
        ctx.repos.getContents({ owner: owner, repo: repo, ref: branch, path: path })
          .then(res => {
            if (!base64) {
              resolve(Buffer.from(res.data.content, 'base64').toString('ascii'))
            } else {
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
        this.content(msg.template.owner, msg.template.repo, 'develop', msg.template.path).then(r => {
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
}

module.exports = GithubService
