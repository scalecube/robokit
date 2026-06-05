const orchestrator = require('./application/DeploymentOrchestrator')
const registry = require('./adapters/github/OctokitRegistry')
const cfg = require('./config')
const logger = require('./logger')

const robokit = app => {
  app.on('installation', context => {
    orchestrator.onInstall(context)
  })

  app.on('check_run', context => {
    const { check_run: cr, repository: repo, sender, requested_action } = context.payload
    const userAction = requested_action?.identifier ?? null
    logger.info({
      action: context.payload.action,
      name: cr.name,
      status: cr.status,
      conclusion: cr.conclusion,
      branch: cr.check_suite?.head_branch ?? null,
      repo: `${repo.owner.login}/${repo.name}`,
      sender: sender.login,
      userAction
    }, 'github.check_run')
    registry.register(repo.owner.login, repo.name, context.octokit)
    orchestrator.handle(context, userAction).catch(err =>
      logger.error({ err }, 'orchestrator.unhandled-error')
    )
  })

  if (cfg.logLevel === 'debug') {
    app.onAny(context => {
      logger.debug({ event: context.name, action: context.payload.action ?? '?' }, 'github.event')
    })
  }

  logger.info('Server started.')
}

module.exports = robokit
