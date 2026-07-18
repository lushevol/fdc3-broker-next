import type {
  AuthorizationLimitRecord,
  AuthorizationLimitStatus,
} from './authorization-limits-repository';
import {
  AuthorizationLimitsMutationError,
  type AuthorizationLimitCreateCommand,
  type AuthorizationLimitEditCommand,
  type AuthorizationLimitRemoveCommand,
  type AuthorizationLimitsService,
  type AuthorizationLimitTransitionCommand,
  type MutationErrorCategory,
} from './authorization-limits-service';

export type AuthorizationLimitsHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface AuthorizationLimitsHttpRequest {
  readonly method: AuthorizationLimitsHttpMethod;
  readonly path: string;
  readonly body?: unknown;
}

export interface AuthorizationLimitsHttpResponse {
  readonly status: number;
  readonly body: unknown;
}

export interface AuthorizationLimitsHttpTransport {
  request(request: AuthorizationLimitsHttpRequest): Promise<AuthorizationLimitsHttpResponse>;
}

const PREFIX = '/api/ratan/v1/profileLimitation';
const statuses = new Set<AuthorizationLimitStatus>([
  'CONFIRMED',
  'ADD_PENDING',
  'EDIT_PENDING',
  'DELETE_PENDING',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function invalidResponse(reason: string): never {
  throw new AuthorizationLimitsMutationError(
    'unexpected',
    `Invalid Authorization Limit response: ${reason}`,
  );
}

function requiredString(source: Record<string, unknown>, field: string): string {
  const value = source[field];
  if (typeof value !== 'string' || value.length === 0) invalidResponse(`${field} is required`);
  return value;
}

export function decodeAuthorizationLimitRecord(value: unknown): AuthorizationLimitRecord {
  if (!isRecord(value)) invalidResponse('record must be an object');
  const currency = requiredString(value, 'currency');
  if (currency !== 'USD') invalidResponse('currency must be USD');
  const status = requiredString(value, 'status');
  if (!statuses.has(status as AuthorizationLimitStatus)) invalidResponse(`unsupported status ${status}`);
  const limitation = value.limitation;
  if (typeof limitation !== 'number' || !Number.isFinite(limitation)) {
    invalidResponse('limitation must be a finite number');
  }
  const version = value.version;
  if (typeof version !== 'number' || !Number.isInteger(version) || version < 0) {
    invalidResponse('version must be a non-negative integer');
  }
  return Object.freeze({
    limitationId: requiredString(value, 'limitationId'),
    profile: requiredString(value, 'profile'),
    currency: 'USD',
    limitation,
    status: status as AuthorizationLimitStatus,
    version,
    createdAt: requiredString(value, 'createdAt'),
    createdBy: requiredString(value, 'createdBy'),
    updatedAt: requiredString(value, 'updatedAt'),
    updatedBy: requiredString(value, 'updatedBy'),
  });
}

function decodeAuthorizationLimitList(value: unknown): readonly AuthorizationLimitRecord[] {
  if (!Array.isArray(value)) invalidResponse('list must be an array');
  return Object.freeze(value.map(decodeAuthorizationLimitRecord));
}

function failureCategory(status: number): {
  readonly category: MutationErrorCategory;
  readonly retryable: boolean;
} {
  if (status === 400 || status === 422) return { category: 'validation', retryable: false };
  if (status === 401) return { category: 'unauthorized', retryable: false };
  if (status === 403) return { category: 'forbidden', retryable: false };
  if (status === 409) return { category: 'conflict', retryable: false };
  if (status >= 500) return { category: 'unavailable', retryable: true };
  return { category: 'unexpected', retryable: false };
}

function responseMessage(status: number, body: unknown): string {
  if (isRecord(body) && typeof body.message === 'string' && body.message.length > 0) {
    return body.message;
  }
  return `Authorization Limits request failed with status ${status}`;
}

function segment(value: string): string {
  return encodeURIComponent(value);
}

export function createAuthorizationLimitsHttpService(
  transport: AuthorizationLimitsHttpTransport,
): AuthorizationLimitsService {
  const execute = async (request: AuthorizationLimitsHttpRequest): Promise<unknown> => {
    let response: AuthorizationLimitsHttpResponse;
    try {
      response = await transport.request(request);
    } catch (reason) {
      if (reason instanceof AuthorizationLimitsMutationError) throw reason;
      throw new AuthorizationLimitsMutationError('unavailable', 'Authorization Limits service unavailable', {
        retryable: true,
        cause: reason,
      });
    }
    if (response.status < 200 || response.status >= 300) {
      const failure = failureCategory(response.status);
      throw new AuthorizationLimitsMutationError(
        failure.category,
        responseMessage(response.status, response.body),
        { retryable: failure.retryable },
      );
    }
    return response.body;
  };

  const mutationRecord = async (request: AuthorizationLimitsHttpRequest) =>
    decodeAuthorizationLimitRecord(await execute(request));

  return Object.freeze({
    async list() {
      return decodeAuthorizationLimitList(await execute({ method: 'GET', path: `${PREFIX}/` }));
    },
    create(command: AuthorizationLimitCreateCommand) {
      return mutationRecord({ method: 'POST', path: `${PREFIX}/create`, body: command });
    },
    edit(command: AuthorizationLimitEditCommand) {
      return mutationRecord({
        method: 'PUT',
        path: `${PREFIX}/edit`,
        body: {
          profile: command.profile,
          currency: command.currency,
          limitation: command.limitation,
          version: command.expectedVersion,
        },
      });
    },
    confirm(command: AuthorizationLimitTransitionCommand) {
      return mutationRecord({
        method: 'PUT',
        path: `${PREFIX}/confirm/${segment(command.profile)}/${segment(command.currency)}/${segment(command.status)}`,
        body: {
          profile: command.profile,
          currency: command.currency,
          status: command.status,
          version: command.expectedVersion,
        },
      });
    },
    reject(command: AuthorizationLimitTransitionCommand) {
      return mutationRecord({
        method: 'PUT',
        path: `${PREFIX}/reject/${segment(command.profile)}/${segment(command.currency)}/${segment(command.status)}`,
        body: {
          profile: command.profile,
          currency: command.currency,
          status: command.status,
          version: command.expectedVersion,
        },
      });
    },
    remove(command: AuthorizationLimitRemoveCommand) {
      return mutationRecord({
        method: 'DELETE',
        path: `${PREFIX}/${segment(command.profile)}/${segment(command.currency)}`,
        body: { version: command.expectedVersion },
      });
    },
  });
}
