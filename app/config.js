module.exports = {
  ROBOKIT_DEPLOY: 'robokit-deploy',
  ROBOKIT_RELEASE_CHECK: 'Robokit CD (release)',
  deploy: {
    check: {
      name: 'Robokit CD',
      starting: {
        title: 'Starting',
        summary: 'Continues-Delivery pipeline is starting...',
        text: 'Waiting for Continues Delivery pipeline acknowledgment',
        template: 'starting'
      },
      canceled: {
        title: 'Canceled',
        summary: 'Continues-Delivery pipeline was not found',
        text: 'The Continues Delivery pipelines installation is not completed.',
        template: 'canceled'
      },
      update: {
        title: '${status}',
        summary: 'Continues-Delivery pipeline: ${conclusion}',
        text: 'Namespace: `${namespace}`',
        template: 'status'
      }
    }
  },
  user_actions: {
    done: [{
      label: 'Re-Deploy',
      description: 'Trigger the Deploy pipeline',
      identifier: 'deploy_now'
    }],
    in_progress: [{
      label: 'Cancel-Deploy',
      description: 'Cancel the Deploy pipeline',
      identifier: 'cancel_deploy_now'
    }]
  }
}
