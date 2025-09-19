# Node 22 LTS on Debian
FROM node:22-bullseye-slim

LABEL maintainer="http://scalecube.io"

# Tools required by node-gyp to compile native addons (bufferutil, utf-8-validate, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

# Optional: make Python path explicit for node-gyp
ENV PYTHON=/usr/bin/python3

WORKDIR /usr/
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install deps first for better caching
COPY package*.json /usr/
# Prefer npm ci when lockfile exists
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# App sources
COPY app /usr/app/
COPY index.js /usr/
COPY robokit.js /usr/
COPY env /usr/.env

ENV NODE_ENV=production
EXPOSE 7777
CMD ["npm", "run", "robokit"]