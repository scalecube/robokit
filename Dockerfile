FROM openjdk:8-jre@sha256:3b92ddf1617d90f81b0bfe5e41aa27b621c1cb856e67ae06605be2601404b10d

LABEL maintainer="http://scalecube.io"

WORKDIR /usr/

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -qq --no-install-recommends \
  nodejs \
  yarn \
  && rm -rf /var/lib/apt/lists/*

COPY app /usr/app/
COPY package.json /usr/
COPY index.js /usr/
COPY env /usr/.env

RUN npm install
RUN wget -O ./scalecube-vaultenv.jar https://oss.sonatype.org/service/local/repositories/releases/content/io/scalecube/scalecube-vaultenv/0.1.0/scalecube-vaultenv-0.1.0-shaded.jar
EXPOSE 7777
CMD ["java","-jar", "./scalecube-vaultenv.jar", "npm start"]
