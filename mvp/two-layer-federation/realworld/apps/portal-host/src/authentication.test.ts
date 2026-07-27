import { IDENTITY_CONTRACT_VERSION } from '@fm/platform-contracts';
import {
  createIdentityCapability,
  DEMO_AUTHENTICATION_ADAPTER,
} from './authentication';

describe('deterministic POC authentication', () => {
  it('creates an immutable identity capability around a snapshot', () => {
    const snapshot = {
      state: 'authenticated',
      userId: 'operator',
      permissions: ['portal:access'],
      contractVersion: IDENTITY_CONTRACT_VERSION,
    } as const;
    const capability = createIdentityCapability(snapshot);
    expect(capability.getSnapshot()).toBe(snapshot);
    expect(capability.subscribe(jest.fn())()).toBeUndefined();
    expect(Object.isFrozen(capability)).toBe(true);
  });

  it('authenticates the documented POC account', async () => {
    await expect(
      DEMO_AUTHENTICATION_ADAPTER.authenticate({
        username: 'test',
        password: 'test',
      }),
    ).resolves.toMatchObject({
      state: 'authenticated',
      userId: 'test',
      permissions: ['portal:access'],
    });
    expect(DEMO_AUTHENTICATION_ADAPTER.ssoHref).toBe('/auth/sso');
  });

  it('rejects invalid credentials without exposing which field failed', async () => {
    await expect(
      DEMO_AUTHENTICATION_ADAPTER.authenticate({
        username: 'test',
        password: 'wrong',
      }),
    ).rejects.toThrow('The username or password is incorrect.');
  });

});
