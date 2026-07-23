import type {
  AuthorizationLimitRecord,
  AuthorizationLimitsRepository,
} from './authorization-limits-repository';

export interface AuthorizationLimitCreateCommand {
  readonly profile: string;
  readonly currency: 'USD';
  readonly limitation: number;
}

export interface AuthorizationLimitEditCommand extends AuthorizationLimitCreateCommand {
  readonly expectedVersion: number;
}

export interface AuthorizationLimitTransitionCommand {
  readonly profile: string;
  readonly currency: 'USD';
  readonly status: Exclude<AuthorizationLimitRecord['status'], 'CONFIRMED'>;
  readonly expectedVersion: number;
}

export interface AuthorizationLimitRemoveCommand {
  readonly profile: string;
  readonly currency: 'USD';
  readonly expectedVersion: number;
}

export interface AuthorizationLimitsService extends AuthorizationLimitsRepository {
  create(command: AuthorizationLimitCreateCommand): Promise<AuthorizationLimitRecord>;
  edit(command: AuthorizationLimitEditCommand): Promise<AuthorizationLimitRecord>;
  confirm(command: AuthorizationLimitTransitionCommand): Promise<AuthorizationLimitRecord>;
  reject(command: AuthorizationLimitTransitionCommand): Promise<AuthorizationLimitRecord>;
  remove(command: AuthorizationLimitRemoveCommand): Promise<AuthorizationLimitRecord>;
}

export type MutationErrorCategory =
  | 'unauthorized'
  | 'forbidden'
  | 'validation'
  | 'conflict'
  | 'unavailable'
  | 'unexpected';

export interface AuthorizationLimitsMutationErrorOptions {
  readonly retryable?: boolean;
  readonly cause?: unknown;
}

export class AuthorizationLimitsMutationError extends Error {
  readonly category: MutationErrorCategory;
  readonly retryable: boolean;
  readonly cause?: unknown;

  constructor(
    category: MutationErrorCategory,
    message: string,
    options: AuthorizationLimitsMutationErrorOptions = {},
  ) {
    super(message);
    this.name = 'AuthorizationLimitsMutationError';
    this.category = category;
    this.retryable = options.retryable ?? false;
    this.cause = options.cause;
  }
}
