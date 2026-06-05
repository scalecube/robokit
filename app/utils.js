
class Utils {
  static urlConcat (array) {
    let baseUrl = new URL(array[0])
    for (let i = 1; i < array.length; i++) {
      baseUrl = new URL(array[i], baseUrl)
    }
    return baseUrl.toString()
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

  static printError (message, err) {
    console.error(message)
    console.error(err)
    const out = {
      message: err?.message,
      name: err?.name,
      code: err?.code, // ECONNREFUSED, ETIMEDOUT, etc.
      errno: err?.errno,
      syscall: err?.syscall,
      isAxiosError: !!err?.isAxiosError,
      request: {
        method: err?.config?.method,
        url: err?.config?.url || err?.config?.baseURL,
        timeout: err?.config?.timeout
      }
    }

    if (err?.response) {
      out.response = {
        status: err.response.status,
        statusText: err.response.statusText,
        headers: err.response.headers,
        data: err.response.data
      }
    } else if (err?.request) {
      out.response = null // request made, no response
    } else {
      out.response = undefined // failed before sending
    }

    console.dir(out, { depth: null, colors: true })
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

  static toDetails (logs) {
    let details = ''
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i]
      const message = JSON.stringify(log.data, null, 2)
      let status = log.status
      if (i < logs.length - 1) {
        status = 'SUCCESS'
      }
      if (message !== undefined) {
        for (const line of message.split(/\r?\n/)) {
          const str = line.replace(/(\r\n|\r|\n)/g, ' ')
          details += `${Utils.getMarker(status)} ${str} \n`
        }
      }
    }
    return details
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
