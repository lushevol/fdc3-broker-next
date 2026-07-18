import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  FederatedCompatibilityError,
  applicationRegistrySchema,
  appearanceSnapshotSchema,
  identitySnapshotSchema,
  assertCompatibleApplicationModule,
  findApplicationForPath,
  type AppearanceCapability,
  type AppearanceSnapshot,
  type ApplicationRegistryEntry,
  type IdentityCapability,
  type IdentitySnapshot,
} from '../src';

const appearance: AppearanceSnapshot = {
  scheme: 'dark',
  preference: 'system',
  density: 'compact',
  locale: 'en-SG',
  direction: 'ltr',
  contractVersion: APPEARANCE_CONTRACT_VERSION,
};

const entry: ApplicationRegistryEntry = {
  id: 'cashflow',
  displayName: 'Cashflow',
  remoteName: 'mfe_cashflow',
  manifestUrl: 'https://apps.example.test/cashflow/mf-manifest.json',
  exposedModule: './application',
  basePath: '/cashflow',
  contractVersion: APPLICATION_CONTRACT_VERSION,
  appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
  capabilities: ['navigation', 'notifications', 'telemetry', 'workspace', 'appearance'],
};

const module = {
  manifest: {
    id: 'cashflow',
    displayName: 'Cashflow',
    contractVersion: APPLICATION_CONTRACT_VERSION,
    appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
    designSystemVersion: '1.0.0',
  },
  Application: () => null,
};

describe('production platform contracts', () => {
  it('uses independent stable production versions', () => {
    expect(APPLICATION_CONTRACT_VERSION).toBe('1.0.0');
    expect(APPEARANCE_CONTRACT_VERSION).toBe('1.0.0');
    expect(IDENTITY_CONTRACT_VERSION).toBe('1.0.0');
  });

  it('validates explicit anonymous and authenticated identity snapshots', () => {
    const anonymous = { state: 'anonymous', contractVersion: IDENTITY_CONTRACT_VERSION } as const;
    const authenticated = {
      state: 'authenticated', userId: 'operator-7', permissions: ['authorization-limits:write'],
      contractVersion: IDENTITY_CONTRACT_VERSION,
    } as const;
    expect(identitySnapshotSchema.parse(anonymous)).toEqual(anonymous);
    expect(identitySnapshotSchema.parse(authenticated)).toEqual(authenticated);
    expect(identitySnapshotSchema.safeParse({ ...authenticated, userId: '' }).success).toBe(false);
    expect(identitySnapshotSchema.safeParse({ ...authenticated, permissions: ['write', 'write'] }).success).toBe(false);
    expect(identitySnapshotSchema.safeParse({ ...authenticated, accessToken: 'secret' }).success).toBe(false);
    expect(identitySnapshotSchema.safeParse({ ...anonymous, userId: 'fabricated' }).success).toBe(false);
  });

  it('accepts a complete appearance snapshot and rejects malformed input', () => {
    expect(appearanceSnapshotSchema.parse(appearance)).toEqual(appearance);
    expect(appearanceSnapshotSchema.safeParse({ ...appearance, density: 'tiny' }).success).toBe(false);
    expect(appearanceSnapshotSchema.safeParse({ ...appearance, locale: '' }).success).toBe(false);
    expect(appearanceSnapshotSchema.safeParse({ ...appearance, contractVersion: '2.0.0' }).success).toBe(false);
  });

  it('validates a production runtime registry', () => {
    expect(applicationRegistrySchema.parse({ applications: [entry] })).toEqual({ applications: [entry] });
    expect(applicationRegistrySchema.safeParse({ applications: [{ ...entry, basePath: '/' }] }).success).toBe(false);
    expect(applicationRegistrySchema.safeParse({ applications: [entry, entry] }).success).toBe(false);
    expect(applicationRegistrySchema.safeParse({
      applications: [entry, { ...entry, id: 'other' }],
    }).success).toBe(false);
  });

  it('returns a compatible typed federated module', () => {
    expect(assertCompatibleApplicationModule(module, entry)).toBe(module);
  });

  it('negotiates identity only when the registry requests it', () => {
    expect(assertCompatibleApplicationModule(module, entry)).toBe(module);
    const identityEntry = {
      ...entry,
      capabilities: [...entry.capabilities, 'identity' as const],
      identityContractVersion: IDENTITY_CONTRACT_VERSION,
    };
    const identityModule = {
      ...module,
      manifest: { ...module.manifest, identityContractVersion: IDENTITY_CONTRACT_VERSION },
    };
    expect(assertCompatibleApplicationModule(identityModule, identityEntry)).toBe(identityModule);
    for (const [candidate, registryEntry] of [
      [module, identityEntry],
      [identityModule, { ...identityEntry, identityContractVersion: '2.0.0' }],
    ] as const) {
      try {
        assertCompatibleApplicationModule(candidate, registryEntry);
        throw new Error('Expected identity compatibility validation to fail');
      } catch (error) {
        expect(error).toBeInstanceOf(FederatedCompatibilityError);
        expect(error).toMatchObject({ code: 'IDENTITY_CONTRACT_UNSUPPORTED' });
      }
    }
  });

  it.each([
    ['MODULE_MISSING', undefined, entry],
    ['MODULE_MISSING', 42, entry],
    ['APPLICATION_EXPORT_MISSING', { manifest: module.manifest }, entry],
    ['MANIFEST_MISSING', { Application: module.Application }, entry],
    ['MANIFEST_MISSING', { Application: module.Application, manifest: 'invalid' }, entry],
    ['APPLICATION_ID_MISMATCH', { ...module, manifest: { ...module.manifest, id: 'other' } }, entry],
    ['APPLICATION_CONTRACT_UNSUPPORTED', { ...module, manifest: { ...module.manifest, contractVersion: '2.0.0' } }, entry],
    ['APPLICATION_CONTRACT_UNSUPPORTED', module, { ...entry, contractVersion: '2.0.0' }],
    ['APPEARANCE_CONTRACT_UNSUPPORTED', { ...module, manifest: { ...module.manifest, appearanceContractVersion: '2.0.0' } }, entry],
    ['APPEARANCE_CONTRACT_UNSUPPORTED', module, { ...entry, appearanceContractVersion: '2.0.0' }],
  ] as const)('throws stable compatibility code %s', (code, candidate, registryEntry) => {
    try {
      assertCompatibleApplicationModule(candidate, registryEntry);
      throw new Error('Expected compatibility validation to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(FederatedCompatibilityError);
      expect(error).toMatchObject({ code });
    }
  });

  it('locates exact and nested application paths', () => {
    expect(findApplicationForPath([entry], '/cashflow')).toBe(entry);
    expect(findApplicationForPath([entry], '/cashflow/details/CF-1')).toBe(entry);
    expect(findApplicationForPath([entry], '/other')).toBeUndefined();
  });

  it('types the immutable appearance capability surface', () => {
    expectTypeOf<AppearanceSnapshot>().toMatchTypeOf<Readonly<AppearanceSnapshot>>();
    expectTypeOf<AppearanceCapability['getSnapshot']>().returns.toEqualTypeOf<AppearanceSnapshot>();
    expectTypeOf<AppearanceCapability['subscribe']>().parameter(0).toBeFunction();
  });

  it('types the immutable identity capability surface', () => {
    expectTypeOf<IdentitySnapshot>().toMatchTypeOf<Readonly<IdentitySnapshot>>();
    expectTypeOf<IdentityCapability['getSnapshot']>().returns.toEqualTypeOf<IdentitySnapshot>();
    expectTypeOf<IdentityCapability['subscribe']>().parameter(0).toBeFunction();
  });
});
