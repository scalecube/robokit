const REQUIRED = ['APP_ID', 'PRIVATE_KEY', 'WEBHOOK_SECRET']

function load () {
  const missing = REQUIRED.filter(k => !process.env[k])
  if (missing.length > 0) {
    console.error(`[fatal] Missing required configuration: ${missing.join(', ')}`)
    process.exit(1)
  }

  return {
    appId: process.env.APP_ID,
    privateKey: process.env.PRIVATE_KEY,
    webhookSecret: process.env.WEBHOOK_SECRET,
    webhookProxyUrl: process.env.WEBHOOK_PROXY_URL,
    webhooksPath: process.env.WEBHOOKS_PATH || '/api/github/webhooks',
    port: parseInt(process.env.PORT || '7777', 10),
    logLevel: process.env.LOG_LEVEL || 'info',
    isLocalDev: process.env.LOCAL_DEV === 'true' || process.env.LOCAL_DEV === '1',
    deploymentUrl: process.env.DEPLOYMENT_URL || '',

    knownBranches: (process.env.KNOWN_BRANCHES || 'develop,master').split(',').map(s => s.trim()),
    robokitDeploy: process.env.ROBOKIT_DEPLOY || 'robokit-deploy',
    robokitReleaseCheck: process.env.ROBOKIT_RELEASE_CHECK || 'Robokit CD (release)',
    deployCheckName: 'Robokit CD',

    cdServiceAddress: process.env.ENV_SERVICE_ADDRESS,
    cdServiceRole: process.env.ENV_SERVICE_ROLE,

    vault: {
      addr: process.env.VAULT_ADDR,
      secretsPath: process.env.VAULT_SECRETS_PATH,
      role: process.env.VAULT_ROLE,
      jwtProvider: process.env.VAULT_JWT_PROVIDER,
      jwtPath: process.env.VAULT_JWT_PATH
    },

    checkRunTemplates: {
      starting: {
        title: 'Starting',
        summary: 'Continuous Delivery pipeline is starting...',
        text: 'Waiting for Continuous Delivery pipeline acknowledgment',
        template: 'starting'
      },
      cancelled: {
        title: 'Cancelled',
        summary: 'Continuous Delivery pipeline was not found',
        text: 'The Continuous Delivery pipeline installation is not completed.',
        template: 'canceled'
      },
      update: {
        summary: 'Continuous Delivery pipeline: ${conclusion}',
        template: 'status'
      }
    },

    userActions: {
      done: [{
        label: 'Re-Deploy',
        description: 'Trigger the Deploy pipeline',
        identifier: 'deploy_now'
      }],
      inProgress: [{
        label: 'Cancel-Deploy',
        description: 'Cancel the Deploy pipeline',
        identifier: 'cancel_deploy_now'
      }]
    }
  }
}

module.exports = load()
