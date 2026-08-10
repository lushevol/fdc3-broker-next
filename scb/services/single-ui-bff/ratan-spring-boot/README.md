# Guide

### Package

```bash
helm package . --app-version=1.1.0.1-SNAPSHOT -n application
```

### Install

```bash
helm install ratanone-audit-trial ratan-spring-boot-1.0.0.tgz -n application --wait
```

### Upgrade

```bash
helm upgrade --install ratanone-audit-trial ratan-spring-boot-1.0.0.tgz -n application --set "environment=sit"
```
