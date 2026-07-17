import { describe, expect, it, vi } from 'vitest';
import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  applicationRegistrySchema,
  appearanceSnapshotSchema,
  assertCompatibleApplicationModule,
  findApplicationForPath,
  type FederatedApplicationModule,
} from '../src';

const validApplication = {
  id: 'cashflow',
  displayName: 'Cashflow',
  remoteName: 'mfe_cashflow_poc',
  manifestUrl: 'http://127.0.0.1:9101/mf-manifest.json',
  exposedModule: './application',
  basePath: '/cashflow',
  contractVersion: APPLICATION_CONTRACT_VERSION,
  appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
  capabilities: ['navigation', 'notifications', 'telemetry', 'workspace', 'appearance'],
};

const validAppearance = {
  scheme: 'dark',
  preference: 'system',
  density: 'compact',
  locale: 'en-US',
  direction: 'ltr',
  contractVersion: APPEARANCE_CONTRACT_VERSION,
};

describe('appearanceSnapshotSchema', () => {
  it('accepts a complete appearance snapshot', () => {
    expect(appearanceSnapshotSchema.parse(validAppearance)).toEqual(validAppearance);
  });

  it.each([
    ['unknown scheme', { scheme: 'sepia' }],
    ['unknown preference', { preference: 'automatic' }],
    ['unknown density', { density: 'tiny' }],
    ['unknown direction', { direction: 'vertical' }],
    ['missing version', { contractVersion: undefined }],
  ])('rejects %s', (_name, change) => {
    expect(() => appearanceSnapshotSchema.parse({ ...validAppearance, ...change })).toThrow();
  });
});

describe('applicationRegistrySchema', () => {
  it('accepts a complete registry', () => {
    const result = applicationRegistrySchema.parse({ applications: [validApplication] });
    expect(result.applications[0]).toEqual(validApplication);
  });

  it.each([
    ['relative manifest', { manifestUrl: '/mf-manifest.json' }],
    ['route without slash', { basePath: 'cashflow' }],
    ['root route', { basePath: '/' }],
    ['unknown capability', { capabilities: ['root-access'] }],
    ['invalid remote name', { remoteName: 'cashflow remote' }],
  ])('rejects %s', (_name, change) => {
    expect(() =>
      applicationRegistrySchema.parse({
        applications: [{ ...validApplication, ...change }],
      }),
    ).toThrow();
  });

  it('rejects duplicate application IDs and base paths', () => {
    expect(() =>
      applicationRegistrySchema.parse({
        applications: [validApplication, { ...validApplication, displayName: 'Duplicate' }],
      }),
    ).toThrow(/unique/i);
  });
});

describe('assertCompatibleApplicationModule', () => {
  const compatibleModule: FederatedApplicationModule = {
    manifest: {
      id: 'cashflow',
      displayName: 'Cashflow',
      contractVersion: APPLICATION_CONTRACT_VERSION,
      appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
    },
    Application: vi.fn(() => null),
  };

  it('returns a compatible module', () => {
    expect(assertCompatibleApplicationModule(compatibleModule, validApplication)).toBe(
      compatibleModule,
    );
  });

  it('rejects unsupported contract versions', () => {
    expect(() =>
      assertCompatibleApplicationModule(
        { ...compatibleModule, manifest: { ...compatibleModule.manifest, contractVersion: '2.0.0' } },
        validApplication,
      ),
    ).toThrow(/contract version/i);
  });

  it('rejects unsupported appearance contract versions', () => {
    expect(() =>
      assertCompatibleApplicationModule(
        {
          ...compatibleModule,
          manifest: { ...compatibleModule.manifest, appearanceContractVersion: '2.0.0' },
        },
        validApplication,
      ),
    ).toThrow(/appearance contract version/i);

    expect(() =>
      assertCompatibleApplicationModule(compatibleModule, {
        ...validApplication,
        appearanceContractVersion: '0.9.0',
      }),
    ).toThrow(/appearance contract version/i);
  });

  it('rejects mismatched application identities', () => {
    expect(() =>
      assertCompatibleApplicationModule(
        { ...compatibleModule, manifest: { ...compatibleModule.manifest, id: 'trades' } },
        validApplication,
      ),
    ).toThrow(/identity/i);
  });

  it('rejects invalid module shapes', () => {
    expect(() => assertCompatibleApplicationModule({ manifest: compatibleModule.manifest }, validApplication)).toThrow(
      /component/i,
    );
    expect(() => assertCompatibleApplicationModule(null, validApplication)).toThrow(/missing/i);
    expect(() =>
      assertCompatibleApplicationModule({ Application: compatibleModule.Application }, validApplication),
    ).toThrow(/manifest/i);
  });

  it('rejects an unsupported registry contract even when the module is current', () => {
    expect(() =>
      assertCompatibleApplicationModule(compatibleModule, {
        ...validApplication,
        contractVersion: '0.9.0',
      }),
    ).toThrow(/contract version/i);
  });
});

describe('findApplicationForPath', () => {
  const registry = applicationRegistrySchema.parse({ applications: [validApplication] });

  it('matches the base route and nested routes', () => {
    expect(findApplicationForPath(registry.applications, '/cashflow')?.id).toBe('cashflow');
    expect(findApplicationForPath(registry.applications, '/cashflow/details')?.id).toBe('cashflow');
  });

  it('does not match an unrelated path or a shared prefix', () => {
    expect(findApplicationForPath(registry.applications, '/')).toBeUndefined();
    expect(findApplicationForPath(registry.applications, '/cashflows')).toBeUndefined();
  });
});
