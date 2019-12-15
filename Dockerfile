FROM node:12.3.1

LABEL maintainer="http://scalecube.io"

ENV GITHUB_API_PORT=7777
ENV STATUS_API_PORT=7778

WORKDIR /usr/src/

COPY src /usr/src/
COPY package.json /usr/src/
COPY .env /usr/src/

RUN npm install

EXPOSE ${GITHUB_API_PORT} ${STATUS_API_PORT}

CMD [ "npm", "start" ]

