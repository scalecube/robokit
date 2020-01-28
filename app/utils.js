const cfg = require('./config');
class Utils{

    isLabeled(labels, names) {
        let result = false;
        if (labels && Array.isArray(labels)) {
            labels.forEach(label => {
                names.forEach(name => {
                    if (label.name == name) {
                        result = true;
                        return true;
                    }
                });
            });
        }
        return result;
    }

    isPullRequest(context) {
        if (context.payload.check_suite) {
            return (context.payload.check_run.check_suite && context.payload.check_suite.pull_requests > 0);
        } else {
            return (context.payload.check_run.pull_requests && context.payload.check_run.pull_requests.length > 0);
        }
    }

    issueNumber(context) {
        if (context.payload.check_run) {
            if (context.payload.check_run.check_suite) {
                if (context.payload.check_run.check_suite.pull_requests.length > 0) {
                    return context.payload.check_run.check_suite.pull_requests[0].number;
                }
            } else {
                if (context.payload.check_run.pull_requests.length > 0) {
                    return context.payload.check_run.pull_requests[0].number;
                }
            }
        }
    }

    branchName(context) {
        if (context.payload.check_suite) {
            return context.payload.check_suite.head_branch;
        } else if (context.payload.check_run) {
            return context.payload.check_run.check_suite.head_branch;
        }
    }

    toDeployContext(context) {
        let ctx = {
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            branch_name: this.branchName(context),
            sha: context.payload.check_run.head_sha,
            is_pull_request: this.isPullRequest(context),
            check_run_name: context.payload.check_run.name,

            conclusion: context.payload.check_run.conclusion,
            status: context.payload.check_run.status,
            action: context.payload.action
        };
        if (ctx.is_pull_request) { ctx.issue_number = this.issueNumber(context); }
        ctx.github_gateway_url = process.env.GITHUB_GATEWAY_URL;
        ctx.callback_url = process.env.CALLBACK_URL + ctx.owner + "/" + ctx.repo + "/" + ctx.sha;
        return ctx;
    }

    deployCheckRunName(is_pull_request) {
        if(is_pull_request){
            return cfg.deploy.check.name + " (pull_request)";
        } else {
            return cfg.deploy.check.name + " (push)";
        }
    }

    mapToChecks(req) {
        let all = [];
        for(let i=0; i<req.checks.length ; i++) {
            let check = {
                owner: req.owner,
                repo: req.repo,
                sha: req.sha,
                name: req.checks[i].name,
                status: req.checks[i].status,
                output: req.checks[i].output
            };
            if(req.checks[i].conclusion && req.checks[i].conclusion != null){
                check.conclusion = req.checks[i].conclusion;
            }
            all.push(check);
        }
        return all;
    }
}
module.exports = new Utils();