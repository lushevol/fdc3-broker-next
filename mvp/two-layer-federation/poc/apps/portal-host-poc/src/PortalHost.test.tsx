import { fireEvent, render, screen } from '@testing-library/react';
import { PortalHost } from './PortalHost';
import type { TileRegistryEntry } from './workspaceStore';

jest.mock('./TileSurface', () => ({
  TileSurface: ({ instance, onClose }: { instance: { instanceId: string; entry: { displayName: string } }; onClose(id: string): void }) => (
    <section aria-label={`Mounted ${instance.entry.displayName}`}>
      {instance.instanceId}<button onClick={() => onClose(instance.instanceId)}>Close from tile</button>
    </section>
  ),
}));

const tiles: TileRegistryEntry[] = [
  { tileId: 'cashflow', displayName: 'Cashflow', category: 'Operations', loader: 'module-federation', entry: '/cashflow', requiredEntitlements: ['cashflow.read'], contractVersion: '0.1' },
  { tileId: 'risk', displayName: 'Risk', category: 'Controls', loader: 'module-federation', entry: '/risk', requiredEntitlements: ['risk.read'], contractVersion: '0.1' },
];

describe('PortalHost', () => {
  it('shows only entitled Tiles and supports repeated opens, tab activation, and close', () => {
    render(<PortalHost registry={tiles} entitlements={['cashflow.read']} />);
    expect(screen.getByRole('button', { name: 'Open Cashflow' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open Risk' })).not.toBeInTheDocument();
    expect(screen.getByText('Choose an application')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open Cashflow' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open Cashflow' }));
    expect(screen.getByRole('tab', { name: 'Cashflow 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Cashflow 2' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('tab', { name: 'Cashflow 1' }));
    expect(screen.getByRole('tab', { name: 'Cashflow 1' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Close cashflow-1' }));
    expect(screen.queryByRole('tab', { name: 'Cashflow 1' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close from tile' }));
    expect(screen.getByText('Choose an application')).toBeInTheDocument();
  });
});
