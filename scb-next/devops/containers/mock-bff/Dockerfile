FROM node:22-alpine

WORKDIR /opt/scb-next/mock-bff
COPY devops/mock-bff/ ./

ENV HOST=0.0.0.0
ENV PORT=8081
EXPOSE 8081

USER 1000:1000
CMD ["node", "minikube-route-adapter.mjs"]
