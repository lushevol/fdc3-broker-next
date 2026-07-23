import type {
  AuthorizationLimitRecord,
  AuthorizationLimitStatus,
} from './authorization-limits-repository';

export const AUTHORIZATION_LIMITS_PERMISSIONS = Object.freeze({
  access: 'RATAN_PROFILE_LIMITS:ACCESS_FMO_POST_TRADE_PORTAL',
  initiate: 'RATAN_PROFILE_LIMITS:F_Input_Delete_Modify_Initiate',
  verify: 'RATAN_PROFILE_LIMITS:F_Input_Delete_Modify_Verify',
} as const);

export type AuthorizationLimitsRole = 'Checker' | 'Maker' | 'Visitor';

export interface AuthorizationLimitsPrincipal {
  readonly userId: string;
  readonly permissions: readonly string[];
}

export type AuthorizationLimitAction =
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve-add'
  | 'reject-add'
  | 'approve-edit'
  | 'reject-edit'
  | 'approve-delete'
  | 'reject-delete';

export type AuthorizationLimitDenialReason =
  | 'missing-access'
  | 'missing-initiate'
  | 'missing-verify'
  | 'self-verification'
  | 'invalid-status';

export type AuthorizationLimitDecision =
  | { readonly allowed: true; readonly reason: 'allowed' }
  | { readonly allowed: false; readonly reason: AuthorizationLimitDenialReason };

export interface AuthorizationLimitsPolicy {
  readonly role: AuthorizationLimitsRole;
  readonly view: AuthorizationLimitDecision;
  readonly create: AuthorizationLimitDecision;
  decide(
    action: AuthorizationLimitAction,
    record?: AuthorizationLimitRecord,
  ): AuthorizationLimitDecision;
  actionsFor(record: AuthorizationLimitRecord): readonly AuthorizationLimitAction[];
}

const allowed: AuthorizationLimitDecision = Object.freeze({ allowed: true, reason: 'allowed' });

function denied(reason: AuthorizationLimitDenialReason): AuthorizationLimitDecision {
  return { allowed: false, reason };
}

const pendingActions: Readonly<
  Record<Exclude<AuthorizationLimitStatus, 'CONFIRMED'>, readonly AuthorizationLimitAction[]>
> = Object.freeze({
  ADD_PENDING: ['approve-add', 'reject-add'],
  EDIT_PENDING: ['approve-edit', 'reject-edit'],
  DELETE_PENDING: ['approve-delete', 'reject-delete'],
});

export function createAuthorizationLimitsPolicy(
  principal: AuthorizationLimitsPrincipal,
): AuthorizationLimitsPolicy {
  const permissions = new Set(principal.permissions);
  const canVerify = permissions.has(AUTHORIZATION_LIMITS_PERMISSIONS.verify);
  const canInitiate = permissions.has(AUTHORIZATION_LIMITS_PERMISSIONS.initiate);
  const role: AuthorizationLimitsRole = canVerify ? 'Checker' : canInitiate ? 'Maker' : 'Visitor';
  const view = permissions.has(AUTHORIZATION_LIMITS_PERMISSIONS.access)
    ? allowed
    : denied('missing-access');
  const create = role === 'Visitor' ? denied('missing-initiate') : allowed;

  const decide = (
    action: AuthorizationLimitAction,
    record?: AuthorizationLimitRecord,
  ): AuthorizationLimitDecision => {
    if (action === 'create') return create;
    if (!record) return denied('invalid-status');

    if (action === 'edit' || action === 'delete') {
      if (record.status !== 'CONFIRMED') return denied('invalid-status');
      return role === 'Visitor' ? denied('missing-initiate') : allowed;
    }

    if (record.status === 'CONFIRMED' || !pendingActions[record.status].includes(action)) {
      return denied('invalid-status');
    }
    if (role !== 'Checker') return denied('missing-verify');
    if (record.updatedBy === principal.userId) return denied('self-verification');
    return allowed;
  };

  return Object.freeze({
    role,
    view,
    create,
    decide,
    actionsFor(record: AuthorizationLimitRecord) {
      const candidates: readonly AuthorizationLimitAction[] = record.status === 'CONFIRMED'
        ? ['edit', 'delete']
        : pendingActions[record.status];
      return Object.freeze(candidates.filter((action) => decide(action, record).allowed));
    },
  });
}
