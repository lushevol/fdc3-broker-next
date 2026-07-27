import { render, screen } from '@testing-library/react';
import {
  IDENTITY_CONTRACT_VERSION,
  type IdentityCapability,
} from '@fm/platform-contracts';
import { App } from './App';
import { loadApplicationRegistry } from './registry';
import { entry } from './test-fixtures';

let receivedIdentity: IdentityCapability | undefined;
jest.mock('./PortalHost', () => ({
  PortalHost: ({ identity }: { identity?: IdentityCapability }) => {
    receivedIdentity = identity;
    return <span>Injected host</span>;
  },
}));
jest.mock('./registry', () => ({ loadApplicationRegistry: jest.fn() }));
const mockedLoad = loadApplicationRegistry as jest.MockedFunction<typeof loadApplicationRegistry>;

it('threads the exact identity capability across asynchronous registry loading', async () => {
  const identity: IdentityCapability = {
    getSnapshot: () => ({
      state: 'authenticated',
      userId: 'operator',
      permissions: ['portal:access'],
      contractVersion: IDENTITY_CONTRACT_VERSION,
    }),
    subscribe: () => () => undefined,
  };
  mockedLoad.mockResolvedValue({ applications: [entry] });
  render(<App identity={identity} />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
  await screen.findByText('Injected host');
  expect(receivedIdentity).toBe(identity);
});
