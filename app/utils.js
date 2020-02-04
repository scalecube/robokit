const cfg = require('./config')
class Utils {
  isLabeled (labels, names) {
    let result = false
    if (labels && Array.isArray(labels)) {
      labels.forEach(label => {
        names.forEach(name => {
          if (label.name == name) {
            result = true
            return true
          }
        })
      })
    }
    return result
  }

  isPullRequest (context) {
    if (context.payload.check_suite) {
      return (context.payload.check_run.check_suite && context.payload.check_suite.pull_requests > 0)
    } else {
      return (context.payload.check_run.pull_requests && context.payload.check_run.pull_requests.length > 0)
    }
  }

  issueNumber (context) {
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
  }

  branchName (context) {
    if (context.payload.check_suite) {
      return context.payload.check_suite.head_branch
    } else if (context.payload.check_run) {
      return context.payload.check_run.check_suite.head_branch
    }
  }

  targetNamespace (ctx) {
    if (ctx.is_pull_request) {
      return ctx.owner + '-' + ctx.repo + '-' + 'pr-' + ctx.issue_number
    } else {
      return ctx.owner + '-' + ctx.repo + '-' + ctx.branch_name
    }
  }

  toPullRequestDeployContext (context) {
    const ctx = {
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      branch_name: context.payload.pull_request.head.ref,
      sha: context.payload.pull_request.head.sha,
      is_pull_request: true,
      action: context.payload.action,
      issue_number: context.payload.number
    }
    ctx.namespace = this.targetNamespace(ctx)
    ctx.pipeline_callback = (process.env.CALLBACK_URL).replace('${namespace}', ctx.namespace)
    return ctx
  }

  toCheckRunDeployContext (context) {
    const ctx = {
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      branch_name: this.branchName(context),
      sha: context.payload.check_run.head_sha,
      is_pull_request: this.isPullRequest(context),
      check_run_name: context.payload.check_run.name,

      conclusion: context.payload.check_run.conclusion,
      status: context.payload.check_run.status,
      action: context.payload.action
    }
    if (ctx.is_pull_request) { ctx.issue_number = this.issueNumber(context) }

    ctx.namespace = this.targetNamespace(ctx)
    ctx.pipeline_callback = (process.env.CALLBACK_URL).replace('${namespace}', ctx.namespace)
    return ctx
  }

  deployCheckRunName (is_pull_request) {
    if (is_pull_request) {
      return +' (pull_request)'
    } else {
      return cfg.deploy.check.name + ' (push)'
    }
  }

  mapToChecks (req) {
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

  is_check_run_in_status (deploy, propName) {
    if (deploy.is_pull_request) {
      for (let i = 0; i < cfg.deploy.on.pull_request.actions.length; i++) {
        if ((deploy.labeled) && (deploy.check_run_name == cfg.deploy.on.pull_request.actions[i].name)) {
          if (deploy.status == cfg.deploy.on.pull_request.actions[i][propName]) {
            return true
          }
        }
      }
    } else {
      for (let i = 0; i < cfg.deploy.on.push.actions.length; i++) {
        if ((deploy.check_run_name == cfg.deploy.on.push.actions[i].name) &&
          (deploy.status == cfg.deploy.on.push.actions[i][propName])) {
          for (let j = 0; j < cfg.deploy.on.push.branches.length; j++) {
            if (cfg.deploy.on.push.branches[j] == deploy.branch_name) {
              if (deploy.status == cfg.deploy.on.push.actions[j][propName]) {
                return true
              }
            }
          }
        }
      }
    }
    return false
  }

  format (field, values) {
    Object.entries(values).forEach((e) => {
      field = field.replace('${' + e[0] + '}', e[1])
    })
    return field
  }

  toDetails (context) {
    let stages = context.stages
    let details = ""
    Object.entries(stages).sort(function(stageA, stageB) {
      return  Number(stageA[1].Id) -  Number(stageB[1].Id)
    }).forEach(stage => {
      details += `${this.getMarker( stage[1].Status )} ${ stage[0]} ${ stage[1].Status } \n`
      for (let j = 0 ; j < stage[1].Tasks.length ; j++ ) {
        let startDate = new Date (stage[1].Tasks[j].startTime)
        let endDate = new Date (stage[1].Tasks[j].endTime)
        let duration  = endDate.getSeconds() - startDate.getSeconds()
        details += `${ this.getMarker( stage[1].Tasks[j].status ) } ${startDate.toISOString()} ${duration}s ${ stage[1].Tasks[j].name } : ${ stage[1].Tasks[j].status } \n`
      }
    }) 
    return details
  }

  getPrgress(status, conclusion) {
    if(conclusion=="success" ) {
      return `:heavy_check_mark: &nbsp;&nbsp;&nbsp; Deployed!  `
    }else if(conclusion== "cancelled") {
        return `:no_entry_sign: &nbsp;&nbsp;&nbsp; CANCELLED!  `
    } else if(status=="completed" && conclusion && conclusion!=null) {
      return `:x: &nbsp;&nbsp;&nbsp; FAILED!  `
    } else {
      console.log("Deploying "+ status + " " + conclusion)
      return `<img align="left" width="22" src="https://tinyurl.com/re3r65s"> Deploying...`
    }
  }

  getMarker(status){
    return (status=="SUCCEEDED") ? ">" : "<";
  }
}

module.exports = new Utils()
