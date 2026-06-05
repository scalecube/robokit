require('dotenv').config()

const { Server, Probot } = require('probot')
const cfg = require('./config')
const logger = require('./logger')
const orchestrator = require('./application/DeploymentOrchestrator')
const VaultAdapter = require('./adapters/vault/VaultAdapter')

const cdServiceReal = require('./adapters/cd-service/CdServiceClient')
const cdServiceMock = require('./adapters/cd-service/CdServiceMock')

async function startServer () {
  const serverOptions = {
    port: cfg.port,
    webhooks: {
      path: cfg.webhooksPath,
      secret: cfg.webhookSecret
    },
    Probot: Probot.defaults({
      appId: cfg.appId,
      privateKey: cfg.privateKey,
      secret: cfg.webhookSecret
    })
  }

  if (cfg.webhookProxyUrl) {
    serverOptions.webhookProxy = cfg.webhookProxyUrl
    logger.info({ url: cfg.webhookProxyUrl }, 'webhook-proxy.enabled')
  }

  const cdService = cfg.isLocalDev ? cdServiceMock : cdServiceReal
  orchestrator.setCdService(cdService)

  if (!cfg.isLocalDev) {
    await cdServiceReal.connect()
  }

  const server = new Server(serverOptions)
  await server.load(require('./webhook'))

  server.expressApp.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      uptime: Math.round(process.uptime()),
      cdService: cdService.isConnected() ? 'connected' : 'disconnected'
    })
  })

  await server.start()
  logger.info({ port: cfg.port }, 'robokit.started')
}

async function start () {
  if (cfg.isLocalDev) {
    logger.info('LOCAL_DEV mode — skipping Vault auth')
    await startServer()
    return
  }

  try {
    const vault = new VaultAdapter()
    const token = await vault.k8sLogin(cfg.vault.role, cfg.vault.jwtPath)
    const secrets = await vault.read(token.client_token, cfg.vault.secretsPath)
    Object.assign(process.env, secrets)
    logger.info('Vault secrets loaded')
    await startServer()
  } catch (err) {
    logger.fatal({ err }, 'startup.failed')
    process.exit(1)
  }
}

start()
