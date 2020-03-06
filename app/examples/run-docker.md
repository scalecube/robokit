### example running scalecube/robokit docker image.

```bash

docker pull scalecube/robokit

docker run -i -p \
-e MONGO_DB_CONNECTION_STRING=<'your mongodb instance connection string'> \
scalecube/robokit/robokit

```