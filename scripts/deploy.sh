#!/usr/bin/env bash
docker login docker.pkg.github.com --username $GITHUB_USERNAME --password $GITHUB_TOKEN
docker build .
IMAGE_ID=$(docker images --format="{{.ID}} {{.Repository}}" | grep "<none>" | awk '{print $1;}')
IMAGE_NAME=github-gateway
docker tag $IMAGE_ID docker.pkg.github.com/$TRAVIS_REPO_SLUG/$IMAGE_NAME:latest
docker images
docker push docker.pkg.github.com/$TRAVIS_REPO_SLUG/$IMAGE_NAME:latest