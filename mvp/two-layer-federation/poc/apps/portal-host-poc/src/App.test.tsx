import { render, screen } from '@testing-library/react';
import { App } from './App';

jest.mock('./PortalHost', () => ({
  PortalHost: ({ registry, entitlements }: { registry: { tileId: string }[]; entitlements: string[] }) => (
    <div>tiles:{registry.map((tile) => tile.tileId).join(',')} entitlements:{entitlements.join(',')}</div>
  ),
}));

it('boots with the local POC registry and entitlement fixture', () => {
  render(<App />);
  expect(screen.getByText('tiles:cashflow,positions,restricted-risk entitlements:cashflow.read,positions.read')).toBeInTheDocument();
});
