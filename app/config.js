module.exports = {

  deploy: {
    check: {
      name: 'Robo-Kit Deploy',
      queued: {
        title: 'Starting Continues-Delivery.',
        summary: 'Deploy pipeline initializing<br>' +
          'sha: `${sha}`<br>' +
          'branch: `${branch_name}`',
        text: 'About to trigger a deployment pipeline'
      },
      trigger_pipeline: {
        title: 'Triggered Pipeline ',
        summary: 'Triggered a Continues-Delivery pipeline<br>' +
          'sha: `${sha}`<br>' +
          'branch: `${branch_name}`',
        text: 'Waiting for Continues Delivery pipeline acknowledgment'
      },
      cd_pipeline_started: {
        title: 'Pipeline is Running',
        summary: 'Continues-Delivery pipeline is running<br>' +
          'sha: `${sha}`<br>' +
          'branch: `${branch_name}`',
        text: 'Waiting for Continues Delivery pipeline status updates'
      },
      cd_pipeline_not_found: {
        title: 'Pipeline execution is Canceled',
        summary: 'Continues-Delivery pipeline was not found<br>' +
          'sha: `${sha}`<br>' +
          'branch: `${branch_name}`',
        text: 'This repository is not supported by Robo-kit or the installation was not completed please contact us for support.'
      },
      cd_pipeline_status_update:{
        title: 'Pipeline execution is ${status}',
        summary: 'Continues-Delivery pipeline result is ${conclusion}<br>' +
          'sha: `${sha}`<br>' +
          'branch: `${branch_name}`',
        text: 'Namespace: `${namespace}`'
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
          name: 'robo_kit_deploy', create_on: 'queued', trigger_on: 'completed'
        }]
      },
      pull_request: {
        labeled: ['DEPLOY'],
        actions: [{
          name: 'Travis CI - Pull Request', create_on: 'in_progress', trigger_on: 'completed'
        }, {
          name: 'robo_kit_deploy', create_on: 'queued', trigger_on: 'queued'
        }]
      }
    }
  },
  labels: [{
    name: 'DEPLOY'
  }]
}
