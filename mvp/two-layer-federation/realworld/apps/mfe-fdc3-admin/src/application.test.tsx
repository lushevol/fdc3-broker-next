import {
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type ApplicationProps,
  type PlatformCapabilities,
} from '@fm/platform-contracts';
import { createAppearanceController, createIdentityController } from '@fm/platform-sdk';
import { fireEvent, render, screen, within } from '@testing-library/react';
import {
  Application,
  defaultDeclarations,
  formatInterop,
  manifest,
  parseInterop,
} from './application';
import { standaloneCapabilities } from './standalone';

function capabilities(): PlatformCapabilities {
  const appearance = createAppearanceController({
    scheme: 'dark', preference: 'dark', density: 'comfortable', locale: 'en-SG', direction: 'ltr',
    contractVersion: APPEARANCE_CONTRACT_VERSION,
  });
  const identity = createIdentityController({
    state: 'authenticated', userId: 'fdc3.operator', permissions: ['fdc3:admin'],
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

function mount(platform = capabilities()) {
  const props: ApplicationProps = { instanceId: 'fdc3-admin-1', basePath: '/fdc3-admin', capabilities: platform };
  return { ...render(<Application {...props} />), platform };
}

describe('FDC3 admin verification application', () => {
  it('publishes a standalone FDC3 remote and preserves interop normalization', () => {
    expect(manifest).toMatchObject({ id: 'fdc3-admin', displayName: 'FDC3 Admin', designSystemVersion: '1.1.0' });
    expect(parseInterop(formatInterop(defaultDeclarations[0]))).toEqual({
      listensFor: ['ViewInstrument'],
      raises: ['ViewContact'],
      contexts: ['fdc3.instrument', 'fdc3.contact'],
    });
    expect(() => parseInterop('{')).toThrow();
    expect(() => parseInterop('[]')).toThrow('Interop JSON must be an object.');
    expect(() => parseInterop('{}')).toThrow('intents object');
    expect(() => parseInterop('{"intents":[]}')).toThrow('intents object');
    expect(() => parseInterop('{"intents":{"listensFor":{},"raises":[]}}')).toThrow('listensFor must be an array');
    expect(() => parseInterop('{"intents":{"listensFor":[],"raises":{}}}')).toThrow('raises must be an array');
    expect(() => parseInterop('{"intents":{"listensFor":[{}],"raises":[]}}')).toThrow('requires an intent name');
    expect(() => parseInterop('{"intents":{"listensFor":[{"intent":"ViewInstrument","contexts":{}}],"raises":[]}}')).toThrow('contexts must be an array');
    expect(() => parseInterop('{"intents":{"listensFor":[{"intent":"ViewInstrument","contexts":[42]}],"raises":[]}}')).toThrow('Context names must be strings');
  });

  it('creates, validates, edits, searches, and deletes a declaration', () => {
    const { platform } = mount();
    fireEvent.click(screen.getByRole('button', { name: 'Create declaration' }));
    expect(screen.getByRole('dialog', { name: 'Create declaration' }).parentElement).toBe(document.body);
    fireEvent.click(screen.getByRole('button', { name: /Application/ }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'FDC3 Admin' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Interop JSON' }), {
      target: { value: '{ invalid' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save declaration' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Interop JSON is invalid');
    fireEvent.change(screen.getByRole('textbox', { name: 'Interop JSON' }), {
      target: { value: formatInterop({ appId: 'fdc3-admin', listensFor: ['StartChat'], raises: [], contexts: ['fdc3.chat.init'] }) },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save declaration' }));
    expect(screen.getByRole('cell', { name: 'fdc3.chat.init' })).toBeInTheDocument();
    expect(platform.notifications.show).toHaveBeenCalledWith('FDC3 declaration for fdc3-admin saved');
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search FDC3' }), { target: { value: 'fdc3-admin' } });
    expect(screen.getByText('fdc3-admin')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Delete declaration fdc3-admin' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.queryByRole('rowheader', { name: 'fdc3-admin' })).not.toBeInTheDocument();
  });

  it('edits existing declarations and exposes the empty and adapter paths', () => {
    const { platform } = mount();
    fireEvent.click(screen.getByRole('button', { name: 'Test adapter' }));
    expect(platform.notifications.show).toHaveBeenCalledWith('FDC3 adapter simulation ready');
    fireEvent.click(screen.getByRole('button', { name: 'Edit declaration cashflow' }));
    expect(screen.getByRole('dialog', { name: 'Edit cashflow' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Application' })).toBeDisabled();
    fireEvent.change(screen.getByRole('textbox', { name: 'Interop JSON' }), {
      target: { value: formatInterop({ appId: 'cashflow', listensFor: [], raises: ['StartChat'], contexts: ['fdc3.chat.init'] }) },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save declaration' }));
    expect(screen.getAllByText('fdc3.chat.init')).not.toHaveLength(0);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search FDC3' }), { target: { value: 'nothing-here' } });
    expect(screen.getByText('No matching declarations')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search FDC3' }), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Delete declaration cashflow' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByText('cashflow')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Create declaration' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close Create declaration' }));
  });

  it('maintains intent and context catalogs with reference-aware confirmation', () => {
    mount();
    fireEvent.click(screen.getByRole('tab', { name: 'Intent catalog' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create intent' }));
    expect(screen.getByRole('dialog', { name: 'Create intent' }).parentElement).toBe(document.body);
    fireEvent.click(screen.getByRole('button', { name: 'Close Create intent' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create intent' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Intent name' }), { target: { value: 'RaiseAlert' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Description' }), { target: { value: 'Raise an operations alert.' } });
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Create intent' })).getByRole('button', { name: 'Create intent' }));
    expect(screen.getByText('RaiseAlert')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Delete ViewInstrument' }));
    expect(screen.getByRole('dialog', { name: 'Delete intent' })).toHaveTextContent('cashflow');
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit RaiseAlert' }));
    expect(screen.getByRole('textbox', { name: 'Intent name' })).toBeDisabled();
    fireEvent.change(screen.getByRole('textbox', { name: 'Description' }), { target: { value: 'Updated.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(screen.getByText('Updated.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Delete RaiseAlert' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.queryByText('RaiseAlert')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Context catalog' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create context' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Context type' }), { target: { value: 'fdc3.alert' } });
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Create context' })).getByRole('button', { name: 'Create context' }));
    expect(screen.getByText('fdc3.alert')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Edit fdc3.alert' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Description' }), { target: { value: 'Alert context.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(screen.getByText('Alert context.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Delete fdc3.alert' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.queryByText('fdc3.alert')).not.toBeInTheDocument();
  });

  it('provides deterministic standalone capabilities', () => {
    expect(standaloneCapabilities.identity?.getSnapshot()).toMatchObject({ state: 'authenticated', userId: 'fdc3.verifier' });
    const alert = jest.spyOn(window, 'alert').mockImplementation(() => undefined);
    standaloneCapabilities.notifications.show('ready');
    expect(alert).toHaveBeenCalledWith('ready');
    standaloneCapabilities.navigation.navigate('/fdc3-preview');
    expect(window.location.pathname).toBe('/fdc3-preview');
    const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    standaloneCapabilities.telemetry.track('declaration-opened', { appId: 'cashflow' });
    standaloneCapabilities.workspace.closeCurrent();
    expect(info).toHaveBeenCalledWith('fdc3-event', { event: 'declaration-opened', data: { appId: 'cashflow' } });
    expect(info).toHaveBeenCalledWith('close fdc3 preview');
    info.mockRestore();
    alert.mockRestore();
  });
});
