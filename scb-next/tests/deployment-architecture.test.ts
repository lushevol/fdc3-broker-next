import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadAll } from 'js-yaml';
import { describe, expect, it } from 'vitest';

type KubernetesResource = {
  apiVersion?: string;
  kind?: string;
  metadata?: { name?: string; labels?: Record<string, string> };
  data?: Record<string, string>;
  spec?: Record<string, unknown>;
};

const workspaceRoot = join(import.meta.dirname, '..');
const deploymentRoot = join(workspaceRoot, 'devops');
const vmNginxPath = join(deploymentRoot, 'vm/nginx/scb-next.conf.template');
const kubernetesBase = join(deploymentRoot, 'kubernetes/base');
const minikubeOverlay = join(deploymentRoot, 'kubernetes/overlays/minikube');

function read(path: string) {
  return readFileSync(path, 'utf8');
}

function renderKustomization(path: string) {
  const output = execFileSync('kubectl', ['kustomize', path], {
    encoding: 'utf8',
  });

  return loadAll(output) as KubernetesResource[];
}

function resourcesOfKind(resources: KubernetesResource[], kind: string) {
  return resources.filter((resource) => resource.kind === kind);
}

describe('SCB Next edge routing contract', () => {
  it('routes platform and tenant traffic to independently owned upstreams', () => {
    const config = read(vmNginxPath);

    expect(config).toContain('upstream mfe_base');
    expect(config).toContain('upstream single_ui_bff');
    expect(config).toContain('upstream ratan_container');
    expect(config).toContain('upstream cashflow_blotter');
    expect(config).toContain('location ^~ /static/ratan/container/');
    expect(config).toContain('location ^~ /static/ratan/cashflow/');
    expect(config).toContain('location ^~ /remotes/ratan/');
    expect(config).toContain('location ^~ /remotes/cashflow/');
    expect(config).toContain('location /api/auth/');
    expect(config).toContain('proxy_pass http://single_ui_bff');
    expect(config).toContain('proxy_pass http://mfe_base');
  });

  it('orders specific Ratan API routes before the tenant and platform fallbacks', () => {
    const config = read(vmNginxPath);
    const specificRoutes = [
      'location ^~ /api/ratan/bff/',
      'location ^~ /api/ratan/socket/',
      'location ^~ /api/ratan/notification/',
      'location ^~ /api/ratan/da/',
    ];
    const tenantFallback = config.indexOf('location ^~ /api/ratan/ {');
    const platformFallback = config.indexOf('location /api/ {');

    expect(tenantFallback).toBeGreaterThan(0);
    expect(platformFallback).toBeGreaterThan(tenantFallback);
    for (const route of specificRoutes) {
      expect(config.indexOf(route)).toBeGreaterThan(0);
      expect(config.indexOf(route)).toBeLessThan(tenantFallback);
    }
  });

  it('supports socket upgrades and safe manifest caching', () => {
    const config = read(vmNginxPath);

    expect(config).toContain('proxy_set_header Upgrade $http_upgrade');
    expect(config).toContain('proxy_set_header Connection $connection_upgrade');
    expect(config).toContain('proxy_read_timeout 3600s');
    expect(config).toMatch(/remoteEntry\.js[\s\S]*no-store/);
  });
});

