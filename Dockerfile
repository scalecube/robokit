FROM node:12.3.1

LABEL maintainer="http://scalecube.io"

WORKDIR /usr/

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

COPY app /usr/app/
COPY package.json /usr/
COPY index.js /usr/
COPY robokit.js /usr/
COPY robokit-k8s.js /usr/
COPY env /usr/.env

RUN npm install
EXPOSE 7777
CMD ["npm", "run-script", "robokit"]
