export DOCKER_HOST="unix://$(podman info -f "{{.Host.RemoteSocket.Path}}")"

cd /media/sf_<%= bankId %>/faas-workspace/<%= applicationId %>-<%= name %>

mvn clean package -DskipTests=true -Dmaven.javadoc.skip=true -Dquarkus.package.type=uber-jar
podman build --build-arg JAR_FILE=target/*-runner.jar -t <%= name %> .
podman tag localhost/<%= name %> 192.168.49.1:5000/<%= name %>
podman push 192.168.49.1:5000/<%= name %> --tls-verify=false

# clean the old deployment
kubectl delete -f function.yml
kubectl delete configmap <%= name %>-config -n <%= applicationId %>
kubectl delete secret generic <%= name %>-secret -n <%= applicationId %>

# create new deployment
kubectl create namespace <%= applicationId %>
kubectl create configmap <%= name %>-config -n <%= applicationId %> --from-env-file ./env/local/env.properties
kubectl create secret generic <%= name %>-secret -n <%= applicationId %> --from-env-file ./env/local/env.properties
kubectl apply -f function.yml
