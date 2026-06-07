### Package

```bash
helm package . --app-version==0.5.0-alpha.14 -n application
```

### Install

```bash
helm install fmo-app-shell ratan-nginx-webapp-1.0.0.tgz -n application --wait
```

### Upgrade

```bash
helm upgrade --install fmo-app-shell ratan-nginx-webapp-1.0.0.tgz -n application --set "environment=dev,service.type=NodePort,replicas=3"
```
