import {
  IDENTITY_CONTRACT_VERSION,
  type IdentityCapability,
  type IdentitySnapshot,
} from '@fm/platform-contracts';


export interface Credentials {
  readonly username: string;
  readonly password: string;
}

export interface AuthenticationAdapter {
  authenticate(credentials: Credentials): Promise<IdentitySnapshot>;
  readonly ssoHref: string;
}

export function createIdentityCapability(
  snapshot: IdentitySnapshot,
): IdentityCapability {
  return Object.freeze({
    getSnapshot: () => snapshot,
    subscribe: () => () => undefined,
  });
}

const demoAuthenticationAdapter: AuthenticationAdapter = {
  ssoHref: '/auth/sso',
  async authenticate({ username, password }: Credentials): Promise<IdentitySnapshot> {
    if (username !== 'test' || password !== 'test') {
      throw new Error('The username or password is incorrect.');
    }
    return {
      state: 'authenticated',
      userId: username,
      permissions: ['portal:access'],
      contractVersion: IDENTITY_CONTRACT_VERSION,
    };
  },
};

export const DEMO_AUTHENTICATION_ADAPTER = Object.freeze(
  demoAuthenticationAdapter,
);
