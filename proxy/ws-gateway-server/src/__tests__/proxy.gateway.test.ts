import { ProxyGateway } from '../gateways/proxy.gateway';

describe('ProxyGateway', () => {
  test('keeps websocket handler context when register handler is invoked detached', () => {
    const clientRegistry = {
      registerSocket: jest.fn(),
      markHeartbeat: jest.fn(),
      selectNextClient: jest.fn(),
      listOnlineClients: jest.fn(() => []),
      removeSocket: jest.fn(),
    };

    const taskService = {
      appendChunk: jest.fn(),
      resolveTask: jest.fn(),
      rejectTask: jest.fn(),
    };

    const modelsAggregation = {
      acceptResponse: jest.fn(),
    };

    const gateway = new ProxyGateway(
      clientRegistry as any,
      taskService as any,
      modelsAggregation as any,
    );

    const detachedRegister = gateway.handleRegister;
    const result = detachedRegister(
      { id: 'socket-1' } as any,
      { clientName: 'test-client', version: '1.0.0', localBaseUrl: 'http://127.0.0.1:4141' },
    );

    expect(result).toEqual({ ok: true, socketId: 'socket-1' });
    expect(clientRegistry.registerSocket).toHaveBeenCalledWith('socket-1', {
      clientName: 'test-client',
      version: '1.0.0',
      localBaseUrl: 'http://127.0.0.1:4141',
    });
  });
});
