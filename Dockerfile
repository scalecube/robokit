FROM node:12.3.1

LABEL maintainer="http://scalecube.io"

ENV GITHUB_API_PORT=7777
ENV STATUS_API_PORT=7778
ENV GITHUB_TOKEN="786a26d5a9e3eefb7013a19b475b0eaa886c2d48"
ENV GITHUB_SECRET=""
ENV YOUR_SERVER_URL=https://postman-echo.com/post
ENV MONGO_DB_CONNECTION_STRING="mongodb://_:bc643b1a-b64b-44e2-be8e-410cab1b97e3@stitch.mongodb.com:27020/?authMechanism=PLAIN&authSource=%24external&ssl=true&appName=docker-wisht:mongodb-atlas:api-key"
ENV MONGO_DB_DATABASE_NAME=github-gw

WORKDIR /usr/

COPY src /usr/src/
COPY package.json /usr/

RUN npm install

EXPOSE ${GITHUB_API_PORT} ${STATUS_API_PORT}
CMD [ "npm", "start" ]

