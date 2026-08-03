import {
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type ApplicationProps,
  type PlatformCapabilities,
} from '@fm/platform-contracts';
import { createAppearanceController, createIdentityController } from '@fm/platform-sdk';
import { fireEvent, render, screen } from '@testing-library/react';
import { Application, manifest } from './application';
import { standaloneCapabilities } from './standalone';

const appearance = createAppearanceController({
  scheme: 'dark',
  preference: 'dark',
  density: 'comfortable',
  locale: 'en-SG',
  direction: 'ltr',
  contractVersion: APPEARANCE_CONTRACT_VERSION,
});

function capabilities(authenticated: boolean): PlatformCapabilities {
  const identity = createIdentityController(authenticated ? {
    state: 'authenticated',
    userId: 'maker.one',
    permissions: ['portal:access', 'limits:review'],
    contractVersion: IDENTITY_CONTRACT_VERSION,
  } : {
    state: 'anonymous',
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

function mount(platform: PlatformCapabilities) {
  const props: ApplicationProps = {
    instanceId: 'identity-profile-1',
    basePath: '/identity-profile',
    capabilities: platform,
  };
  return render(<Application {...props} />);
}

describe('identity profile verification application', () => {
  it('publishes an independent production manifest', () => {
    expect(manifest).toMatchObject({
      id: 'identity-profile',
      displayName: 'Identity & Profile',
      identityContractVersion: IDENTITY_CONTRACT_VERSION,
      designSystemVersion: '1.1.0',
    });
  });

  it('renders authenticated identity, roles, metadata, and disclosures', () => {
    mount(capabilities(true));
    expect(screen.getByRole('heading', { name: 'maker.one' })).toBeInTheDocument();
    expect(screen.getByLabelText('Permissions')).toHaveTextContent('limits:review');
    expect(screen.getByText('identity-profile-1')).toBeInTheDocument();
    expect(screen.getByText(/Review exceptions/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Runtime evidence' }));
    expect(screen.getByText(/independently deployed remote/)).toBeInTheDocument();
  });

  it('renders an actionable anonymous state', () => {
    const platform = capabilities(false);
    mount(platform);
    expect(screen.getByText('No authenticated profile')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Notify host' }));
    expect(platform.notifications.show).toHaveBeenCalledWith(
      'Profile requires authentication',
    );
  });

  it('treats a missing optional identity capability as anonymous', () => {
    const platform = capabilities(false);
    mount({ ...platform, identity: undefined });
    expect(screen.getByText('No authenticated profile')).toBeInTheDocument();
    expect(screen.getByText('anonymous')).toBeInTheDocument();
  });

  it('provides authenticated standalone capabilities', () => {
    expect(standaloneCapabilities.identity?.getSnapshot()).toMatchObject({
      state: 'authenticated',
      userId: 'profile.verifier',
    });
    const alert = jest.spyOn(window, 'alert').mockImplementation(() => undefined);
    const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    standaloneCapabilities.navigation.navigate('/profile/details');
    standaloneCapabilities.notifications.show('ready');
    standaloneCapabilities.telemetry.track('preview', { ready: true });
    standaloneCapabilities.workspace.closeCurrent();
    expect(window.location.pathname).toBe('/profile/details');
    expect(alert).toHaveBeenCalledWith('ready');
    expect(info).toHaveBeenCalledTimes(2);
    alert.mockRestore();
    info.mockRestore();
  });
});
