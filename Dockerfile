FROM node:12.3.1

LABEL maintainer="http://scalecube.io"

ENV MONGO_DB_CONNECTION_STRING=${MONGO_DB_CONNECTION_STRING}
ENV APP_ID=${APP_ID}
ENV PRIVATE_KEY=${PRIVATE_KEY}
ENV WEBHOOK_SECRET=${WEBHOOK_SECRET}

WORKDIR /usr/

COPY app /usr/app/
COPY package.json /usr/
COPY index.js /usr/
COPY env /usr/.env

RUN export PRIVATE_KEY=${PRIVATE_KEY} | base64 -d
RUN npm install

EXPOSE 7777
CMD [ "npm", "start" ]
