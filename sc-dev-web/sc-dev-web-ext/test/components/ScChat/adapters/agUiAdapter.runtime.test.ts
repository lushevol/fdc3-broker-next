import {
  createAgUiRuntimeAgent,
  executeAgUiRuntimeRun,
  submitAgUiRuntimePrompt,
  submitAgUiRuntimeResume,
} from '../../../../src/components/ScChat/adapters/agUiAdapter.js';

const mockRunAgent = jest.fn();
const mockAddMessage = jest.fn();
const mockHttpAgentConstructor = jest.fn();

jest.mock('@ag-ui/client', () => {
  class MockHttpAgent {
    constructor(options: any) {
      mockHttpAgentConstructor(options);
    }

    runAgent = mockRunAgent;

    addMessage = mockAddMessage;
  }

  return {
    HttpAgent: MockHttpAgent,
  };
});

describe('agUiAdapter runtime helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createAgUiRuntimeAgent wires custom fetch behavior and forwards request context', async () => {
    const response = { ok: true, status: 200 } as any;
    const normalizedResponse = { ok: true, status: 201, normalized: true } as any;
    const restClient = {
      request: jest.fn().mockResolvedValue(response),
    };
    const normalizeOutgoingBody = jest.fn().mockReturnValue('{"payload":true}');
    const runtimeHeadersToRecord = jest.fn().mockReturnValue({
      'x-runtime': '1',
    });
    const normalizeIncomingResponse = jest.fn().mockResolvedValue(normalizedResponse);
    const onSend = jest.fn();

    createAgUiRuntimeAgent({
      restClient: restClient as any,
      conversationId: 'conv-runtime',
      agUiApiName: 'custom-api',
      agUiResource: 'runtime-chat',
      normalizeOutgoingBody,
      runtimeHeadersToRecord,
      normalizeIncomingResponse,
      onSend,
    });

    expect(mockHttpAgentConstructor).toHaveBeenCalledTimes(1);
    const ctorArg = mockHttpAgentConstructor.mock.calls[0][0];
    expect(ctorArg.url).toBe('/custom-api/runtime-chat');
    expect(ctorArg.threadId).toBe('conv-runtime');

    const abortController = new AbortController();
    const fetchResult = await ctorArg.fetch('/unused', {
      method: 'PUT',
      body: 'raw-body',
      headers: { Authorization: 'Bearer token' },
      signal: abortController.signal,
    });

    expect(restClient.request).toHaveBeenCalledWith(
      'custom-api',
      'runtime-chat',
      'PUT',
      '{"payload":true}',
      { 'x-runtime': '1' },
      {},
      { onSend: expect.any(Function) }
    );

    expect(fetchResult).toBe(normalizedResponse);

    const requestOptions = restClient.request.mock.calls[0][6];
    const runtimeClient = { abort: jest.fn() };
    requestOptions.onSend(runtimeClient);
    expect(onSend).toHaveBeenCalledWith(runtimeClient);

    abortController.abort();
    expect(runtimeClient.abort).toHaveBeenCalledTimes(1);
  });

  it('createAgUiRuntimeAgent aborts immediately when signal is already aborted', async () => {
    const restClient = {
      request: jest.fn().mockResolvedValue({ ok: true, status: 200 }),
    };

    createAgUiRuntimeAgent({
      restClient: restClient as any,
      conversationId: 'conv-aborted',
    });

    const ctorArg = mockHttpAgentConstructor.mock.calls[0][0];
    const alreadyAborted = new AbortController();
    alreadyAborted.abort();

    await ctorArg.fetch('/unused', {
      body: null,
      signal: alreadyAborted.signal,
    });

    const requestOptions = restClient.request.mock.calls[0][6];
    const runtimeClient = { abort: jest.fn() };
    requestOptions.onSend(runtimeClient);

    expect(runtimeClient.abort).toHaveBeenCalledTimes(1);
  });

  it('createAgUiRuntimeAgent throws when rest client is unavailable', async () => {
    createAgUiRuntimeAgent({
      conversationId: 'conv-no-client',
    });

    const ctorArg = mockHttpAgentConstructor.mock.calls[0][0];

    await expect(
      ctorArg.fetch('/unused', {
        method: 'POST',
        body: '{}',
      })
    ).rejects.toThrow('REST client is not available in the current shell context.');
  });

  it('executeAgUiRuntimeRun sends prompt message and returns it', async () => {
    const agent = {
      addMessage: jest.fn(),
      runAgent: jest.fn().mockResolvedValue(undefined),
    } as any;
    const createRuntimeId = jest
      .fn()
      .mockReturnValueOnce('msg-1')
      .mockReturnValueOnce('run-1');
    const onUserMessage = jest.fn();
    const subscriber = {} as any;

    const result = await executeAgUiRuntimeRun({
      mode: 'prompt',
      agent,
      prompt: 'hello runtime',
      createRuntimeId,
      metadata: { tenant: 'acme' },
      subscriber,
      onUserMessage,
    });

    expect(agent.addMessage).toHaveBeenCalledWith({
      id: 'msg-1',
      role: 'user',
      content: 'hello runtime',
    });
    expect(onUserMessage).toHaveBeenCalledWith({
      id: 'msg-1',
      role: 'user',
      content: 'hello runtime',
    });
    expect(agent.runAgent).toHaveBeenCalledWith(
      {
        runId: 'run-1',
        forwardedProps: { tenant: 'acme' },
      },
      subscriber
    );
    expect(result.message).toEqual({
      id: 'msg-1',
      role: 'user',
      content: 'hello runtime',
    });
  });

  it('executeAgUiRuntimeRun resume resolved adds summary message', async () => {
    const agent = {
      addMessage: jest.fn(),
      runAgent: jest.fn().mockResolvedValue(undefined),
    } as any;
    const createRuntimeId = jest
      .fn()
      .mockReturnValueOnce('msg-2')
      .mockReturnValueOnce('run-2');
    const onUserMessage = jest.fn();
    const subscriber = {} as any;
    const resume = [{ type: 'continue' }] as any;

    const result = await executeAgUiRuntimeRun({
      mode: 'resume',
      status: 'resolved',
      summary: 'resolution summary',
      resume,
      agent,
      createRuntimeId,
      metadata: { locale: 'zh-CN' },
      subscriber,
      onUserMessage,
    });

    expect(agent.addMessage).toHaveBeenCalledWith({
      id: 'msg-2',
      role: 'user',
      content: 'resolution summary',
    });
    expect(onUserMessage).toHaveBeenCalledWith({
      id: 'msg-2',
      role: 'user',
      content: 'resolution summary',
    });
    expect(agent.runAgent).toHaveBeenCalledWith(
      {
        runId: 'run-2',
        resume,
        forwardedProps: { locale: 'zh-CN' },
      },
      subscriber
    );
    expect(result.message).toEqual({
      id: 'msg-2',
      role: 'user',
      content: 'resolution summary',
    });
  });

  it('executeAgUiRuntimeRun resume cancelled does not add message', async () => {
    const agent = {
      addMessage: jest.fn(),
      runAgent: jest.fn().mockResolvedValue(undefined),
    } as any;
    const createRuntimeId = jest.fn().mockReturnValue('run-3');
    const onUserMessage = jest.fn();
    const subscriber = {} as any;
    const resume = [{ type: 'cancel' }] as any;

    const result = await executeAgUiRuntimeRun({
      mode: 'resume',
      status: 'cancelled',
      resume,
      agent,
      createRuntimeId,
      metadata: undefined,
      subscriber,
      onUserMessage,
    });

    expect(agent.addMessage).not.toHaveBeenCalled();
    expect(onUserMessage).not.toHaveBeenCalled();
    expect(agent.runAgent).toHaveBeenCalledWith(
      {
        runId: 'run-3',
        resume,
        forwardedProps: {},
      },
      subscriber
    );
    expect(result.message).toBeUndefined();
  });

  it('submitAgUiRuntimePrompt returns prompt message', async () => {
    const agent = {
      addMessage: jest.fn(),
      runAgent: jest.fn().mockResolvedValue(undefined),
    } as any;
    const createRuntimeId = jest
      .fn()
      .mockReturnValueOnce('msg-prompt')
      .mockReturnValueOnce('run-prompt');
    const onPromptMessage = jest.fn();

    const message = await submitAgUiRuntimePrompt({
      agent,
      prompt: 'prompt text',
      createRuntimeId,
      metadata: { channel: 'chat' },
      subscriber: {} as any,
      onPromptMessage,
    });

    expect(message).toEqual({
      id: 'msg-prompt',
      role: 'user',
      content: 'prompt text',
    });
    expect(onPromptMessage).toHaveBeenCalledWith(message);
  });

  it('submitAgUiRuntimeResume forwards resume execution', async () => {
    const agent = {
      addMessage: jest.fn(),
      runAgent: jest.fn().mockResolvedValue(undefined),
    } as any;
    const createRuntimeId = jest
      .fn()
      .mockReturnValueOnce('msg-resume')
      .mockReturnValueOnce('run-resume');
    const onResumeMessage = jest.fn();
    const resume = [{ type: 'continue' }] as any;

    await submitAgUiRuntimeResume({
      agent,
      status: 'resolved',
      resume,
      createRuntimeId,
      metadata: { app: 'web-ext' },
      subscriber: {} as any,
      summary: 'resume summary',
      onResumeMessage,
    });

    expect(agent.addMessage).toHaveBeenCalledWith({
      id: 'msg-resume',
      role: 'user',
      content: 'resume summary',
    });
    expect(onResumeMessage).toHaveBeenCalledWith({
      id: 'msg-resume',
      role: 'user',
      content: 'resume summary',
    });
    expect(agent.runAgent).toHaveBeenCalledWith(
      {
        runId: 'run-resume',
        resume,
        forwardedProps: { app: 'web-ext' },
      },
      expect.any(Object)
    );
  });
});
