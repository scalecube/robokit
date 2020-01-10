FROM node:12.3.1

LABEL maintainer="http://scalecube.io"

ENV MONGO_DB_CONNECTION_STRING=""
ENV APP_ID=""
ENV PRIVATE_KEY=""
ENV WEBHOOK_SECRET=""

WORKDIR /usr/

COPY app /usr/app/
COPY package.json /usr/
COPY index.js /usr/
COPY env /usr/.env

RUN npm install

EXPOSE 7777
CMD [ "npm", "start" ]
