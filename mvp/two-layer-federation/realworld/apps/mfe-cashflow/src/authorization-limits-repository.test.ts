import {
  authorizationLimitFixtures,
  authorizationLimitsRepository,
  formatUsdLimit,
} from './authorization-limits-repository';

describe('Authorization Limits repository', () => {
  it('returns stable cloned records and formats USD', async () => {
    const first = await authorizationLimitsRepository.list();
    const second = await authorizationLimitsRepository.list();
    expect(first).toHaveLength(12);
    expect(first[0]).toEqual(expect.objectContaining({ limitationId: 'LIM-1001', currency: 'USD' }));
    expect(first[0]).not.toBe(authorizationLimitFixtures[0]);
    expect(second[0]).not.toBe(first[0]);
    expect(Object.isFrozen(first[0])).toBe(true);
    expect(formatUsdLimit(5000000)).toBe('$5,000,000.00');
  });
});
