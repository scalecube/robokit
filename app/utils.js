const url = require('url')

class Utils {
  static urlConcat (array) {
    let uri = array[0]
    for (let i = 0; i < array.length - 1; i++) {
      uri = url.resolve(uri, array[i + 1])
    }
    return uri
  }

  static isLabeled (labels, names) {

    let result = false
    if (labels && Array.isArray(labels)) {
      labels.forEach(label => {
        names.forEach(name => {
          if (label === name) {
            result = true
            return true
          }
        })
      })
    }
    return result
  }

  static isPullRequest (context) {
    if (context.payload.check_run) {
      return (context.payload.check_run.pull_requests && context.payload.check_run.pull_requests.length > 0)
    } else {
      return (context.payload.check_run.pull_requests && context.payload.check_run.pull_requests.length > 0)
    }
  }

  static issueNumber (context) {
    if (context.payload.check_run) {
      if (context.payload.check_run.check_suite) {
        if (context.payload.check_run.check_suite.pull_requests.length > 0) {
          return context.payload.check_run.check_suite.pull_requests[0].number
        }
      } else {
        if (context.payload.check_run.pull_requests.length > 0) {
          return context.payload.check_run.pull_requests[0].number
        }
      }
    }
    if (context.payload.pull_request) {
      return context.payload.pull_request.number
    }
  }

  static baseBranchName (context) {
    if (context.payload.check_run) {
      if (context.payload.check_run.check_suite.pull_requests.length > 0) {
        return context.payload.check_run.check_suite.pull_requests[0].base.ref
      }
    }

    if (context.payload.pull_request) {
      return context.payload.pull_request.base.ref
    }
  }

  static branchName (context) {
    if (context.payload.check_suite) {
      return context.payload.check_suite.head_branch
    } else if (context.payload.check_run) {
      return context.payload.check_run.check_suite.head_branch
    }

    if (context.payload.pull_request) {
      return context.payload.pull_request.head.ref
    }
  }

  static targetNamespace (deploy) {
    if (deploy.prerelease) {
      return ''
    } else if (deploy.release) {
      return ''
    } else if (deploy.base_branch_name) {
      return `${deploy.repo}-${deploy.issue_number}`
    } else if (deploy.branch_name === 'master' || deploy.branch_name === 'develop') {
      return deploy.branch_name
    }
  }

  static toReleaseDeployContext (context) {
    let ctx = {
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name
    }
    ctx = Object.assign(ctx, context.payload.release)
    return ctx
  }

  static toPullRequestDeployContext (context) {
    const ctx = {
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      branch_name: Utils.branchName(context),
      base_branch_name: Utils.baseBranchName(context),
      sha: context.payload.pull_request.head.sha,
      is_pull_request: true,
      check_run_name: 'pull_request',
      conclusion: null,
      status: context.payload.action,
      action: context.payload.action
    }
    if (ctx.is_pull_request) { ctx.issue_number = Utils.issueNumber(context) }
    ctx.labels = context.payload.pull_request.labels.map(e => e.name)
    ctx.labled = ctx.labels.length > 0
    return ctx
  }

  static toCheckRunDeployContext (context) {
    const ctx = {
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      branch_name: Utils.branchName(context),
      base_branch_name: Utils.baseBranchName(context),
      sha: context.payload.check_run.head_sha,
      check_run_name: context.payload.check_run.name,

      conclusion: context.payload.check_run.conclusion,
      status: context.payload.check_run.status,
      action: context.payload.action
    }
    if (ctx.is_pull_request) { ctx.issue_number = Utils.issueNumber(context) }
    return ctx
  }

  static mapToChecks (req) {
    const all = []
    for (let i = 0; i < req.checks.length; i++) {
      const check = {
        owner: req.owner,
        repo: req.repo,
        head_sha: req.sha,
        name: req.checks[i].name,
        status: req.checks[i].status,
        output: req.checks[i].output
      }
      if (req.checks[i].conclusion && req.checks[i].conclusion != null) {
        check.conclusion = req.checks[i].conclusion
      }
      all.push(check)
    }
    return all
  }

