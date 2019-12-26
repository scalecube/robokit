FROM node:12.3.1

LABEL maintainer="http://scalecube.io"

ENV GITHUB_API_PORT=7777
ENV STATUS_API_PORT=7778
ENV GITHUB_TOKEN=""
ENV GITHUB_SECRET=""
ENV YOUR_SERVER_URL=https://postman-echo.com/post
ENV MONGO_DB_CONNECTION_STRING=""
ENV MONGO_DB_DATABASE_NAME=github-gw

WORKDIR /usr/

COPY src /usr/src/
COPY package.json /usr/

RUN npm install

EXPOSE ${GITHUB_API_PORT} ${STATUS_API_PORT}
CMD [ "npm", "start" ]

#checking automation
