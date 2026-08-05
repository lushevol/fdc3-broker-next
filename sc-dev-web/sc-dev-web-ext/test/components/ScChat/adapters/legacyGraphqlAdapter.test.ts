import { legacyGraphqlAdapter } from '../../../../src/components/ScChat/adapters/legacyGraphqlAdapter.js';
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

describe('legacyGraphqlAdapter', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns empty setup result when graphQL client is missing', async () => {
    const result = await legacyGraphqlAdapter.setupAiModels({});

    expect(result).toEqual({
      aiModels: [],
      aiModelMap: {},
    });
  });

  it('builds aiModelMap from GraphQL response', async () => {
    const graphQLClient = {
      query: jest.fn().mockResolvedValue({
        json: async () => ({
          data: {
            asksb: {
              ai_models: [
                { id: 'M1', name: 'Model One' },
                { id: 'M2', name: 'Model Two' },
              ],
            },
          },
        }),
      }),
    };

    const result = await legacyGraphqlAdapter.setupAiModels({ graphQLClient } as any);

    expect(graphQLClient.query).toHaveBeenCalledTimes(1);
    expect(graphQLClient.query.mock.calls[0][0]).toContain('get_ai_models');
    expect(result.aiModels.length).toBe(2);
    expect(result.aiModelMap.M1.name).toBe('Model One');
    expect(result.aiModelMap.M2.name).toBe('Model Two');
  });

  it('returns empty setup result when GraphQL query fails', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    const graphQLClient = {
      query: jest.fn().mockRejectedValue(new Error('GraphQL unavailable')),
    };

    const result = await legacyGraphqlAdapter.setupAiModels({ graphQLClient } as any);

    expect(result).toEqual({
      aiModels: [],
      aiModelMap: {},
    });
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('streams chat via rest client and emits data/completion', async () => {
    const restClient = {
      request: jest.fn().mockResolvedValue(
        createSseResponse([
          'data: {"output":{"id":"chunk-1","choices":[{"delta":{"content":"Hi"}}]}}\n',
          'data: {"output":{"id":"STOP-1","choices":[{"delta":{"content":""}}]}}\n',
        ])
      ),
    };

    const onData = jest.fn();
    const onComplete = jest.fn();
    const onError = jest.fn();

    await legacyGraphqlAdapter.streamChat(
      { restClient } as any,
      {
        content: 'hello',
        model: 'LEGACY_M1',
        conversationId: 'legacy-1',
        toolsetId: 'toolset-1',
        categoryId: 'category-1',
      },
      {
        onData,
        onComplete,
        onError,
      },
      {
        legacyApiName: 'legacy-api-override',
        legacyResource: 'legacy-resource-override',
      }
    );

    expect(restClient.request).toHaveBeenCalledTimes(1);

    const requestArgs = restClient.request.mock.calls[0];
    expect(requestArgs[0]).toBe('legacy-api-override');
    expect(requestArgs[1]).toBe('legacy-resource-override');
    expect(requestArgs[2]).toBe('POST');

    const requestBody = JSON.parse(requestArgs[3]);
    expect(requestBody.variables.content).toBe('hello');
    expect(requestBody.query).toContain('model: "LEGACY_M1"');
    expect(requestBody.query).toContain('conversationId: "legacy-1"');
    expect(requestBody.query).toContain('toolsetId: "toolset-1"');
    expect(requestBody.query).toContain('categoryId: "category-1"');

    expect(onData).toHaveBeenCalledWith('Hi');
    expect(onComplete.mock.calls.length).toBeGreaterThan(0);
    expect(onError).not.toHaveBeenCalled();
  });

  it('reports error when rest client is unavailable', async () => {
    const onError = jest.fn();

    await legacyGraphqlAdapter.streamChat(
      {},
      {
        content: 'fallback',
        model: 'LEGACY_M2',
        conversationId: 'legacy-2',
      },
      {
        onData: jest.fn(),
        onError,
      }
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect((onError.mock.calls[0][0] as Error).message).toBe(
      'REST client is required for legacy GraphQL streaming'
    );
  });

  it('calls onDataError for non-data chunks', async () => {
    const restClient = {
      request: jest.fn().mockResolvedValue(
        createSseResponse(['data: {"output":{"id":"chunk-without-content","choices":[{"delta":{}}]}}\n'])
      ),
    };

    const onDataError = jest.fn();

    await legacyGraphqlAdapter.streamChat(
      { restClient } as any,
      {
        content: 'invalid chunk',
        model: 'LEGACY_M3',
        conversationId: 'legacy-3',
      },
      {
        onData: jest.fn(),
        onDataError,
        onComplete: jest.fn(),
      }
    );

    expect(onDataError).toHaveBeenCalledTimes(1);
    expect(onDataError.mock.calls[0][0].error).toBe('Not a data chunk');
  });

  it('routes stream errors to onError callback', async () => {
    const restClient = {
      request: jest.fn().mockResolvedValue(createSseResponse([], { ok: false, status: 500 })),
    };

    const onError = jest.fn();

    await legacyGraphqlAdapter.streamChat(
      { restClient } as any,
      {
        content: 'fail stream',
        model: 'LEGACY_M4',
        conversationId: 'legacy-4',
      },
      {
        onData: jest.fn(),
        onError,
      }
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect((onError.mock.calls[0][0] as Error).message).toBe('HTTP error! status: 500');
  });
});
