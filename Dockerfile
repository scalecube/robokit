FROM timbru31/java-node:11-jre

LABEL maintainer="http://scalecube.io"

WORKDIR /usr/

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

COPY app /usr/app/
COPY package.json /usr/
COPY index.js /usr/
COPY robokit.js /usr/
COPY robokit-launcher.js /usr/
COPY env /usr/.env

RUN npm install
RUN wget -O ./scalecube-vaultenv.jar https://oss.sonatype.org/service/local/repositories/releases/content/io/scalecube/scalecube-vaultenv/0.1.1/scalecube-vaultenv-0.1.1-shaded.jar
EXPOSE 7777
CMD ["java","-jar", "./scalecube-vaultenv.jar", "npm run-script robokit-start", "--input"]
