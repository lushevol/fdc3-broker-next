FROM nginx:1.28.0-alpine3.21

RUN rm /etc/nginx/conf.d/default.conf \
    && mkdir -p /srv/scb-next/base /srv/scb-next/ratan /srv/scb-next/cashflow \
    && chown -R nginx:nginx /srv/scb-next /var/cache/nginx /var/run

COPY devops/nginx/nginx.conf /etc/nginx/nginx.conf
COPY devops/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY web/mfe-base-origin/dist /srv/scb-next/base
COPY web/mfe-ratan-container-origin/dist /srv/scb-next/ratan
COPY web/mfe-cashflow-blotter-origin/dist /srv/scb-next/cashflow

EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1:8080/healthz || exit 1
