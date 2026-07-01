import { createInstance } from '@module-federation/enhanced/runtime';
import { loadWorkspaceRemote } from './remoteLoader';

const mockLoadRemote = jest.fn();
const mockRegisterShared = jest.fn();
const mockBaseModule = { ErrorBoundry: { default: () => null } };
const MockRemoteComponent = () => null;

jest.mock('@module-federation/enhanced/runtime', () => ({
  createInstance: jest.fn(() => ({
    loadRemote: mockLoadRemote,
    registerShared: mockRegisterShared,
  })),
}));

describe('loadWorkspaceRemote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (globalThis as typeof globalThis & { System: { import: jest.Mock } }).System = {
      import: jest.fn().mockResolvedValue(mockBaseModule),
    };
    delete (window as Window & { __FM_BASE_MODULE__?: unknown }).__FM_BASE_MODULE__;
  });

  it('loads the Ratan container through Module Federation', async () => {
    mockLoadRemote.mockResolvedValue({ default: () => null });

    await loadWorkspaceRemote('@fm/ratan_container');

    expect(createInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'base_ratan_module_federation_host',
        remotes: expect.arrayContaining([
          expect.objectContaining({
            name: 'ratan_container',
            alias: 'ratan_container',
            entry: 'http://localhost:8009/mf-manifest.json',
          }),
        ]),
      }),
    );
    expect(mockRegisterShared).toHaveBeenCalledWith(
      expect.objectContaining({
        react: expect.objectContaining({
          version: '18.2.0',
          shareConfig: expect.objectContaining({ singleton: true }),
        }),
        'react-dom': expect.objectContaining({
          version: '18.2.0',
          shareConfig: expect.objectContaining({ singleton: true }),
        }),
      }),
    );
    expect(mockLoadRemote).toHaveBeenCalledWith('ratan_container');
    expect(globalThis.System.import).toHaveBeenCalledWith('@fm/base');
    expect((window as Window & { __FM_BASE_MODULE__?: unknown }).__FM_BASE_MODULE__).toBe(
      mockBaseModule,
    );
  });

  it('loads the cashflow blotter through Module Federation', async () => {
    mockLoadRemote.mockResolvedValue({ default: () => null });

    await loadWorkspaceRemote('@fm/ratan_cashflow_blotter');

    expect(mockLoadRemote).toHaveBeenCalledWith('ratan_cashflow_blotter');
    expect(globalThis.System.import).toHaveBeenCalledWith('@fm/base');
  });

  it('normalizes federated remotes that resolve directly to a component', async () => {
    mockLoadRemote.mockResolvedValue(MockRemoteComponent);

    const remoteModule = await loadWorkspaceRemote('@fm/ratan_cashflow_blotter');

    expect(remoteModule.default).toBe(MockRemoteComponent);
  });

  it('normalizes federated remotes with nested default exports', async () => {
    mockLoadRemote.mockResolvedValue({ default: { default: MockRemoteComponent } });

    const remoteModule = await loadWorkspaceRemote('@fm/ratan_cashflow_blotter');

    expect(remoteModule.default).toBe(MockRemoteComponent);
  });

  it('keeps non-migrated containers on SystemJS', async () => {
    await loadWorkspaceRemote('@fm/base');

    expect(mockLoadRemote).not.toHaveBeenCalled();
    expect(globalThis.System.import).toHaveBeenCalledWith('@fm/base');
  });
});
