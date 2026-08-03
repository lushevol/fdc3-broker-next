FROM nginx:1.28.0-alpine3.21

RUN rm /etc/nginx/conf.d/default.conf \
    && mkdir -p /srv/realworld \
    && chown -R nginx:nginx /srv/realworld /var/cache/nginx /var/run

COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 8080 8443

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1:8080/healthz || exit 1

