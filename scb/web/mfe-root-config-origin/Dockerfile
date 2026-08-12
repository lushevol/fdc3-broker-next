FROM artifactory.global.standardchartered.com/nginx:1.20.1-alpine

WORKDIR /apps/ratanrt

ARG BACKEND_ENV

#RUN addgroup -S ratanrt && adduser -h /apps/ratanrt -S ratanrt -G ratanrt
USER root
RUN chgrp -R 0 /apps/ratanrt && chmod -R g=u /apps/ratanrt
RUN chgrp -R 0 /etc/nginx && chmod -R g=u /etc/nginx
RUN mkdir -p /apps/ratanrt/mfe && \
    mkdir -p /apps/ratanrt/mfe/logs && \
    mkdir -p /apps/ratanrt/mfe/tmp && \
    mkdir -p /apps/ratanrt/mfe/dist

RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.backup

COPY nginx/cloud/mfe-${BACKEND_ENV}.conf /etc/nginx/conf.d/mfe.conf
COPY nginx/cloud/nginx.conf /etc/nginx/nginx.conf
COPY dist /apps/ratanrt/mfe/dist

RUN chown -R 10001:10001 /etc/nginx
RUN chown -R 10001:10001 /apps/ratanrt

EXPOSE 8080

USER 10001
