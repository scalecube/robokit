## The problem

Code quality is important. To help with code quality we have various tasks / scripts / apps and bots that we need to run to assert our quality does not drop.

Continuous integration is a great way to make sure our quality does not drop and we have confidence with our software.

GitHub have done a great job allowing us to integrate with the platform and run various checks before code gets merged. 
You can automate these checks with GitHub using status checks and GitHub actions.

## This solution


![image](https://user-images.githubusercontent.com/1706296/70527292-38a8a280-1b54-11ea-9eff-7401614c4c42.png)

`status-checks` is a gateway that accept webhooks request from github and proxy these request to your server / http endpoint you provide.
your server runs tasks and update regarding the status of these tasks.

when there was a commit on a pull request, `status-checks` will trigger api call to your server.
your server may respond with the list of tasks and checks it is planning to execute in 'pending' state.
as the tasks progress they can call back the status of the jobs currently running.




## Tools


- [@octokit/rest](https://github.com/octokit/rest.js)
- [@octokit/webhooks](https://github.com/octokit/webhooks.js)

## Getting started
1. `status-checks` expects a github token and secret so it can integrate with github api.
2. you need to configure a webhook in github to call `status-checks` when there is pull-request check.
3. on pull-request change your server will be called in a request response over http request containing the original data provided from github.
   in this stage if provided a status check message then 'status-checks' will update github pull request.
4. when the different jobs are running they should update with the progress of each task until `success` of th`failure`.

status-checks expects the following environment variables so it can perform its actions:

example .env file:

```
GITHUB_TOKEN=<YOUR GITHUB TOKEN>
GITHUB_SECRET=<YOUR GITHUB SECRET>
YOUR_SERVER_URL=<YOUR SERVER HTTP URL WHERE YOU LIKE TO GET REQUESTS>
GITHUB_API_PORT=7777 //the github webhock port
STATUS_API_PORT=7778 // the status update callback API port you replay here.

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
