FROM node:alpine3.20

LABEL maintainer="http://scalecube.io"

WORKDIR /usr/

#SHELL ["/bin/sh", "-o", "pipefail", "-c"]

COPY app /usr/app/
COPY package.json /usr/
COPY index.js /usr/
COPY robokit.js /usr/
COPY robokit-k8s.js /usr/
COPY env /usr/.env

RUN apk add --no-cache \
    bash \
    python3 \
    make \
    g++ \
    && npm install -g npm@latest \
    && npm install

EXPOSE 7777
CMD ["npm", "run-script", "robokit"]
