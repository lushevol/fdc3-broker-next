#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { loadAll } from 'js-yaml';

const args = process.argv.slice(2);

function option(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

const mode = option('--mode') ?? 'base';
const kustomization = option('--kustomize');
const manifest = option('--manifest');

if (!['base', 'local', 'production'].includes(mode)) {
  throw new Error(`Unsupported --mode ${mode}; expected base, local, or production`);
}
if (Boolean(kustomization) === Boolean(manifest)) {
  throw new Error('Provide exactly one of --kustomize <directory> or --manifest <file>');
}

const rendered = kustomization
  ? execFileSync('kubectl', ['kustomize', kustomization], { encoding: 'utf8' })
  : readFileSync(manifest, 'utf8');
const resources = loadAll(rendered).filter(Boolean);
const failures = [];
const deployments = resources.filter((resource) => resource.kind === 'Deployment');
const services = resources.filter((resource) => resource.kind === 'Service');
const ingresses = resources.filter((resource) => resource.kind === 'Ingress');
const policies = resources.filter((resource) => resource.kind === 'NetworkPolicy');
const disruptionBudgets = resources.filter((resource) => resource.kind === 'PodDisruptionBudget');

function fail(resource, message) {
  failures.push(`${resource.kind}/${resource.metadata?.name ?? 'unnamed'}: ${message}`);
}

for (const deployment of deployments) {
  const pod = deployment.spec?.template?.spec;
  const containers = pod?.containers ?? [];
  if (pod?.automountServiceAccountToken !== false) {
    fail(deployment, 'automountServiceAccountToken must be false');
  }
  if (pod?.securityContext?.runAsNonRoot !== true) {
    fail(deployment, 'pod securityContext.runAsNonRoot must be true');
  }
  for (const container of containers) {
    const prefix = `container ${container.name ?? 'unnamed'}`;
    if (!container.readinessProbe || !container.livenessProbe) {
      fail(deployment, `${prefix} requires readiness and liveness probes`);
    }
    if (!container.resources?.requests || !container.resources?.limits) {
      fail(deployment, `${prefix} requires resource requests and limits`);
    }
    if (
      container.securityContext?.allowPrivilegeEscalation !== false ||
      container.securityContext?.readOnlyRootFilesystem !== true ||
      !container.securityContext?.capabilities?.drop?.includes('ALL')
    ) {
      fail(deployment, `${prefix} requires restricted container security settings`);
    }
    if (!container.image) {
      fail(deployment, `${prefix} must declare an image`);
    } else if (mode !== 'base' && /:(latest|replace-me)$/.test(container.image)) {
      fail(deployment, `${prefix} uses a mutable or placeholder image`);
    }
    if (mode === 'production' && !/@sha256:[a-f0-9]{64}$/.test(container.image ?? '')) {
      fail(deployment, `${prefix} image must use an immutable sha256 digest`);
    }
  }
  if (mode === 'production' && Number(deployment.spec?.replicas ?? 0) < 2) {
    fail(deployment, 'production replicas must be at least 2');
  }
  if (
    mode === 'production' &&
    !disruptionBudgets.some((budget) => budget.metadata?.name === deployment.metadata?.name)
  ) {
    fail(deployment, 'production requires a same-named PodDisruptionBudget');
  }
}

for (const service of services) {
  if ((service.spec?.type ?? 'ClusterIP') !== 'ClusterIP') {
    fail(service, 'only ClusterIP Services are permitted behind the edge');
  }
}

if (ingresses.length !== 1) {
  failures.push(`Expected exactly one Ingress; found ${ingresses.length}`);
}
for (const ingress of ingresses) {
  const backends = [
    ingress.spec?.defaultBackend?.service?.name,
    ...(ingress.spec?.rules ?? []).flatMap((rule) =>
      (rule.http?.paths ?? []).map((path) => path.backend?.service?.name),
    ),
  ].filter(Boolean);
  if (backends.some((backend) => backend !== 'scb-next-edge')) {
    fail(ingress, 'all public routes must terminate at scb-next-edge');
  }
  if (mode === 'production' && !(ingress.spec?.tls?.length > 0)) {
    fail(ingress, 'production Ingress TLS must be configured');
  }
  if (
    mode === 'production' &&
    (ingress.spec?.rules ?? []).some(
      (rule) => !rule.host || /(?:example\.invalid|replace-me)/i.test(rule.host),
    )
  ) {
    fail(ingress, 'production Ingress hosts must be explicit and non-placeholder');
  }
}

if (!policies.some((policy) => policy.metadata?.name === 'default-deny')) {
  failures.push('NetworkPolicy/default-deny is required');
}

for (const configMap of resources.filter((resource) => resource.kind === 'ConfigMap')) {
  for (const [key, value] of Object.entries(configMap.data ?? {})) {
    if (/(password|passwd|secret|token|private.?key)/i.test(key)) {
      fail(configMap, `secret-like key ${key} is not permitted in ConfigMap data`);
    }
    if (/BEGIN (?:RSA |EC )?PRIVATE KEY|(?:password|passwd|secret|token)\s*[:=]/i.test(value)) {
      fail(configMap, `secret-like value is not permitted in ConfigMap data key ${key}`);
    }
  }
}

if (failures.length > 0) {
  console.error(`Kubernetes manifest verification failed (${mode}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Kubernetes manifest verification passed (${mode}): ${deployments.length} Deployments, ${services.length} Services, ${policies.length} NetworkPolicies, ${disruptionBudgets.length} PodDisruptionBudgets`,
);
