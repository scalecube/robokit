FROM node:12.3.1

LABEL maintainer="http://scalecube.io"

ENV MONGO_DB_CONNECTION_STRING=""

WORKDIR /usr/

COPY app /usr/app/
COPY package.json /usr/
COPY index.js /usr/
COPY env /usr/.env

RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]
