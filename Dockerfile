# Node 26.10.0 on Alpine 3.24
FROM node:26.10.0-alpine3.24

LABEL maintainer="http://scalecube.io"

# Build tools for native addons like bufferutil, utf-8-validate
RUN apk add --no-cache --virtual .build-deps \
      python3 make g++ \
 && ln -sf python3 /usr/bin/python

WORKDIR /usr/

# Install deps first for better caching
COPY package*.json /usr/
# Prefer npm ci when lockfile exists; npm is removed afterwards since it's not needed at runtime
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi \
 && apk del .build-deps \
 && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /root/.npm

# App sources
COPY src /usr/src/
COPY env /usr/.env

EXPOSE 7777
CMD ["node", "./src/server.js"]
