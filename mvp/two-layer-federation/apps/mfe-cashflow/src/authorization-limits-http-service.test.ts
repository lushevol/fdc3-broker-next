import {
  createAuthorizationLimitsHttpService,
  decodeAuthorizationLimitRecord,
  type AuthorizationLimitsHttpRequest,
  type AuthorizationLimitsHttpTransport,
} from './authorization-limits-http-service';
import { authorizationLimitFixtures } from './authorization-limits-repository';
import { AuthorizationLimitsMutationError } from './authorization-limits-service';

function transportWith(body: unknown, status = 200) {
  const request = jest.fn().mockResolvedValue({ status, body });
  return { transport: { request } as AuthorizationLimitsHttpTransport, request };
}

describe('Authorization Limits HTTP service adapter', () => {
  it('maps all service operations to encoded endpoint requests', async () => {
    const record = authorizationLimitFixtures[0];
    const { transport, request } = transportWith(record);
    const service = createAuthorizationLimitsHttpService(transport);

    request.mockResolvedValueOnce({ status: 200, body: [record] });
    await service.list();
    await service.create({ profile: 'A/B PROFILE', currency: 'USD', limitation: 25 });
    await service.edit({
      profile: 'A/B PROFILE', currency: 'USD', limitation: 30, expectedVersion: 4,
    });
    await service.confirm({
      profile: 'A/B PROFILE', currency: 'USD', status: 'EDIT_PENDING', expectedVersion: 4,
    });
    await service.reject({
      profile: 'A/B PROFILE', currency: 'USD', status: 'DELETE_PENDING', expectedVersion: 5,
    });
    await service.remove({ profile: 'A/B PROFILE', currency: 'USD', expectedVersion: 5 });

    expect(request.mock.calls.map(([value]: [AuthorizationLimitsHttpRequest]) => value)).toEqual([
      { method: 'GET', path: '/api/ratan/v1/profileLimitation/' },
      {
        method: 'POST', path: '/api/ratan/v1/profileLimitation/create',
        body: { profile: 'A/B PROFILE', currency: 'USD', limitation: 25 },
      },
      {
        method: 'PUT', path: '/api/ratan/v1/profileLimitation/edit',
        body: { profile: 'A/B PROFILE', currency: 'USD', limitation: 30, version: 4 },
      },
      {
        method: 'PUT',
        path: '/api/ratan/v1/profileLimitation/confirm/A%2FB%20PROFILE/USD/EDIT_PENDING',
        body: { profile: 'A/B PROFILE', currency: 'USD', status: 'EDIT_PENDING', version: 4 },
      },
      {
        method: 'PUT',
        path: '/api/ratan/v1/profileLimitation/reject/A%2FB%20PROFILE/USD/DELETE_PENDING',
        body: { profile: 'A/B PROFILE', currency: 'USD', status: 'DELETE_PENDING', version: 5 },
      },
      {
        method: 'DELETE', path: '/api/ratan/v1/profileLimitation/A%2FB%20PROFILE/USD',
        body: { version: 5 },
      },
    ]);
  });

  it('decodes complete immutable list and mutation records', async () => {
    const source = { ...authorizationLimitFixtures[0] };
    const { transport, request } = transportWith([source]);
    const service = createAuthorizationLimitsHttpService(transport);
    const list = await service.list();
    expect(list).toEqual([source]);
    expect(list[0]).not.toBe(source);
    expect(Object.isFrozen(list)).toBe(true);
    expect(Object.isFrozen(list[0])).toBe(true);

    request.mockResolvedValueOnce({ status: 201, body: source });
    expect(await service.create({ profile: 'P', currency: 'USD', limitation: 1 })).toEqual(source);
    expect(decodeAuthorizationLimitRecord(source)).toEqual(source);
  });

  it.each([
    ['non-object', null],
    ['currency', { ...authorizationLimitFixtures[0], currency: 'EUR' }],
    ['status', { ...authorizationLimitFixtures[0], status: 'UNKNOWN' }],
    ['limitation', { ...authorizationLimitFixtures[0], limitation: Number.NaN }],
    ['version', { ...authorizationLimitFixtures[0], version: 1.5 }],
    ['audit field', { ...authorizationLimitFixtures[0], updatedAt: '' }],
  ])('rejects malformed %s record responses', async (_label, body) => {
    const { transport } = transportWith(body);
    const service = createAuthorizationLimitsHttpService(transport);
    await expect(
      service.create({ profile: 'P', currency: 'USD', limitation: 1 }),
    ).rejects.toMatchObject({ category: 'unexpected', retryable: false });
  });

  it('rejects malformed list shape and any malformed list member', async () => {
    const first = transportWith({ records: authorizationLimitFixtures });
    await expect(createAuthorizationLimitsHttpService(first.transport).list()).rejects.toMatchObject({
      category: 'unexpected',
    });
    const second = transportWith([{ ...authorizationLimitFixtures[0], status: 'UNKNOWN' }]);
    await expect(createAuthorizationLimitsHttpService(second.transport).list()).rejects.toMatchObject({
      category: 'unexpected',
    });
  });

  it.each([
    [400, 'validation', false],
    [401, 'unauthorized', false],
    [403, 'forbidden', false],
    [409, 'conflict', false],
    [422, 'validation', false],
    [500, 'unavailable', true],
    [503, 'unavailable', true],
    [418, 'unexpected', false],
  ] as const)('maps HTTP %s to %s', async (status, category, retryable) => {
    const { transport } = transportWith({ message: 'Backend explanation' }, status);
    await expect(createAuthorizationLimitsHttpService(transport).list()).rejects.toMatchObject({
      category,
      retryable,
      message: 'Backend explanation',
    });
  });

  it('maps thrown transport failures and preserves categorized failures', async () => {
    const cause = new Error('socket closed');
    const transport: AuthorizationLimitsHttpTransport = {
      request: jest.fn().mockRejectedValue(cause),
    };
    await expect(createAuthorizationLimitsHttpService(transport).list()).rejects.toMatchObject({
      category: 'unavailable', retryable: true, cause,
    });

    const categorized = new AuthorizationLimitsMutationError('forbidden', 'Policy denied');
    (transport.request as jest.Mock).mockRejectedValueOnce(categorized);
    await expect(createAuthorizationLimitsHttpService(transport).list()).rejects.toBe(categorized);
  });

  it('does not fabricate empty success for a failed list', async () => {
    const transport: AuthorizationLimitsHttpTransport = {
      request: jest.fn().mockRejectedValue(new Error('offline')),
    };
    await expect(createAuthorizationLimitsHttpService(transport).list()).rejects.toBeInstanceOf(
      AuthorizationLimitsMutationError,
    );
  });
});
