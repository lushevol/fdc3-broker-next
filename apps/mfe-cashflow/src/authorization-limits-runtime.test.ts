import { IDENTITY_CONTRACT_VERSION, type IdentitySnapshot } from '@fm/platform-contracts';
import { AUTHORIZATION_LIMITS_PERMISSIONS } from './authorization-limits-policy';
import { authorizationLimitFixtures } from './authorization-limits-repository';
import type { AuthorizationLimitsService } from './authorization-limits-service';
import { composeAuthorizationLimitsRuntime } from './authorization-limits-runtime';

function service(): AuthorizationLimitsService {
  const record = authorizationLimitFixtures[0];
  return {
    list: jest.fn().mockResolvedValue(authorizationLimitFixtures),
    create: jest.fn().mockResolvedValue(record),
    edit: jest.fn().mockResolvedValue(record),
    confirm: jest.fn().mockResolvedValue(record),
    reject: jest.fn().mockResolvedValue(record),
    remove: jest.fn().mockResolvedValue(record),
  };
}

const anonymous: IdentitySnapshot = {
  state: 'anonymous',
  contractVersion: IDENTITY_CONTRACT_VERSION,
};

describe('Authorization Limits runtime composition', () => {
  it.each([
    ['missing identity and service', undefined, undefined],
    ['anonymous identity without service', anonymous, undefined],
    ['anonymous identity with service', anonymous, service()],
    ['authenticated identity without service', {
      state: 'authenticated' as const,
      userId: 'maker-one',
      permissions: [AUTHORIZATION_LIMITS_PERMISSIONS.initiate],
      contractVersion: IDENTITY_CONTRACT_VERSION,
    }, undefined],
  ])('fails closed for %s', (_label, identity, domainService) => {
    expect(composeAuthorizationLimitsRuntime(identity, domainService).mutation).toBeUndefined();
  });

  it('uses an injected service consistently for reads and authenticated mutations', () => {
    const domainService = service();
    const identity: IdentitySnapshot = {
      state: 'authenticated',
      userId: 'maker-one',
      permissions: [
        AUTHORIZATION_LIMITS_PERMISSIONS.access,
        AUTHORIZATION_LIMITS_PERMISSIONS.initiate,
      ],
      contractVersion: IDENTITY_CONTRACT_VERSION,
    };
    const runtime = composeAuthorizationLimitsRuntime(identity, domainService);
    expect(runtime.repository).toBe(domainService);
    expect(runtime.mutation).toMatchObject({ service: domainService, principal: {
      userId: 'maker-one', permissions: identity.permissions,
    } });
  });

  it('clones and freezes the translated domain principal', () => {
    const permissions: string[] = [
      AUTHORIZATION_LIMITS_PERMISSIONS.access,
      AUTHORIZATION_LIMITS_PERMISSIONS.initiate,
    ];
    const identity = {
      state: 'authenticated' as const,
      userId: 'maker-one',
      permissions,
      contractVersion: IDENTITY_CONTRACT_VERSION,
    };
    const runtime = composeAuthorizationLimitsRuntime(identity, service());
    permissions.push(AUTHORIZATION_LIMITS_PERMISSIONS.verify);
    expect(runtime.mutation?.principal.permissions).toEqual([
      AUTHORIZATION_LIMITS_PERMISSIONS.access,
      AUTHORIZATION_LIMITS_PERMISSIONS.initiate,
    ]);
    expect(Object.isFrozen(runtime.mutation?.principal)).toBe(true);
    expect(Object.isFrozen(runtime.mutation?.principal.permissions)).toBe(true);
    expect(Object.isFrozen(runtime)).toBe(true);
  });
});
