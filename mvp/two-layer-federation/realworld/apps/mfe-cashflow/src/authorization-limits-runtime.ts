import type { IdentitySnapshot } from '@fm/platform-contracts';
import type { AuthorizationLimitsMutationCapability } from './AuthorizationLimits';
import type { AuthorizationLimitsRepository } from './authorization-limits-repository';
import type { AuthorizationLimitsService } from './authorization-limits-service';

export interface AuthorizationLimitsRuntime {
  readonly repository?: AuthorizationLimitsRepository;
  readonly mutation?: AuthorizationLimitsMutationCapability;
}

const READ_ONLY_RUNTIME: AuthorizationLimitsRuntime = Object.freeze({});

export function composeAuthorizationLimitsRuntime(
  identity: IdentitySnapshot | undefined,
  service: AuthorizationLimitsService | undefined,
): AuthorizationLimitsRuntime {
  if (!service) return READ_ONLY_RUNTIME;
  if (!identity || identity.state === 'anonymous') {
    return Object.freeze({ repository: service });
  }

  const principal = Object.freeze({
    userId: identity.userId,
    permissions: Object.freeze([...identity.permissions]),
  });
  const mutation = Object.freeze({ principal, service });
  return Object.freeze({ repository: service, mutation });
}
