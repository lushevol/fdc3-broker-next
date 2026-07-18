import {
  AUTHORIZATION_LIMITS_PERMISSIONS,
  createAuthorizationLimitsPolicy,
  type AuthorizationLimitAction,
  type AuthorizationLimitsPrincipal,
} from './authorization-limits-policy';
import {
  authorizationLimitFixtures,
  type AuthorizationLimitRecord,
  type AuthorizationLimitStatus,
} from './authorization-limits-repository';

function principal(
  permissions: readonly string[],
  userId = 'current-user',
): AuthorizationLimitsPrincipal {
  return { userId, permissions };
}

function record(
  status: AuthorizationLimitStatus,
  updatedBy = 'another-user',
): AuthorizationLimitRecord {
  return { ...authorizationLimitFixtures[0], status, updatedBy };
}

describe('Authorization Limits entitlement policy', () => {
  it('derives deterministic roles with checker precedence', () => {
    const permissions = AUTHORIZATION_LIMITS_PERMISSIONS;
    expect(createAuthorizationLimitsPolicy(principal([])).role).toBe('Visitor');
    expect(createAuthorizationLimitsPolicy(principal([permissions.initiate])).role).toBe('Maker');
    expect(createAuthorizationLimitsPolicy(principal([permissions.verify])).role).toBe('Checker');
    expect(
      createAuthorizationLimitsPolicy(principal([permissions.initiate, permissions.verify])).role,
    ).toBe('Checker');
  });

  it('separates view access from initiate/create permission', () => {
    const permissions = AUTHORIZATION_LIMITS_PERMISSIONS;
    const visitor = createAuthorizationLimitsPolicy(principal([permissions.access]));
    expect(visitor.view).toEqual({ allowed: true, reason: 'allowed' });
    expect(visitor.create).toEqual({ allowed: false, reason: 'missing-initiate' });

    const makerWithoutAccess = createAuthorizationLimitsPolicy(principal([permissions.initiate]));
    expect(makerWithoutAccess.view).toEqual({ allowed: false, reason: 'missing-access' });
    expect(makerWithoutAccess.create).toEqual({ allowed: true, reason: 'allowed' });
  });

  it.each(['Maker', 'Checker'] as const)('allows confirmed edit/delete for a %s', (role) => {
    const permission = role === 'Maker'
      ? AUTHORIZATION_LIMITS_PERMISSIONS.initiate
      : AUTHORIZATION_LIMITS_PERMISSIONS.verify;
    const policy = createAuthorizationLimitsPolicy(principal([permission]));
    expect(policy.actionsFor(record('CONFIRMED'))).toEqual(['edit', 'delete']);
    expect(policy.decide('edit', record('CONFIRMED'))).toEqual({ allowed: true, reason: 'allowed' });
    expect(policy.decide('delete', record('CONFIRMED'))).toEqual({ allowed: true, reason: 'allowed' });
  });

  it.each([
    ['ADD_PENDING', ['approve-add', 'reject-add']],
    ['EDIT_PENDING', ['approve-edit', 'reject-edit']],
    ['DELETE_PENDING', ['approve-delete', 'reject-delete']],
  ] as const)('maps %s to its checker action pair', (status, actions) => {
    const policy = createAuthorizationLimitsPolicy(
      principal([AUTHORIZATION_LIMITS_PERMISSIONS.verify]),
    );
    expect(policy.actionsFor(record(status))).toEqual(actions);
    for (const action of actions) {
      expect(policy.decide(action, record(status))).toEqual({ allowed: true, reason: 'allowed' });
    }
  });

  it.each(['ADD_PENDING', 'EDIT_PENDING', 'DELETE_PENDING'] as const)(
    'blocks self-verification for %s',
    (status) => {
      const policy = createAuthorizationLimitsPolicy(
        principal([AUTHORIZATION_LIMITS_PERMISSIONS.verify], 'checker-one'),
      );
      expect(policy.actionsFor(record(status, 'checker-one'))).toEqual([]);
      const actionByStatus: Record<AuthorizationLimitStatus, AuthorizationLimitAction> = {
        CONFIRMED: 'edit',
        ADD_PENDING: 'approve-add',
        EDIT_PENDING: 'approve-edit',
        DELETE_PENDING: 'approve-delete',
      };
      expect(policy.decide(actionByStatus[status], record(status, 'checker-one'))).toEqual({
        allowed: false,
        reason: 'self-verification',
      });
    },
  );

  it('explains missing permission and incompatible status denials', () => {
    const visitor = createAuthorizationLimitsPolicy(principal([]));
    expect(visitor.decide('edit', record('CONFIRMED'))).toEqual({
      allowed: false,
      reason: 'missing-initiate',
    });
    expect(visitor.decide('approve-add', record('ADD_PENDING'))).toEqual({
      allowed: false,
      reason: 'missing-verify',
    });
    const checker = createAuthorizationLimitsPolicy(
      principal([AUTHORIZATION_LIMITS_PERMISSIONS.verify]),
    );
    expect(checker.decide('approve-edit', record('ADD_PENDING'))).toEqual({
      allowed: false,
      reason: 'invalid-status',
    });
    expect(checker.decide('edit')).toEqual({ allowed: false, reason: 'invalid-status' });
    expect(checker.decide('create')).toEqual(checker.create);
    const maker = createAuthorizationLimitsPolicy(
      principal([AUTHORIZATION_LIMITS_PERMISSIONS.initiate]),
    );
    expect(maker.decide('approve-delete', record('DELETE_PENDING'))).toEqual({
      allowed: false,
      reason: 'missing-verify',
    });
    expect(visitor.actionsFor(record('CONFIRMED'))).toEqual([]);
  });
});
