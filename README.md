## The problem

Code quality is important. To help with code quality we have various tasks / scripts / apps and bots that we need to run to assert our quality does not drop.

Continuous integration is a great way to make sure our quality does not drop and we have confidence with our software.

GitHub have done a great job allowing us to integrate with the platform and run various checks before code gets merged. 
You can automate these checks with GitHub using status checks and GitHub actions.


## This solution

![image](https://user-images.githubusercontent.com/1706296/70527292-38a8a280-1b54-11ea-9eff-7401614c4c42.png)

`github-gateway` is a track your git-flow development process and continuesly deploy the artifacts and triggers your continues delivery server pipelines. in such way that pull-requests, push events to develop, master branches continuesly delivered to your kubernetes evniroments.

## Setup

> A GitHub App built with [Probot](https://github.com/probot/probot) 

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Getting started
1. `github-gateway` expects a github token and secret so it can integrate with github api.
2. you need to configure a webhook in github to call `status-checks` when there is pull-request check.
3. on pull-request change your server will be called in a request response over http request containing the original data provided from github.
   in this stage if provided a status check message then 'status-checks' will update github pull request.
4. when the different jobs are running they should update with the progress of each task until `success` of th`failure`.

status-checks expects the following environment variables so it can perform its actions:

example .env file:

```
robo_kit_deploy:

    needs:
      - build_push_docker
      - create_helm

    runs-on: ubuntu-latest

    steps:
      - name: Robo-Kit Deploy
        run: |
          echo 'Run Robo-Kit Deploy'
```

```javascript
example = {
  pull_request_url : "https://api.github.com/repos/<ownder>/<repo>.github.io/pulls/<PR NUM>",
  sha :"262e1e9097f5ce412d5751b0dd37b434ebab17",
  statuses: [{    // the list of statuses to be updated 1 to N.
    name : "integration-testing",
    status: "pending", // pending, error, failure, success.
    message  : "initializing integration-testing",
    target_url : "http://scalecube.io"
  },{
    name : "performance-testing",
    status: "pending",
    message  : "initializing performance-testing",
    target_url : "http://scalecube.io"
  }]
}

```


![image](https://user-images.githubusercontent.com/1706296/70513398-32a5c800-1b3a-11ea-9813-9c7f876117a0.png)