describe('SCB Next Kubernetes topology', () => {
  it('renders independent platform and tenant workloads behind ClusterIP services', () => {
    const resources = renderKustomization(kubernetesBase);
    const deployments = resourcesOfKind(resources, 'Deployment');
    const services = resourcesOfKind(resources, 'Service');
    const expectedNames = [
      'scb-next-edge',
      'ratan-edge',
      'mfe-base',
      'single-ui-bff',
      'ratan-container',
      'cashflow-blotter',
    ];

    expect(deployments.map((resource) => resource.metadata?.name).sort()).toEqual(
      expectedNames.toSorted(),
    );
    expect(services.map((resource) => resource.metadata?.name)).toEqual(
      expect.arrayContaining(expectedNames),
    );
    for (const service of services) {
      expect(service.spec?.type ?? 'ClusterIP').toBe('ClusterIP');
    }
  });

  it('keeps tenant routing internals exclusively in the Ratan-owned edge', () => {
    const resources = renderKustomization(kubernetesBase);
    const configMaps = resourcesOfKind(resources, 'ConfigMap');
    const platformConfig = configMaps.find(
      (resource) => resource.metadata?.name === 'scb-next-edge-config',
    );
    const ratanConfig = configMaps.find(
      (resource) => resource.metadata?.name === 'ratan-edge-config',
    );
    const platformTemplate = platformConfig?.data?.['default.conf.template'] ?? '';
    const ratanTemplate = ratanConfig?.data?.['default.conf.template'] ?? '';

    expect(platformConfig?.metadata?.labels?.['scb-next.io/owner']).toBe('platform');
    expect(ratanConfig?.metadata?.labels).toMatchObject({
      'scb-next.io/owner': 'ratan',
      'scb-next.io/tenant': 'ratan',
    });
    expect(platformTemplate).toContain('upstream ratan_edge');
    expect(platformTemplate).toContain('proxy_pass http://ratan_edge');
    expect(platformTemplate).toContain('proxy_set_header Upgrade $http_upgrade');
    expect(platformTemplate).toContain('proxy_set_header Connection $connection_upgrade');
    for (const path of ['/api/ratan/', '/static/ratan/', '/remotes/ratan/', '/remotes/cashflow/']) {
      expect(platformTemplate).toContain(path);
    }
    for (const tenantInternal of [
      'ratan_container',
      'cashflow_blotter',
      'ratan_bff',
      'ratan_notification',
      'ratan_data_ambassador',
      'ratan_api_gateway',
    ]) {
      expect(platformTemplate).not.toContain(tenantInternal);
      expect(ratanTemplate).toContain(tenantInternal);
    }
    expect(ratanTemplate).toContain('location ^~ /api/ratan/socket/');
    expect(ratanTemplate).toContain('proxy_set_header Upgrade $http_upgrade');
    expect(ratanTemplate).toMatch(/remoteEntry\.js[\s\S]*no-store/);
  });

  it('applies health, resources, and restricted security to every workload', () => {
    const deployments = resourcesOfKind(renderKustomization(kubernetesBase), 'Deployment');

    for (const deployment of deployments) {
      const spec = deployment.spec as {
        template?: {
          spec?: {
            automountServiceAccountToken?: boolean;
            securityContext?: { runAsNonRoot?: boolean };
            containers?: Array<{
              readinessProbe?: unknown;
              livenessProbe?: unknown;
              resources?: { requests?: unknown; limits?: unknown };
              securityContext?: {
                allowPrivilegeEscalation?: boolean;
                capabilities?: { drop?: string[] };
              };
            }>;
          };
        };
      };
      const pod = spec.template?.spec;

      expect(pod?.automountServiceAccountToken).toBe(false);
      expect(pod?.securityContext?.runAsNonRoot).toBe(true);
      expect(pod?.containers).toHaveLength(1);
      expect(pod?.containers?.[0].readinessProbe).toBeDefined();
      expect(pod?.containers?.[0].livenessProbe).toBeDefined();
      expect(pod?.containers?.[0].resources?.requests).toBeDefined();
      expect(pod?.containers?.[0].resources?.limits).toBeDefined();
      expect(pod?.containers?.[0].securityContext?.allowPrivilegeEscalation).toBe(false);
      expect(pod?.containers?.[0].securityContext?.capabilities?.drop).toContain('ALL');
    }
  });

  it('exposes only the edge through ingress and includes availability and network controls', () => {
    const resources = renderKustomization(kubernetesBase);
    const ingresses = resourcesOfKind(resources, 'Ingress');
    const policies = resourcesOfKind(resources, 'NetworkPolicy');
    const budgets = resourcesOfKind(resources, 'PodDisruptionBudget');
    const rendered = execFileSync('kubectl', ['kustomize', kubernetesBase], {
      encoding: 'utf8',
    });

    expect(ingresses).toHaveLength(1);
    expect(rendered).toContain('name: scb-next-edge');
    expect(rendered).not.toMatch(/type: (NodePort|LoadBalancer)/);
    expect(policies.map((resource) => resource.metadata?.name)).toContain('default-deny');
    expect(policies.map((resource) => resource.metadata?.name)).toEqual(
      expect.arrayContaining([
        'default-deny',
        'allow-ingress-to-platform-edge',
        'allow-platform-edge-egress',
        'allow-platform-upstreams-from-platform-edge',
        'allow-ratan-edge-from-platform-edge',
        'allow-ratan-edge-egress',
        'allow-ratan-upstreams-from-ratan-edge',
      ]),
    );
    expect(budgets.map((resource) => resource.metadata?.name)).toEqual(
      expect.arrayContaining(['scb-next-edge', 'ratan-edge']),
    );
    const platformEgress = policies.find(
      (resource) => resource.metadata?.name === 'allow-platform-edge-egress',
    );
    expect(JSON.stringify(platformEgress?.spec)).not.toMatch(/tenant-(?:ui|api)/);
    expect(JSON.stringify(platformEgress?.spec)).toContain('tenant-edge');
    const ratanEgress = policies.find(
      (resource) => resource.metadata?.name === 'allow-ratan-edge-egress',
    );
    expect(JSON.stringify(ratanEgress?.spec)).toContain('scb-next.io/tenant');
    expect(JSON.stringify(ratanEgress?.spec)).toContain('ratan');
  });

  it('renders a Minikube overlay with local non-production images', () => {
    const resources = renderKustomization(minikubeOverlay);
    const deployments = resourcesOfKind(resources, 'Deployment');
    const rendered = execFileSync('kubectl', ['kustomize', minikubeOverlay], {
      encoding: 'utf8',
    });

    expect(deployments).toHaveLength(7);
    expect(rendered).toContain('scb-next-local/');
    expect(rendered).toContain('scb-next.io/evidence-scope: frontend-routing-only');
  });
});

describe('SCB Next deployment commands', () => {
  const scripts = [
    'vm/scripts/verify.sh',
    'kubernetes/scripts/minikube-start.sh',
    'kubernetes/scripts/minikube-build.sh',
    'kubernetes/scripts/minikube-deploy.sh',
    'kubernetes/scripts/minikube-verify.sh',
    'kubernetes/scripts/minikube-cleanup.sh',
  ];

  it.each(scripts)('has valid POSIX shell syntax in devops/%s', (relativePath) => {
    const script = join(deploymentRoot, relativePath);

    expect(existsSync(script)).toBe(true);
    expect(() => execFileSync('sh', ['-n', script])).not.toThrow();
  });

  it('verifies that a Ratan edge outage is isolated and self-restoring', () => {
    const script = read(join(deploymentRoot, 'kubernetes/scripts/minikube-verify.sh'));

    expect(script).toContain('deployment/ratan-edge');
    expect(script).toContain('scale');
    expect(script).toContain('--replicas=0');
    expect(script).toContain('platform traffic remains available');
    expect(script).toContain('tenant traffic is unavailable');
    expect(script).toContain('tenant traffic recovers');
  });
});
