import axios from 'axios';
import type { AxiosInstance } from 'axios';
import {
  ChatService,
  RateLimitError,
  getChatService,
  initializeChatService,
} from '../exports';
import type { ChatMessage } from '../common/interface';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

type MockClient = AxiosInstance & {
  post: jest.Mock;
  get: jest.Mock;
  interceptors: {
    request: {
      use: jest.Mock;
    };
    response: {
      use: jest.Mock;
    };
  };
};

const mockedAxios = axios as jest.Mocked<typeof axios>;

const createMockClient = () => {
  const client = {
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  } as MockClient;

  return { client };
};

describe('ChatService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  });

  it('preserves explicit zero timeout when constructing the axios client', () => {
    const { client } = createMockClient();
    mockedAxios.create.mockReturnValue(client);

    new ChatService({ baseUrl: 'http://localhost:8080/api/chat', timeout: 0 });

    expect(mockedAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: 0,
      }),
    );
  });

  it('injects the auth header through the registered request interceptor', () => {
    const { client } = createMockClient();
    mockedAxios.create.mockReturnValue(client);

    localStorage.setItem('auth_token', 'token-123');

    const service = new ChatService({ baseUrl: 'http://localhost:8080/api/chat' });

    const requestInterceptor = client.interceptors.request.use.mock.calls[0][0] as (
      config: { headers?: Record<string, string> },
    ) => { headers?: Record<string, string> };

    expect(
      requestInterceptor({
        headers: {},
      }),
    ).toEqual({
      headers: {
        Authorization: 'Bearer token-123',
      },
    });

    void service;
  });

  it('maps 401 responses to unauthorized cleanup and rejection', async () => {
    const { client } = createMockClient();
    mockedAxios.create.mockReturnValue(client);

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent').mockImplementation(() => true);
    const service = new ChatService({ baseUrl: 'http://localhost:8080/api/chat' });
    const responseRejected = client.interceptors.response.use.mock.calls[0][1] as (
      error: { response?: { status?: number } },
    ) => Promise<never>;

    const error = { response: { status: 401 } };

    await expect(responseRejected(error)).rejects.toBe(error);
    expect(removeItemSpy).toHaveBeenCalledWith('auth_token');
    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect((dispatchSpy.mock.calls[0][0] as CustomEvent).type).toBe('chatbot:unauthorized');

    removeItemSpy.mockRestore();
    dispatchSpy.mockRestore();
    void service;
  });

  it('maps 429 responses to RateLimitError and normalizes invalid retry-after values', async () => {
    const { client } = createMockClient();
    mockedAxios.create.mockReturnValue(client);

    new ChatService({ baseUrl: 'http://localhost:8080/api/chat' });
    const responseRejected = client.interceptors.response.use.mock.calls[0][1] as (
      error: { response?: { status?: number; headers?: Record<string, string> } },
    ) => Promise<never>;

    await expect(
      responseRejected({
        response: {
          status: 429,
          headers: {
            'retry-after': 'Wed, 21 Oct 2026 07:28:00 GMT',
          },
        },
      }),
    ).rejects.toMatchObject({
      name: 'RateLimitError',
      retryAfter: null,
    });

    expect(new RateLimitError('120').retryAfter).toBe(120);
    expect(new RateLimitError('Wed, 21 Oct 2026 07:28:00 GMT').retryAfter).toBeNull();
  });

  it('keeps only the helper methods needed by the non-runtime surface', async () => {
    const { client } = createMockClient();
    mockedAxios.create.mockReturnValue(client);

    const service = new ChatService({ baseUrl: 'http://localhost:8080/api/chat' });
    const messages = [
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'Tool result',
        timestamp: new Date('2026-03-19T00:00:02.000Z'),
      } satisfies ChatMessage,
    ];

    client.post.mockResolvedValueOnce({ data: undefined });
    client.get
      .mockResolvedValueOnce({ data: { messages } })
      .mockResolvedValueOnce({ status: 200 })
      .mockRejectedValueOnce(new Error('offline'));

    await service.confirmToolCall('conv-1', 'tool-1', true);
    expect(client.post).toHaveBeenCalledWith('/conv-1/tools/tool-1/confirm', {
      confirmed: true,
    });

    await expect(service.getConversationHistory('conv-1')).resolves.toEqual(messages);
    expect(client.get).toHaveBeenCalledWith('/conv-1/history');

    await expect(service.healthCheck()).resolves.toBe(true);
    await expect(service.healthCheck()).resolves.toBe(false);
    expect(client.get).toHaveBeenCalledWith('/health');
  });

  it('does not expose transport helpers on the service instance', () => {
    const { client } = createMockClient();
    mockedAxios.create.mockReturnValue(client);

    const service = new ChatService({ baseUrl: 'http://localhost:8080/api/chat' });

    expect((service as unknown as { createStreamConnection?: unknown }).createStreamConnection).toBeUndefined();
    expect((service as unknown as { sendMessage?: unknown }).sendMessage).toBeUndefined();
  });

  it('exposes compatibility shims through the public barrel without restoring singleton behavior', () => {
    const { client } = createMockClient();
    mockedAxios.create.mockReturnValue(client);

    const config = { baseUrl: 'http://localhost:8080/api/chat' };
    const service = initializeChatService(config);
    const serviceFromGet = getChatService(config);

    expect(service).toBeInstanceOf(ChatService);
    expect(serviceFromGet).toBeInstanceOf(ChatService);
    expect(serviceFromGet).not.toBe(service);
  });
});
