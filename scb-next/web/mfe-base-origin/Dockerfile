# pull official base image
FROM artifactory.global.standardchartered.com/container-store/ubi8/nodejs-14:1-43

# set working directory
WORKDIR /apps/mfe

ARG EXEC_FILE=dist

USER root
RUN chgrp -R 0 /apps/mfe && chmod -R g=u /apps/mfe

COPY ${EXEC_FILE} /apps/mfe/dist

# install app dependencies
COPY server/package.json /apps/mfe
COPY server/package-lock.json /apps/mfe
COPY .env.cloud /apps/mfe/dist/.env

RUN npm config set registry https://artifactory.global.standardchartered.com/artifactory/api/npm/npm-release && \
    npm config set always-auth false && \
    npm install -g npx && \
    npm install

# add `/apps/mfe/node_modules/.bin` to $PATH
ENV PATH /apps/mfe/node_modules/.bin:$PATH

EXPOSE 8080

USER 10001
ENTRYPOINT ["env-cmd", "-f", "/apps/mfe/dist/.env", "node", "/apps/mfe/dist/index.js"]