  static format (field, values) {
    Object.entries(values).forEach((e) => {
      field = field.replace('${' + e[0] + '}', e[1])
    })
    return field
  }

  static toDetails (logs) {
    let details = ''
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i]
      const message = log.message
      let status = log.status
      if (i < logs.length - 1) {
        status = 'SUCCESS'
      }
      for (const line of message.split(/\r?\n/)) {
        line.replaceAll("\r", "")
        line.replaceAll("\n", "")
        details += `${Utils.getMarker(status)} ${line} \n`
      }
    }
    return details
  }

  static time (t) {
    if (t) {
      return new Date(t).toISOString()
    } else return '....-..-..T..:..:.....z'
  }

  static getPrgress (status, conclusion) {
    if (conclusion === 'success') {
      return ':heavy_check_mark: &nbsp;&nbsp;&nbsp; Deployed!  '
    } else if (conclusion === 'cancelled') {
      return ':no_entry_sign: &nbsp;&nbsp;&nbsp; CANCELLED!  '
    } else if (status === 'completed' && conclusion) {
      return ':x: &nbsp;&nbsp;&nbsp; FAILED!  '
    } else {
      console.log('Deploying ' + status + ' ' + conclusion)
      return '<img align="left" width="22" src="https://tinyurl.com/re3r65s"> Deploying...'
    }
  }

  static toPrgress (status) {
    if (status === 'SUCCEEDED') {
      return ':heavy_check_mark: &nbsp;&nbsp;&nbsp; Deployed!  '
    } else if (status === 'TERMINAL' || status === 'FAILED_CONTINUE') {
      return ':x: &nbsp;&nbsp;&nbsp; FAILED!  '
    } else if (status === 'NOT_STARTED' || status === 'RUNNING') {
      console.log('Deploying ' + status)
      return '<img align="left" width="22" src="https://tinyurl.com/re3r65s"> Deploying...'
    } else if (status === 'CANCELED' || status === 'PAUSED' || status === 'SUSPENDED') {
      return `:no_entry_sign: &nbsp;&nbsp;&nbsp; ${status}!`
    }
  }

  static getMarker (status) {
    if (status === 'SUCCEEDED' || status === 'SUCCESS') {
      return '>'
    } else if (status === 'TERMINAL' || status === 'FAILED_CONTINUE' || status === 'ERROR') {
      return '<'
    } else if (status === 'CANCELED' || status === 'PAUSED' || status === 'SUSPENDED') {
      return '#'
    } else if (status === 'RUNNING') {
      return '*'
    } else return ' '
  }

  /*
   Required if you provide completed_at or a status of completed. The final conclusion of the check.
   Can be one of success, failure, neutral, cancelled, timed_out, or action_required.
   When the conclusion is action_required, additional details should be provided on the site specified by details_url.
   Note: Providing conclusion will automatically set the status parameter to completed. Only GitHub can change a check run conclusion to stale.
   */
  static getStatus (status) {
    if (status === 'SUCCEEDED' || status === 'SUCCESS') {
      return {
        status: 'completed',
        conclusion: 'success'
      }
    } else if (status === 'TERMINAL' || status === 'FAILED_CONTINUE' || status === 'ERROR') {
      return {
        status: 'completed',
        conclusion: 'failure'
      }
    } else if (status === 'NOT_STARTED' || status === 'RUNNING') {
      return {
        status: 'in_progress'
      }
    } else if (status === 'CANCELLED' || status === 'PAUSED' || status === 'SUSPENDED') {
      return {
        status: 'completed',
        conclusion: 'cancelled'
      }
    } else {
      return {
        status: 'in_progress'
      }
    }
  }

  static tail (log) {
    return log[log.length - 1]
  }

  static head (log) {
    return log[0]
  }
}
module.exports = Utils
