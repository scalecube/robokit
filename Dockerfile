# Node 25.6.1 on Alpine 3.23
FROM node:25.6.1-alpine3.23

LABEL maintainer="http://scalecube.io"

# Build tools for native addons like bufferutil, utf-8-validate
RUN apk add --no-cache --virtual .build-deps \
      python3 make g++ \
 && ln -sf python3 /usr/bin/python

WORKDIR /usr/

# Install deps first for better caching
COPY package*.json /usr/
# Prefer npm ci when lockfile exists
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi \
 && apk del .build-deps

# App sources
COPY app /usr/app/
COPY index.js /usr/
COPY robokit.js /usr/
COPY env /usr/.env

EXPOSE 7777
CMD ["npm", "run-script", "robokit"]
