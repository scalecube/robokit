## The problem

Continues delivey is important to speed up the development of your team. and its more relevant with complex microservices architecture. the more microservices are added to your echo system the more hassle is invoved for creating a standard how to continuesly deploy these services without making them slow down your ability to deliver them.


## This solution

`github-gateway` is a github application that track your git-flow development process and continuesly deploy the artifacts and triggers your continues delivery server pipelines. in such way that pull-requests, push events to develop, master branches continuesly delivered to your kubernetes evniroments.

## Setup

> `github-gateway` is a GitHub Appication built with [Probot](https://github.com/probot/probot).

```sh
# Install dependencies
npm install

# Run the bot
npm start
```
## Enviroment variables:
For reverence please see env file located at the root of this project.

## Getting started
1. `github-gateway` once github application installed on a repositoy and asking for relevant access rights to listen on activity in github and update `check_run` status events. after the CI is completed it triggers continues delivery pipeline as webhook events that essetially will deploy the repos and artifacts to an enviroment for example kubernetes namespace.

the Continues delivery trigger bellow named `robo_kit_deploy` is activated when build docker and creation of helm push is completed:

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

