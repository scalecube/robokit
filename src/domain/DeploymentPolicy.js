const cfg = require('../config')

function evaluate (checkRun) {
  if (checkRun.name === cfg.deployCheckName) {
    return { deploy: false, reason: 'own-check-run' }
  }
  if (isCiTrigger(checkRun)) {
    if (!isDeployableBranch(checkRun.branch) && !checkRun.release) {
      return { deploy: false, reason: `branch-not-deployable:${checkRun.branch}` }
    }
    return { deploy: true, reason: `ci:${cfg.robokitDeploy}`, kind: 'branch' }
  }
  if (isReleaseTrigger(checkRun)) {
    return { deploy: true, reason: `release:${checkRun.tagName}`, kind: 'release' }
  }
  return { deploy: false, reason: `not-a-trigger:${checkRun.name}/${checkRun.status}` }
}

function evaluateUserAction (action) {
  if (action === 'deploy_now')        return { deploy: true, cancel: false }
  if (action === 'cancel_deploy_now') return { deploy: false, cancel: true }
  return { deploy: false, cancel: false }
}

function isCiTrigger (cr) {
  return cr.name === cfg.robokitDeploy && cr.status === 'completed' && cr.conclusion === 'success'
}

function isReleaseTrigger (cr) {
  return cr.name === cfg.robokitReleaseCheck && cr.status === 'completed' && cr.conclusion === 'success'
}

function isDeployableBranch (branch) {
  return cfg.knownBranches.includes(branch)
}

module.exports = { evaluate, evaluateUserAction }
