### example running scalecube/github-gateway docker image.

```bash

export PUBLIC_API_PORT=7777
export INTERNAL_API_PORT=7778

docker pull scalecube/github-gateway

docker run -i -p $PUBLIC_API_PORT:$PUBLIC_API_PORT -p $INTERNAL_API_PORT:$INTERNAL_API_PORT \
-e GITHUB_TOKEN=<github webhook access token> \
-e GITHUB_SECRET=<github webhook secret> \
-e YOUR_SERVER_URL=<your server http endpoint> \
-e MONGO_DB_CONNECTION_STRING=<'your mongodb instance connection string'> \
-e MONGO_DB_DATABASE_NAME=<'mongo database name'> \
-e PUBLIC_API_PORT=$PUBLIC_API_PORT \
-e INTERNAL_API_PORT=$INTERNAL_API_PORT \
scalecube/github-gateway

```