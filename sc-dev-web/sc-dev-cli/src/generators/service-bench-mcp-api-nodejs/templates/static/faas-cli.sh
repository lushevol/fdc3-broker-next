#!/bin/bash

subcommand=$1
# check sub command is run or build
if [ "$subcommand" == "run" ]; then
    echo "Building the project and perform the deployment..."
    ssh scb@localhost -p 2222 <<'REALEND'
export DOCKER_HOST="unix://$(podman info -f "{{.Host.RemoteSocket.Path}}")"
export REGISTRY=192.168.49.1:5000
export BUILDPACK=buildpack-nodeapi:20250107.2
export BUILDER=builder-nodeapi:20250107.2

cd /media/sf_<%= bankId %>/faas-workspace/<%= applicationId %>-<%= componentId %>-<%= name %>

pack -v build \
${REGISTRY}/sc-app-platform/<%= name %>:localvm \
--path /media/sf_<%= bankId %>/faas-workspace/<%= applicationId %>-<%= componentId %>-<%= name %> \
--buildpack artifactory.global.standardchartered.com/sc-devkit/${BUILDPACK} \
--builder artifactory.global.standardchartered.com/sc-devkit/${BUILDER} \
--docker-host inherit \
--trust-builder
podman push 192.168.49.1:5000/sc-app-platform/<%= name %>:localvm --tls-verify=false


cat > ./function.yml << EOF
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: "<%= name %>"
  namespace: "<%= applicationId %>-<%= componentId %>"
spec:
  template:
    spec:
      containers:
        - image: 192.168.49.1:5000/sc-app-platform/<%= name %>:localvm
          imagePullPolicy: Always
          ports:
            - containerPort: 8080
          livenessProbe:
            exec:
              command: ["ls /opt/app"]
          envFrom:
            - configMapRef:
                name: <%= name %>-config
            - secretRef:
                name: <%= name %>-secret
EOF
# clean the old deployment
kubectl delete -f function.yml
kubectl delete configmap <%= name %>-config -n <%= applicationId %>-<%= componentId %>
kubectl delete secret generic <%= name %>-secret -n <%= applicationId %>-<%= componentId %>

# create new deployment
kubectl create namespace <%= applicationId %>-<%= componentId %>
kubectl create configmap <%= name %>-config -n <%= applicationId %>-<%= componentId %> --from-env-file ./env/local/env.properties
kubectl create secret generic <%= name %>-secret -n <%= applicationId %>-<%= componentId %> --from-env-file ./env/local/secret.properties
kubectl apply -f function.yml

REALEND
else
    echo "Invalid subcommand"
fi
