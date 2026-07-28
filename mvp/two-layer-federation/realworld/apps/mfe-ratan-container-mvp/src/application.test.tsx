import {
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type ApplicationProps,
  type PlatformCapabilities,
} from '@fm/platform-contracts';
import { createAppearanceController, createIdentityController } from '@fm/platform-sdk';
import { fireEvent, render, screen } from '@testing-library/react';
import { Application, manifest, migrationResponsibilities } from './application';

function capabilities(): PlatformCapabilities {
  const appearance = createAppearanceController({
    scheme: 'dark',
    preference: 'dark',
    density: 'comfortable',
    locale: 'en-SG',
    direction: 'ltr',
    contractVersion: APPEARANCE_CONTRACT_VERSION,
  });
  const identity = createIdentityController({
    state: 'authenticated',
    userId: 'migration.verifier',
    permissions: ['migration:inspect'],
    contractVersion: IDENTITY_CONTRACT_VERSION,
  });
  return {
    navigation: { navigate: jest.fn() },
    notifications: { show: jest.fn() },
    telemetry: { track: jest.fn() },
    workspace: { closeCurrent: jest.fn() },
    appearance: appearance.capability,
    identity: identity.capability,
  };
}

describe('Ratan container migration MVP', () => {
  it('publishes a direct federated application manifest', () => {
    expect(manifest).toMatchObject({
      id: 'ratan-migration',
      displayName: 'Ratan Migration MVP',
      designSystemVersion: '1.1.0',
    });
  });

  it('shows how legacy responsibilities move out of the runtime container', () => {
    const platform = capabilities();
    const props: ApplicationProps = {
      instanceId: 'ratan-migration-1',
      basePath: '/ratan-migration',
      capabilities: platform,
    };
    render(<Application {...props} />);

    expect(screen.getByRole('heading', { name: 'Ratan container migration' })).toBeInTheDocument();
    expect(screen.getAllByTestId('migration-responsibility')).toHaveLength(
      migrationResponsibilities.length,
    );
    expect(screen.getByText('Versioned package')).toBeInTheDocument();
    expect(screen.getAllByText('Host capability')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: 'Report migration evidence' }));
    expect(platform.notifications.show).toHaveBeenCalledWith(
      'Ratan migration MVP has no downstream runtime consumers.',
    );
    expect(platform.telemetry.track).toHaveBeenCalledWith('ratan-migration.evidence', {
      instanceId: 'ratan-migration-1',
    });
  });
});
