FROM nginxinc/nginx-unprivileged:1.28-alpine

ARG STATIC_DIR

COPY devops/containers/static-ui/default.conf /etc/nginx/conf.d/default.conf
COPY ${STATIC_DIR}/ /usr/share/nginx/html/

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1:8080/healthz || exit 1
