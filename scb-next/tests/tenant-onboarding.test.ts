import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const workspaceRoot = join(import.meta.dirname, '..');
const wizard = join(workspaceRoot, 'devops/tenant-onboarding/tenant-onboarding.sh');
const temporaryDirectories: string[] = [];

const validInput = `TENANT_ID=alpha-payments
TENANT_DISPLAY_NAME=Alpha Payments
BUSINESS_OWNER=Payments COO
TECHNICAL_OWNER=Alpha Engineering
SUPPORT_CONTACT=#alpha-payments-support
TARGET_ENVIRONMENT=non-production
ISOLATION_MODEL=namespace-per-tenant
NAMESPACE=scb-next-alpha-payments
API_PATH=/api/alpha-payments/
STATIC_PATH=/static/alpha-payments/
REMOTE_NAME=@fm/alpha_payments
REMOTE_ENTRY=/static/alpha-payments/remoteEntry.js
UI_IMAGE=registry.example/scb-next/alpha-ui@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
API_IMAGE=registry.example/scb-next/alpha-api@sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
API_SERVICE=alpha-payments-api
WEBSOCKET_PATH=/api/alpha-payments/socket/
IDENTITY_GROUPS=alpha-payments-users,alpha-payments-admins
ENTITLEMENT_PREFIX=ALPHA_PAYMENTS
SECRET_REFERENCES=vault:scb-next/alpha-payments
DATA_CLASSIFICATION=confidential
DATA_STORES=alpha-payments-db
EXTERNAL_EGRESS=payments-gateway.internal:443
AVAILABILITY_SLO=99.9%
RTO=60m
RPO=15m
ON_CALL=alpha-payments-primary
`;

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

function createRun(input = validInput) {
  const root = mkdtempSync(join(tmpdir(), 'scb-next-tenant-onboarding-'));
  temporaryDirectories.push(root);
  const inputPath = join(root, 'tenant.env');
  const outputDirectory = join(root, 'generated');
  writeFileSync(inputPath, input);

  return { root, inputPath, outputDirectory };
}

function runWizard(inputPath: string, outputDirectory: string) {
  return spawnSync(
    'bash',
    [wizard, '--non-interactive', '--input', inputPath, '--output-dir', outputDirectory],
    { cwd: workspaceRoot, encoding: 'utf8' },
  );
}

describe('SCB Next tenant onboarding CLI', () => {
  it('explains interactive and non-interactive usage without prompting or writing files', () => {
    const run = createRun();
    const result = spawnSync('bash', [wizard, '--help'], {
      cwd: run.root,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('SCB Next tenant onboarding processor');
    expect(result.stdout).toContain('--non-interactive');
    expect(result.stdout).toContain('--output-dir');
    expect(readdirSync(run.root)).toEqual(['tenant.env']);
  });

  it('generates a complete front-to-back tenant contract and incomplete approval checklist', () => {
    const run = createRun();
    const result = runWizard(run.inputPath, run.outputDirectory);
    const tenantDirectory = join(run.outputDirectory, 'alpha-payments');

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain('Generated tenant onboarding bundle');
    expect(readdirSync(tenantDirectory).sort()).toEqual([
      'onboarding-checklist.md',
      'tenant.env',
      'tenant.yaml',
    ]);

    const descriptor = readFileSync(join(tenantDirectory, 'tenant.yaml'), 'utf8');
    expect(descriptor).toContain("id: 'alpha-payments'");
    expect(descriptor).toContain("namespace: 'scb-next-alpha-payments'");
    expect(descriptor).toContain("apiPath: '/api/alpha-payments/'");
    expect(descriptor).toContain("remoteName: '@fm/alpha_payments'");
    expect(descriptor).toContain("secretReferences: 'vault:scb-next/alpha-payments'");
    expect(descriptor).toContain('serviceObjectives:');

    const checklist = readFileSync(join(tenantDirectory, 'onboarding-checklist.md'), 'utf8');
    expect(checklist).toContain('# Alpha Payments onboarding checklist');
    expect(checklist).toContain('- [ ] Platform owner approval');
    expect(checklist).toContain('- [ ] Tenant owner approval');
    expect(checklist).toContain('- [ ] Security approval');
    expect(checklist).toContain('- [ ] SRE production-readiness approval');
  });

  it('rejects invalid Kubernetes tenant identifiers before writing a bundle', () => {
    const run = createRun(validInput.replace('TENANT_ID=alpha-payments', 'TENANT_ID=Bad_Tenant'));
    const result = runWizard(run.inputPath, run.outputDirectory);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('TENANT_ID must be a lowercase Kubernetes-safe identifier');
    expect(() => readdirSync(run.outputDirectory)).toThrow();
  });

  it('rejects suspected raw secrets without echoing their values', () => {
    const sensitiveValue = 'super-sensitive-raw-value';
    const run = createRun(`${validInput}API_TOKEN=${sensitiveValue}\n`);
    const result = runWizard(run.inputPath, run.outputDirectory);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).not.toBe(0);
    expect(output).toContain('Raw secret material is not accepted');
    expect(output).not.toContain(sensitiveValue);
    expect(() => readdirSync(run.outputDirectory)).toThrow();
  });

  it('replaces generated artifacts deterministically on rerun', () => {
    const run = createRun();
    const first = runWizard(run.inputPath, run.outputDirectory);
    expect(first.status, first.stderr).toBe(0);
    const tenantDirectory = join(run.outputDirectory, 'alpha-payments');
    const firstArtifacts = ['tenant.yaml', 'tenant.env', 'onboarding-checklist.md'].map((file) =>
      readFileSync(join(tenantDirectory, file), 'utf8'),
    );

    const second = runWizard(run.inputPath, run.outputDirectory);
    expect(second.status, second.stderr).toBe(0);
    const secondArtifacts = ['tenant.yaml', 'tenant.env', 'onboarding-checklist.md'].map((file) =>
      readFileSync(join(tenantDirectory, file), 'utf8'),
    );

    expect(secondArtifacts).toEqual(firstArtifacts);
  });
});
