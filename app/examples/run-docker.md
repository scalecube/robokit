### example running scalecube/github-gateway docker image.

```bash

docker pull scalecube/github-gateway

docker run -i -p \
-e MONGO_DB_CONNECTION_STRING=<'your mongodb instance connection string'> \
scalecube/github-gateway/github-gateway

```