### example running scalecube/github-gateway docker image.

```bash

export GITHUB_API_PORT=7777
export STATUS_API_PORT=7778

docker pull scalecube/github-gateway

docker run -i -p $GITHUB_API_PORT:$GITHUB_API_PORT -p $STATUS_API_PORT:$STATUS_API_PORT \
-e GITHUB_TOKEN=<github webhook access token> \
-e GITHUB_SECRET=<github webhook secret> \
-e YOUR_SERVER_URL=<your server http endpoint> \
-e MONGO_DB_CONNECTION_STRING=<'your mongodb instance connection string'> \
-e MONGO_DB_DATABASE_NAME=<'mongo database name'> \
-e GITHUB_API_PORT=$GITHUB_API_PORT \
-e STATUS_API_PORT=$STATUS_API_PORT \
scalecube/github-gateway

```