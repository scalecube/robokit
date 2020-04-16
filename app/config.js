const deploy_label = ':rocket: DEPLOY (robo-kit)'

module.exports = {
  ROBOKIT_DEPLOY: 'robokit-deploy',
  ROBOKIT_LABEL: deploy_label,
  queued: 'queued',
  deploy: {
    check: {
      name: 'Robokit CD',
      queued: {
        title: 'Waiting',
        summary: 'Continues-Delivery pipeline is pending...',
        text: 'About to trigger a deployment pipeline',
        template: 'waiting'
      },
      starting: {
        title: 'Starting',
        summary: 'Continues-Delivery pipeline is starting...',
        text: 'Waiting for Continues Delivery pipeline acknowledgment',
        template: 'starting'
      },
      running: {
        title: 'Running',
        summary: 'Continues-Delivery pipeline is running',
        text: 'Waiting for Continues Delivery pipeline status updates',
        template: 'running'
      },
      canceled: {
        title: 'Canceled',
        summary: 'Continues-Delivery pipeline was not found',
        text: 'This repository is not supported by Robokit or the installation was not completed please contact us for support.',
        template: 'canceled'
      },
      update: {
        title: '${status}',
        summary: 'Continues-Delivery pipeline: ${conclusion}',
        text: 'Namespace: `${namespace}`',
        template: 'status'
      }
    },
    on: {
      push: {
        branches: [
          'master',
          'develop'
        ],
        actions: [{
          name: 'Travis CI - Branch', create_on: 'in_progress', trigger_on: 'completed'
        }, {
          name: 'robokit-deploy', create_on: 'queued', trigger_on: 'completed'
        }]
      },
      pull_request: {
        labeled: [deploy_label],
        actions: [{
          name: 'Travis CI - Pull Request', create_on: 'in_progress', trigger_on: 'completed'
        }, {
          name: 'robokit-deploy', create_on: 'queued', trigger_on: 'queued'
        }]
      }
    }
  },
  label: deploy_label,
  labels: [{
    name: deploy_label,
    description: 'if Labeled Triggers deployment on next commit, Unlabeled/Merge will trigger environment destruction.',
    color: '73ed58'
  }],
  user_actions: {
    done: [{
      label: "Re-Deploy",
      description: "Trigger the Deploy pipeline",
      identifier: "deploy_now"
    }],
    in_progress: [{
      label: "Cancel-Deploy",
      description: "Cancel the Deploy pipeline",
      identifier: "cancel_deploy_now"
    }]
  }
}
