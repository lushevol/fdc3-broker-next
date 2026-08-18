import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const workspaceRoot = join(import.meta.dirname, '..');
const scriptsRoot = join(workspaceRoot, 'devops');
const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('SCB Next operator command surface', () => {
  it('exposes repeatable VM and Kubernetes lifecycle commands', () => {
    const packageJson = JSON.parse(readFileSync(join(workspaceRoot, 'package.json'), 'utf8')) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts).toMatchObject({
      'ops:capture-environment': 'sh ./devops/scripts/capture-environment.sh',
      'ops:verify-static': 'sh ./devops/scripts/verify-static.sh',
      'vm:preflight': 'sh ./devops/vm/scripts/preflight.sh',
      'vm:validate': 'sh ./devops/vm/scripts/validate-config.sh',
      'vm:diagnostics': 'sh ./devops/vm/scripts/collect-diagnostics.sh',
      'k8s:preflight': 'sh ./devops/kubernetes/scripts/preflight.sh',
      'k8s:validate': 'sh ./devops/kubernetes/scripts/validate.sh',
      'k8s:validate:production':
        'SCB_NEXT_K8S_VALIDATION_MODE=production sh ./devops/kubernetes/scripts/validate.sh',
      'k8s:minikube:up': 'sh ./devops/kubernetes/scripts/minikube-up.sh',
      'k8s:minikube:status': 'sh ./devops/kubernetes/scripts/minikube-status.sh',
      'k8s:minikube:diagnostics': 'sh ./devops/kubernetes/scripts/collect-diagnostics.sh',
    });
  });

  it('keeps every operator shell script POSIX-parseable', () => {
    const relativeScripts = [
      'scripts/capture-environment.sh',
      'scripts/http-smoke.sh',
      'scripts/verify-static.sh',
      'vm/scripts/preflight.sh',
      'vm/scripts/validate-config.sh',
      'vm/scripts/collect-diagnostics.sh',
      'kubernetes/scripts/preflight.sh',
      'kubernetes/scripts/validate.sh',
      'kubernetes/scripts/minikube-up.sh',
      'kubernetes/scripts/minikube-status.sh',
      'kubernetes/scripts/collect-diagnostics.sh',
    ];

    for (const relativeScript of relativeScripts) {
      expect(() => execFileSync('sh', ['-n', join(scriptsRoot, relativeScript)])).not.toThrow();
    }
  });

  it('captures reproducible environment metadata without copying process secrets', () => {
    const evidenceRoot = mkdtempSync(join(tmpdir(), 'scb-next-evidence-'));
    temporaryDirectories.push(evidenceRoot);

    execFileSync('sh', [join(scriptsRoot, 'scripts/capture-environment.sh')], {
      cwd: workspaceRoot,
      env: {
        ...process.env,
        SCB_NEXT_EVIDENCE_DIR: evidenceRoot,
        SCB_NEXT_EVIDENCE_LABEL: 'unit-test',
        SCB_NEXT_TEST_SECRET: 'must-not-be-recorded',
      },
    });

    const runDirectories = readdirSync(evidenceRoot);
    expect(runDirectories).toHaveLength(1);
    const metadata = readFileSync(join(evidenceRoot, runDirectories[0], 'environment.txt'), 'utf8');
    expect(metadata).toContain('label=unit-test');
    expect(metadata).toContain('git_head=');
    expect(metadata).toContain('node_version=');
    expect(metadata).not.toContain('must-not-be-recorded');
  });

  it('keeps environment-owned VM inputs and generated evidence out of Git', () => {
    const gitignore = readFileSync(join(workspaceRoot, '.gitignore'), 'utf8');

    expect(gitignore).toContain('devops/vm/scb-next.env');
    expect(gitignore).toContain('devops/vm/rendered/');
    expect(gitignore).toContain('artifacts/verification/');
  });

  it('renders and structurally validates the documented VM environment', () => {
    const outputRoot = mkdtempSync(join(tmpdir(), 'scb-next-vm-'));
    temporaryDirectories.push(outputRoot);

    expect(() =>
      execFileSync('sh', [join(scriptsRoot, 'vm/scripts/validate-config.sh')], {
        cwd: workspaceRoot,
        env: {
          ...process.env,
          SCB_NEXT_VM_ENV_FILE: join(scriptsRoot, 'vm/scb-next.env.example'),
          SCB_NEXT_NGINX_OUTPUT: join(outputRoot, 'scb-next.conf'),
        },
      }),
    ).not.toThrow();
  });

  it('defines strict cache and security-header smoke checks', () => {
    const smoke = readFileSync(join(scriptsRoot, 'scripts/http-smoke.sh'), 'utf8');

    for (const header of [
      'x-content-type-options: nosniff',
      'x-frame-options: sameorigin',
      'referrer-policy: same-origin',
      'permissions-policy:',
    ]) {
      expect(smoke.toLowerCase()).toContain(header);
    }
    expect(smoke).toContain('cache-control:.*no-store');
  });
});

describe('SCB Next deployment policy gates', () => {
  const verifier = join(scriptsRoot, 'scripts/verify-kubernetes-manifests.mjs');
  const base = join(scriptsRoot, 'kubernetes/base');
  const minikube = join(scriptsRoot, 'kubernetes/overlays/minikube');

  it('accepts the hardened base and the explicitly local Minikube overlay', () => {
    expect(() =>
      execFileSync('node', [verifier, '--mode', 'base', '--kustomize', base]),
    ).not.toThrow();
    expect(() =>
      execFileSync('node', [verifier, '--mode', 'local', '--kustomize', minikube]),
    ).not.toThrow();
  });

  it('blocks placeholder images and missing TLS from production adoption', () => {
    const result = spawnSync('node', [verifier, '--mode', 'production', '--kustomize', base], {
      encoding: 'utf8',
    });
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).not.toBe(0);
    expect(output).toContain('immutable sha256 digest');
    expect(output).toContain('Ingress TLS');
    expect(output).toContain('PodDisruptionBudget');
  });

  it('runs Minikube setup in inspectable lifecycle stages', () => {
    const script = readFileSync(join(scriptsRoot, 'kubernetes/scripts/minikube-up.sh'), 'utf8');
    const stages = ['preflight.sh', 'minikube-start.sh', 'minikube-build.sh', 'minikube-deploy.sh'];
    let previousIndex = -1;

    for (const stage of stages) {
      const index = script.indexOf(stage);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    expect(script).toContain('SCB_NEXT_MINIKUBE_RUN_VERIFY');
  });
});
