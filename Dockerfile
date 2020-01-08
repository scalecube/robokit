FROM node:12.3.1

LABEL maintainer="http://scalecube.io"

ENV MONGO_DB_CONNECTION_STRING=""

WORKDIR /usr/

COPY app /usr/app/
COPY package.json /usr/
COPY index.js /usr/

RUN npm install

EXPOSE ${GITHUB_API_PORT} ${STATUS_API_PORT}
CMD [ "npm", "start" ]
