import {
  AuthorizationLimitsMutationError,
  type AuthorizationLimitCreateCommand,
  type AuthorizationLimitEditCommand,
  type AuthorizationLimitRemoveCommand,
  type AuthorizationLimitsService,
  type AuthorizationLimitTransitionCommand,
  type MutationErrorCategory,
} from './authorization-limits-service';
import { authorizationLimitFixtures } from './authorization-limits-repository';

describe('Authorization Limits mutation service port', () => {
  it('accepts immutable domain command shapes without transport types', async () => {
    const existing = authorizationLimitFixtures[0];
    const create: AuthorizationLimitCreateCommand = {
      profile: 'NEW-PROFILE',
      currency: 'USD',
      limitation: 25,
    };
    const edit: AuthorizationLimitEditCommand = {
      profile: existing.profile,
      currency: 'USD',
      limitation: 50,
      expectedVersion: existing.version,
    };
    const transition: AuthorizationLimitTransitionCommand = {
      profile: existing.profile,
      currency: 'USD',
      status: 'EDIT_PENDING',
      expectedVersion: existing.version,
    };
    const remove: AuthorizationLimitRemoveCommand = {
      profile: existing.profile,
      currency: 'USD',
      expectedVersion: existing.version,
    };
    const service: AuthorizationLimitsService = {
      list: jest.fn().mockResolvedValue([existing]),
      create: jest.fn().mockResolvedValue(existing),
      edit: jest.fn().mockResolvedValue(existing),
      confirm: jest.fn().mockResolvedValue(existing),
      reject: jest.fn().mockResolvedValue(existing),
      remove: jest.fn().mockResolvedValue(existing),
    };

    await service.create(create);
    await service.edit(edit);
    await service.confirm(transition);
    await service.reject(transition);
    await service.remove(remove);
    expect(service.create).toHaveBeenCalledWith(create);
    expect(service.edit).toHaveBeenCalledWith(edit);
    expect(service.confirm).toHaveBeenCalledWith(transition);
    expect(service.reject).toHaveBeenCalledWith(transition);
    expect(service.remove).toHaveBeenCalledWith(remove);
  });

  it.each([
    ['unauthorized', false],
    ['forbidden', false],
    ['validation', false],
    ['conflict', false],
    ['unavailable', true],
    ['unexpected', false],
  ] as readonly (readonly [MutationErrorCategory, boolean])[])(
    'preserves the %s error category and retryability',
    (category, retryable) => {
      const cause = new Error('transport detail');
      const error = new AuthorizationLimitsMutationError(category, 'Mutation failed', {
        retryable,
        cause,
      });
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('AuthorizationLimitsMutationError');
      expect(error.category).toBe(category);
      expect(error.retryable).toBe(retryable);
      expect(error.cause).toBe(cause);
    },
  );

  it('defaults unknown failures to non-retryable without inventing a cause', () => {
    const error = new AuthorizationLimitsMutationError('unexpected', 'Unexpected failure');
    expect(error.retryable).toBe(false);
    expect(error.cause).toBeUndefined();
  });
});
