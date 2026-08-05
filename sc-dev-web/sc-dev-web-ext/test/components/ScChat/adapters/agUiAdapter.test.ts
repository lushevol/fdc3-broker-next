import { agUiAdapter } from '../../../../src/components/ScChat/adapters/agUiAdapter.js';
import { TextDecoder as UtilTextDecoder } from 'util';

if (!(globalThis as any).TextDecoder) {
  (globalThis as any).TextDecoder = UtilTextDecoder;
}

const createSseResponse = (
  chunks: string[],
  options: {
    ok?: boolean;
    status?: number;
    body?: boolean;
  } = {}
) => {
  const encodedChunks = chunks.map(chunk => Uint8Array.from(chunk.split('').map(char => char.charCodeAt(0))));
  let index = 0;

  const response: any = {
    ok: options.ok ?? true,
    status: options.status ?? 200,
    headers: new Headers({
      'content-type': 'text/event-stream',
    }),
    body:
      options.body === false
        ? null
        : {
            getReader: () => ({
              read: async () => {
                if (index < encodedChunks.length) {
                  return {
                    done: false,
                    value: encodedChunks[index++],
                  };
                }
                return { done: true, value: undefined };
              },
            }),
          },
  };

  return response as Response;
};

describe('agUiAdapter', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns empty ai model setup result', async () => {
    const result = await agUiAdapter.setupAiModels({});

    expect(result).toEqual({
      aiModels: [],
      aiModelMap: {},
    });
  });

  it('streams through rest client and parses AG-UI events', async () => {
    const restClient = {
      request: jest.fn().mockResolvedValue(
        createSseResponse([
          'data: {"type":"RUN_STARTED","threadId":"conv-1","runId":"run-1"}\n\n',
          'data: {"type":"TEXT_MESSAGE_START","messageId":"msg-1","role":"assistant"}\n\n',
          'data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"msg-1","delta":"Hello"}\n\n',
          'data: {"type":"TEXT_MESSAGE_END","messageId":"msg-1"}\n\n',
          'data: {"type":"RUN_FINISHED","threadId":"conv-1","runId":"run-1","outcome":{"type":"success"}}\n\n',
        ])
      ),
    };

    const onData = jest.fn();
    const onComplete = jest.fn();
    const onError = jest.fn();

    await agUiAdapter.streamChat(
      { restClient } as any,
      {
        content: 'How are you?',
        model: 'MODEL_A',
        conversationId: 'conv-1',
      },
      {
        onData,
        onComplete,
        onError,
      },
      {
        metadata: { tenant: 'acme' },
      }
    );

    expect(restClient.request).toHaveBeenCalledTimes(1);

    const requestArgs = restClient.request.mock.calls[0];
    expect(requestArgs[0]).toBe('ag-ui-api');
    expect(requestArgs[1]).toBe('chat');
    expect(requestArgs[2]).toBe('POST');

    const requestBody = JSON.parse(requestArgs[3]);
    expect(requestBody.version).toBe('1.0');
    expect(requestBody.conversationId).toBe('conv-1');
    expect(requestBody.messages[0]).toEqual({ role: 'user', content: 'How are you?' });
    expect(requestBody.metadata).toEqual({ tenant: 'acme', model: 'MODEL_A' });

    expect(onData).toHaveBeenCalledWith('Hello');
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
  });

  it('reports error when rest client is unavailable', async () => {
    const onError = jest.fn();

    await agUiAdapter.streamChat(
      {},
      {
        content: 'Say hi',
        model: 'MODEL_B',
        conversationId: 'conv-2',
      },
      {
        onData: jest.fn(),
        onError,
      }
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect((onError.mock.calls[0][0] as Error).message).toBe('REST client is required for AG-UI streaming');
  });

  it('does not emit callbacks for RUN_ERROR event', async () => {
    const restClient = {
      request: jest.fn().mockResolvedValue(
        createSseResponse([
          'data: {"type":"RUN_STARTED","threadId":"conv-3","runId":"run-3"}\n\n',
          'data: {"type":"RUN_ERROR","message":"Boom"}\n\n',
        ])
      ),
    };

    const onData = jest.fn();
    const onDataError = jest.fn();
    const onComplete = jest.fn();
    const onError = jest.fn();

    await agUiAdapter.streamChat(
      { restClient } as any,
      {
        content: 'trigger error',
        model: 'MODEL_C',
        conversationId: 'conv-3',
      },
      {
        onData,
        onDataError,
        onComplete,
        onError,
      }
    );

    expect(onData).not.toHaveBeenCalled();
    expect(onDataError).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('swallows AbortError without calling onError', async () => {
    const restClient = {
      request: jest.fn().mockRejectedValue({ name: 'AbortError' }),
    };

    const onError = jest.fn();

    await agUiAdapter.streamChat(
      { restClient } as any,
      {
        content: 'abort request',
        model: 'MODEL_D',
        conversationId: 'conv-4',
      },
      {
        onData: jest.fn(),
        onError,
      }
    );

    expect(onError).not.toHaveBeenCalled();
  });

  it('uses metadata.model when input model is empty', async () => {
    const restClient = {
      request: jest.fn().mockResolvedValue(
        createSseResponse([
          'data: {"type":"RUN_STARTED","threadId":"conv-5","runId":"run-5"}\n\n',
          'data: {"type":"RUN_FINISHED","threadId":"conv-5","runId":"run-5","outcome":{"type":"success"}}\n\n',
        ])
      ),
    };

    await agUiAdapter.streamChat(
      { restClient } as any,
      {
        content: 'No model in input',
        model: '',
        conversationId: 'conv-5',
      },
      {
        onData: jest.fn(),
        onComplete: jest.fn(),
        onError: jest.fn(),
      },
      {
        metadata: { model: 'MODEL_FROM_METADATA' },
      }
    );

    const requestBody = JSON.parse(restClient.request.mock.calls[0][3]);
    expect(requestBody.metadata.model).toBe('MODEL_FROM_METADATA');
  });

  it('omits metadata entirely when model is unavailable', async () => {
    const restClient = {
      request: jest.fn().mockResolvedValue(
        createSseResponse([
          'data: {"type":"RUN_STARTED","threadId":"conv-6","runId":"run-6"}\n\n',
          'data: {"type":"RUN_FINISHED","threadId":"conv-6","runId":"run-6","outcome":{"type":"success"}}\n\n',
        ])
      ),
    };

    await agUiAdapter.streamChat(
      { restClient } as any,
      {
        content: 'No model anywhere',
        model: '',
        conversationId: 'conv-6',
      },
      {
        onData: jest.fn(),
        onComplete: jest.fn(),
        onError: jest.fn(),
      },
      {
        metadata: { tenant: 'acme', model: '' },
      }
    );

    const requestBody = JSON.parse(restClient.request.mock.calls[0][3]);
    expect('metadata' in requestBody).toBe(false);
  });
});
