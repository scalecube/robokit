# Node 22 LTS on Debian
FROM node:22-bullseye-slim

LABEL maintainer="http://scalecube.io"

# Tools required by node-gyp to compile bufferutil, utf-8-validate, etc.
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ \
 && npm config set python /usr/bin/python3 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install deps first for better caching
COPY package*.json /usr/
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# App sources
COPY app /usr/app/
COPY index.js /usr/
COPY robokit.js /usr/
COPY env /usr/.env

ENV NODE_ENV=production
EXPOSE 7777
CMD ["npm", "run", "robokit"]