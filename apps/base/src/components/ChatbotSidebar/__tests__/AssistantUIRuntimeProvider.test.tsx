import { act, render, screen } from '@testing-library/react';
import React from 'react';
import {
  AssistantUIRuntimeProvider,
  useAssistantToolMetadata,
  useAssistantToolRoutingDebug,
  useAssistantUIRuntime,
  useRegisterAssistantTools,
} from '../AssistantUIRuntimeProvider';
import { AssistantRegisteredToolkit } from '../tools/toolRouting';

const mockUseLocalRuntime = jest.fn(() => ({ kind: 'local-runtime' }));
const mockUseAui = jest.fn(() => ({ kind: 'aui-instance' }));
const mockTools = jest.fn((config: unknown) => ({ kind: 'tools-resource', config }));
const mockFetch = jest.fn();
const mockStartFetchSSE = jest.fn();
const mockEventSourceInstances: MockEventSource[] = [];

class MockEventSource {
  constructor(
    public readonly url: string,
    public readonly init?: {
      body?: Record<string, unknown>;
      signal?: AbortSignal;
      handlers: {
        onEvent: (eventType: string, data: string) => void;
        onConnectionError: () => void;
      };
    },
  ) {
    mockEventSourceInstances.push(this);
    if (init?.signal) {
      if (init.signal.aborted) {
        this.close();
      } else {
        init.signal.addEventListener('abort', this.close, { once: true });
      }
    }
  }

  emit(type: string, data = ''): void {
    this.init?.handlers.onEvent(type, data);
  }

  failConnection(): void {
    this.init?.handlers.onConnectionError();
  }

  close = jest.fn(() => {
    return;
  });
}

function parseEventSourceUrl(url: string): URL {
  return new URL(url, 'http://localhost');
}

function parseStreamRequestBody(instance: MockEventSource): Record<string, unknown> {
  const rawBody = instance.init?.body;
  if (!rawBody || typeof rawBody !== 'object') {
    throw new Error('Expected stream request body to be an object');
  }

  return rawBody;
}

type MinimalThreadMessage = {
  role: 'user' | 'assistant';
  content: Array<{ type: 'text'; text: string }>;
};

type CapturedChatModelAdapter = {
  run: (options: {
    messages: MinimalThreadMessage[];
    abortSignal: AbortSignal;
    unstable_getMessage?: () => unknown;
  }) => AsyncGenerator<unknown, void, unknown>;
};

function getCapturedChatModelAdapter(): CapturedChatModelAdapter {
  const adapter = mockUseLocalRuntime.mock.calls[0]?.[0];

  if (!adapter || typeof adapter !== 'object' || !('run' in adapter)) {
    throw new Error('Chat model adapter was not captured');
  }

  return adapter as CapturedChatModelAdapter;
}

function createUserThreadMessage(text: string): MinimalThreadMessage {
  return {
    role: 'user',
    content: [{ type: 'text', text }],
  };
}

function startChatRun(messages: MinimalThreadMessage[]): AsyncGenerator<unknown, void, unknown> {
  const run = getCapturedChatModelAdapter().run({
    messages,
    abortSignal: new AbortController().signal,
  });

  void run.next();
  return run;
}

Object.defineProperty(global, 'fetch', {
  writable: true,
  value: mockFetch,
});

jest.mock('../adapters/fetchSSE', () => ({
  startFetchSSE: (options: {
    url: string;
    body: Record<string, unknown>;
    signal?: AbortSignal;
    handlers: {
      onEvent: (eventType: string, data: string) => void;
      onConnectionError: () => void;
    };
  }) => {
    const session = new MockEventSource(options.url, options);
    mockStartFetchSSE(options);
    return {
      close: session.close,
      completed: Promise.resolve(),
    };
  },
}));

jest.mock('@assistant-ui/react', () => {
  const React = jest.requireActual('react');

  return {
    AssistantRuntimeProvider: ({
      children,
      runtime,
      aui,
    }: {
      children: React.ReactNode;
      runtime: unknown;
      aui: unknown;
    }) => (
      <div
        data-testid="assistant-runtime-provider"
        data-runtime={JSON.stringify(runtime)}
        data-aui={JSON.stringify(aui)}
      >
        {children}
      </div>
    ),
    useLocalRuntime: (adapter: unknown, options?: unknown) => mockUseLocalRuntime(adapter, options),
    useAui: (config?: unknown) => mockUseAui(config),
    Tools: (config: unknown) => mockTools(config),
  };
});

describe('AssistantUIRuntimeProvider', () => {
  beforeEach(() => {
    mockUseLocalRuntime.mockClear();
    mockUseAui.mockClear();
    mockTools.mockClear();
    mockFetch.mockReset();
    mockStartFetchSSE.mockReset();
    mockEventSourceInstances.length = 0;
  });

  it('creates a local runtime and registers the centralized frontend toolkit with assistant-ui tools', () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    expect(mockUseLocalRuntime).toHaveBeenCalledTimes(1);
    expect(mockUseAui).toHaveBeenCalledTimes(1);
    expect(mockTools).toHaveBeenCalledTimes(1);
    expect(mockUseLocalRuntime.mock.calls[0]?.[1]).toMatchObject({
      unstable_humanToolNames: expect.arrayContaining([
        'process_fdc3_intent',
        'report_workspace_status',
      ]),
    });

    expect(mockTools.mock.calls[0]?.[0]).toMatchObject({
      toolkit: expect.any(Object),
    });
    expect(mockTools.mock.calls[0]?.[0]).toMatchObject({
      toolkit: expect.objectContaining({
        calculator: expect.any(Object),
        get_weather: expect.any(Object),
      }),
    });

    const provider = screen.getByTestId('assistant-runtime-provider');
    expect(provider.dataset.runtime).toContain('local-runtime');
    expect(provider.dataset.aui).toContain('aui-instance');
  });

  it('merges hook-registered tools into the effective toolkit', () => {
    const customToolkit: AssistantRegisteredToolkit = {
      custom_client_tool: {
        type: 'frontend',
        description: 'Custom tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ ok: true }),
      },
    };

    const RegisterTools = () => {
      useRegisterAssistantTools(customToolkit);
      return null;
    };

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <RegisterTools />
      </AssistantUIRuntimeProvider>,
    );

    expect(mockTools).toHaveBeenCalled();
    expect(mockTools.mock.calls.at(-1)?.[0]).toMatchObject({
      toolkit: expect.objectContaining({
        summarize_workspace_state: expect.any(Object),
        process_fdc3_intent: expect.any(Object),
        custom_client_tool: expect.any(Object),
      }),
    });
  });

  it('throws when active registrations define the same tool name', () => {
    const duplicateToolkit: AssistantRegisteredToolkit = {
      summarize_workspace_state: {
        type: 'frontend',
        description: 'Duplicate workspace summary tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ duplicate: true }),
      },
    };

    const RegisterDuplicate = () => {
      useRegisterAssistantTools(duplicateToolkit);
      return null;
    };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      render(
        <AssistantUIRuntimeProvider apiUrl="/api/chat">
          <RegisterDuplicate />
        </AssistantUIRuntimeProvider>,
      ),
    ).toThrow('Duplicate assistant tool registration: summarize_workspace_state');

    consoleSpy.mockRestore();
  });

  it('does not put streaming inputs into the SSE query string', async () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    const abortController = new AbortController();
    const run = getCapturedChatModelAdapter().run({
      messages: [createUserThreadMessage('Hello from the user')],
      abortSignal: abortController.signal,
    });
    void run.next();
    await Promise.resolve();

    expect(mockStartFetchSSE).toHaveBeenCalledTimes(1);
    expect(mockEventSourceInstances).toHaveLength(1);

    const streamUrl = parseEventSourceUrl(mockEventSourceInstances[0].url);
    const requestBody = parseStreamRequestBody(mockEventSourceInstances[0]);

    expect(streamUrl.pathname).toBe('/api/chat/stream');
    expect(streamUrl.searchParams.has('message')).toBe(false);
    expect(streamUrl.searchParams.has('toolContext')).toBe(false);
    expect(streamUrl.searchParams.has('frontendTools')).toBe(false);
    expect(requestBody).toMatchObject({
      message: 'Hello from the user',
    });

    abortController.abort();
  });

  it('starts a fresh thread without reusing the previous backend conversation id', async () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    const firstAbortController = new AbortController();
    const firstRun = getCapturedChatModelAdapter().run({
      messages: [createUserThreadMessage('Thread A')],
      abortSignal: firstAbortController.signal,
      unstable_threadId: 'thread-a',
    });
    void firstRun.next();
    await Promise.resolve();
    expect(mockEventSourceInstances).toHaveLength(1);

    mockEventSourceInstances[0].emit('conversation_id', 'conversation-a');
    mockEventSourceInstances[0].emit('done');

    const secondAbortController = new AbortController();
    const secondRun = getCapturedChatModelAdapter().run({
      messages: [createUserThreadMessage('Thread B')],
      abortSignal: secondAbortController.signal,
      unstable_threadId: 'thread-b',
    });
    void secondRun.next();
    await Promise.resolve();
    expect(mockEventSourceInstances).toHaveLength(2);

    const secondRequestBody = parseStreamRequestBody(mockEventSourceInstances[1]);

    expect(secondRequestBody.conversationId).toBeUndefined();

    secondAbortController.abort();
  });

  it('exposes the local runtime value through context', () => {
    const Probe = () => {
      const runtime = useAssistantUIRuntime();
      return <div data-testid="runtime-probe">{JSON.stringify(runtime)}</div>;
    };

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <Probe />
      </AssistantUIRuntimeProvider>,
    );

    expect(screen.getByTestId('runtime-probe')).toHaveTextContent('"apiUrl":"/api/chat"');
    expect(screen.getByTestId('runtime-probe')).toHaveTextContent('"hasToolkit":true');
    expect(screen.getByTestId('runtime-probe')).toHaveTextContent('"toolNames"');
    expect(screen.getByTestId('runtime-probe')).toHaveTextContent('"summarize_workspace_state"');
  });

  it('exposes tool metadata for registered tools through context', () => {
    const customToolkit: AssistantRegisteredToolkit = {
      custom_client_tool: {
        type: 'frontend',
        description: 'Custom tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ ok: true }),
        matchPriority: 25,
        matchPrompt: (input: string) =>
          input.includes('custom route')
            ? {
                args: { source: 'custom' },
                confidence: 0.6,
              }
            : null,
      },
    };

    const Probe = () => {
      const runtime = useAssistantUIRuntime();
      return <div data-testid="tool-metadata-probe">{JSON.stringify(runtime)}</div>;
    };

    const RegisterTools = () => {
      useRegisterAssistantTools(customToolkit);
      return null;
    };

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <RegisterTools />
        <Probe />
      </AssistantUIRuntimeProvider>,
    );

    expect(screen.getByTestId('tool-metadata-probe')).toHaveTextContent('"custom_client_tool"');
    expect(screen.getByTestId('tool-metadata-probe')).toHaveTextContent('"matchPriority":25');
    expect(screen.getByTestId('tool-metadata-probe')).toHaveTextContent('"hasPromptMatcher":true');
    expect(screen.getByTestId('tool-metadata-probe')).toHaveTextContent('"humanInTheLoop":true');
  });

  it('exposes tool metadata through a dedicated hook', () => {
    const customToolkit: AssistantRegisteredToolkit = {
      custom_client_tool: {
        type: 'frontend',
        description: 'Custom tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ ok: true }),
        matchPriority: 12,
        matchPrompt: (input: string) => (input.includes('hook route') ? {} : null),
      },
    };

    const RegisterTools = () => {
      useRegisterAssistantTools(customToolkit);
      return null;
    };

    const Probe = () => {
      const toolMetadata = useAssistantToolMetadata();
      return <div data-testid="tool-metadata-hook">{JSON.stringify(toolMetadata)}</div>;
    };

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <RegisterTools />
        <Probe />
      </AssistantUIRuntimeProvider>,
    );

    expect(screen.getByTestId('tool-metadata-hook')).toHaveTextContent('"custom_client_tool"');
    expect(screen.getByTestId('tool-metadata-hook')).toHaveTextContent('"matchPriority":12');
  });

  it('keeps the route debug hook empty during backend-driven frontend tool routing', async () => {
    const customToolkit: AssistantRegisteredToolkit = {
      custom_client_tool: {
        type: 'frontend',
        description: 'Custom tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ ok: true }),
        matchPriority: 55,
        matchPrompt: (input: string) =>
          input.includes('debug route')
            ? {
                args: { source: 'debug' },
                confidence: 0.85,
              }
            : null,
      },
    };

    const RegisterTools = () => {
      useRegisterAssistantTools(customToolkit);
      return null;
    };

    const Probe = () => {
      const lastToolRoute = useAssistantToolRoutingDebug();
      return <div data-testid="tool-route-hook">{JSON.stringify(lastToolRoute)}</div>;
    };

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <RegisterTools />
        <Probe />
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user';
          content: Array<{ type: 'text'; text: string }>;
        }>;
      }) => AsyncGenerator<unknown>;
    };

    await act(async () => {
      const stream = adapter.run({
        messages: [
          {
            id: 'msg-debug',
            role: 'user',
            content: [{ type: 'text', text: 'please run the debug route flow' }],
          },
        ],
        abortSignal: new AbortController().signal,
      });

      const firstYield = stream.next();
      expect(mockEventSourceInstances.length).toBe(1);
      mockEventSourceInstances[0]?.emit('message', 'Backend response');
      mockEventSourceInstances[0]?.emit('done');
      await firstYield;
    });

    expect(screen.getByTestId('tool-route-hook')).toHaveTextContent('null');
  });

  it('routes the declaration-backed FDC3 intent tool locally before hitting the backend', async () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user';
          content: Array<{ type: 'text'; text: string }>;
        }>;
        abortSignal?: AbortSignal;
      }) => AsyncGenerator<{
        content?: Array<{
          type: string;
          toolName?: string;
          executionTarget?: string;
        }>;
        status?: {
          type: string;
          reason?: string;
        };
      }>;
    };

    const stream = adapter.run({
      messages: [
        {
          id: 'msg-fdc3',
          role: 'user',
          content: [{ type: 'text', text: 'I want to view chart' }],
        },
      ],
      abortSignal: new AbortController().signal,
    });

    const firstYield = await stream.next();

    expect(firstYield.value).toMatchObject({
      content: [
        {
          type: 'tool-call',
          toolName: 'process_fdc3_intent',
        },
      ],
      status: {
        type: 'requires-action',
        reason: 'tool-calls',
      },
    });
    expect(mockEventSourceInstances.length).toBe(0);
  });

  it('routes the workspace status tool locally before hitting the backend', async () => {
    render(
      <AssistantUIRuntimeProvider
        apiUrl="/api/chat"
        toolRegistryConfig={{
          getWorkspaceSnapshot: () => ({
            activeWorkspaceId: 'workspace-1',
            activeWorkspaceLabel: 'Workspace 1',
            activeTileTitle: 'Tile A',
            totalWorkspaces: 1,
            totalTiles: 1,
            workspaces: [
              {
                id: 'workspace-1',
                label: 'Workspace 1',
                tileCount: 1,
                isActive: true,
              },
            ],
          }),
          closeAllTiles: async () => ({
            activeWorkspaceId: 'workspace-1',
            activeWorkspaceLabel: 'Workspace 1',
            activeTileTitle: null,
            totalWorkspaces: 1,
            totalTiles: 0,
            workspaces: [
              {
                id: 'workspace-1',
                label: 'Workspace 1',
                tileCount: 0,
                isActive: true,
              },
            ],
            actionMessage: 'Closed all tiles across 1 workspace.',
          }),
        }}
      >
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user';
          content: Array<{ type: 'text'; text: string }>;
        }>;
        abortSignal?: AbortSignal;
      }) => AsyncGenerator<{
        content?: Array<{
          type: string;
          toolName?: string;
        }>;
        status?: {
          type: string;
          reason?: string;
        };
      }>;
    };

    const stream = adapter.run({
      messages: [
        {
          id: 'msg-workspace-status',
          role: 'user',
          content: [{ type: 'text', text: 'workspace status' }],
        },
      ],
      abortSignal: new AbortController().signal,
    });

    const firstYield = await stream.next();

    expect(firstYield.value).toMatchObject({
      content: [
        {
          type: 'tool-call',
          toolName: 'report_workspace_status',
        },
      ],
      status: {
        type: 'requires-action',
        reason: 'tool-calls',
      },
    });
    expect(mockEventSourceInstances.length).toBe(0);
  });

  it('sends the current frontend tool manifest to the backend instead of executing prompt-matched tools locally', async () => {
    const routedExecute = jest.fn(async () => ({ routed: true }));
    const customToolkit: AssistantRegisteredToolkit = {
      custom_client_tool: {
        type: 'frontend',
        description: 'Custom tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: routedExecute,
        matchPrompt: (input: string) => (input.includes('run custom tool') ? {} : null),
      },
    };

    const RegisterTools = () => {
      useRegisterAssistantTools(customToolkit);
      return null;
    };

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <RegisterTools />
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user';
          content: Array<{ type: 'text'; text: string }>;
        }>;
      }) => AsyncGenerator<{
        content: Array<{
          type: string;
          toolName?: string;
          result?: unknown;
        }>;
        status?: {
          type: string;
          reason?: string;
        };
      }>;
    };

    let firstResult;
    let secondResult;
    await act(async () => {
      const stream = adapter.run({
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: [{ type: 'text', text: 'please run custom tool now' }],
          },
        ],
        abortSignal: new AbortController().signal,
      });

      firstResult = stream.next();
      secondResult = stream.next();
    });

    expect(routedExecute).not.toHaveBeenCalled();
    expect(mockEventSourceInstances.length).toBe(1);
    const initialRequestBody = parseStreamRequestBody(mockEventSourceInstances[0]!);
    expect(initialRequestBody.message).toBe('please run custom tool now');
    expect(initialRequestBody.toolContext).toBeUndefined();
    expect(initialRequestBody.frontendTools).toEqual(
      expect.stringContaining('"name":"custom_client_tool"'),
    );
    expect(initialRequestBody.frontendTools).toEqual(
      expect.stringContaining('"name":"process_fdc3_intent"'),
    );
    expect(mockStartFetchSSE).toHaveBeenCalled();

    mockEventSourceInstances[0]?.emit('message', 'Backend response');
    mockEventSourceInstances[0]?.emit('done');

    await expect(firstResult).resolves.toMatchObject({
      value: {
        content: [{ type: 'text', text: 'Backend response' }],
      },
      done: false,
    });
    await expect(secondResult).resolves.toMatchObject({
      value: {
        status: { type: 'complete', reason: 'stop' },
      },
      done: false,
    });
  });

  it('executes backend-requested frontend tools locally and continues the conversation with tool context', async () => {
    const routedExecute = jest.fn(async () => ({ routed: true }));
    const customToolkit: AssistantRegisteredToolkit = {
      custom_client_tool: {
        type: 'frontend',
        description: 'Custom tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: routedExecute,
      },
    };

    const RegisterTools = () => {
      useRegisterAssistantTools(customToolkit);
      return null;
    };

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <RegisterTools />
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user';
          content: Array<{ type: 'text'; text: string }>;
        }>;
        abortSignal?: AbortSignal;
      }) => AsyncGenerator<{
        content?: Array<{
          type: string;
          toolName?: string;
          result?: unknown;
          text?: string;
        }>;
        status?: {
          type: string;
          reason?: string;
        };
      }>;
    };

    const stream = adapter.run({
      messages: [
        {
          id: 'msg-frontend-tool',
          role: 'user',
          content: [{ type: 'text', text: 'please use the frontend tool' }],
        },
      ],
      abortSignal: new AbortController().signal,
    });

    let firstYieldPromise: Promise<
      IteratorResult<{
        content?: Array<{ type: string; toolName?: string; result?: unknown; text?: string }>;
        status?: { type: string; reason?: string };
      }>
    >;

    await act(async () => {
      firstYieldPromise = stream.next();
    });

    expect(mockEventSourceInstances.length).toBe(1);

    await act(async () => {
      mockEventSourceInstances[0]?.emit(
        'tool_call',
        JSON.stringify({
          id: 'frontend-tool-1',
          name: 'custom_client_tool',
          arguments: { query: 'workspace' },
          status: 'RUNNING',
          executionTarget: 'FRONTEND',
        }),
      );
      mockEventSourceInstances[0]?.emit('done');
    });

    const firstYield = await firstYieldPromise!;
    expect(firstYield.done).toBe(false);
    expect(firstYield.value.status).toMatchObject({
      type: 'requires-action',
      reason: 'tool-calls',
    });
    expect(firstYield.value.content).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'text',
          text: 'Checking with custom client tool...',
        }),
        expect.objectContaining({
          type: 'tool-call',
          toolName: 'custom_client_tool',
        }),
      ]),
    );

    const secondYield = await stream.next();
    expect(secondYield.done).toBe(false);
    expect(routedExecute).toHaveBeenCalledWith({ query: 'workspace' }, expect.any(Object));
    expect(secondYield.value.content).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'text',
          text: 'Checking with custom client tool...',
        }),
        expect.objectContaining({
          type: 'tool-call',
          toolName: 'custom_client_tool',
          result: { routed: true },
        }),
      ]),
    );

    expect(mockEventSourceInstances.length).toBe(2);
    const continuationRequestBody = parseStreamRequestBody(mockEventSourceInstances[1]!);
    expect(continuationRequestBody.toolContext).toEqual(
      expect.stringContaining('"toolName":"custom_client_tool"'),
    );
    expect(continuationRequestBody.toolContext).toEqual(
      expect.stringContaining('"routed":true'),
    );
    expect(continuationRequestBody.frontendTools).toBeUndefined();

    await act(async () => {
      mockEventSourceInstances[1]?.emit('message', 'The frontend tool completed.');
      mockEventSourceInstances[1]?.emit('done');
    });

    const thirdYield = await stream.next();
    expect(thirdYield.done).toBe(false);
    expect(thirdYield.value.content).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'tool-call',
          toolName: 'custom_client_tool',
          result: { routed: true },
        }),
        expect.objectContaining({
          type: 'text',
          text: 'The frontend tool completed.',
        }),
      ]),
    );
  });

  it('pauses human-in-the-loop tools for explicit approval instead of auto-executing them', async () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user';
          content: Array<{ type: 'text'; text: string }>;
        }>;
      }) => AsyncGenerator<{
        content: Array<{
          type: string;
          toolName?: string;
          args?: Record<string, unknown>;
        }>;
        status?: {
          type: string;
          reason?: string;
        };
      }>;
    };

    let firstResult;
    let secondResult;
    await act(async () => {
      const stream = adapter.run({
        messages: [
          {
            id: 'msg-hitl',
            role: 'user',
            content: [{ type: 'text', text: 'please process an fdc3 intent' }],
          },
        ],
        abortSignal: new AbortController().signal,
      });

      firstResult = stream.next();
      secondResult = stream.next();
    });

    expect(mockEventSourceInstances).toHaveLength(1);
    const requestBody = parseStreamRequestBody(mockEventSourceInstances[0]!);
    expect(requestBody.frontendTools).toEqual(
      expect.stringContaining('"name":"process_fdc3_intent"'),
    );
    expect(requestBody.frontendTools).toEqual(
      expect.stringContaining('"humanInTheLoop":true'),
    );

    mockEventSourceInstances[0]?.emit('message', 'Backend approval step');
    mockEventSourceInstances[0]?.emit('done');

    await expect(firstResult).resolves.toMatchObject({
      value: {
        content: [{ type: 'text', text: 'Backend approval step' }],
      },
      done: false,
    });
    await expect(secondResult).resolves.toMatchObject({
      value: {
        status: { type: 'complete', reason: 'stop' },
      },
      done: false,
    });
  });

  it('sends all matching frontend tools in the manifest instead of resolving one locally by priority', async () => {
    const lowerPriorityExecute = jest.fn(async () => ({ source: 'lower' }));
    const higherPriorityExecute = jest.fn(async () => ({ source: 'higher' }));
    const customToolkit: AssistantRegisteredToolkit = {
      lower_priority_tool: {
        type: 'frontend',
        description: 'Lower priority tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: lowerPriorityExecute,
        matchPriority: 10,
        matchPrompt: (input: string) => (input.includes('shared match') ? {} : null),
      },
      higher_priority_tool: {
        type: 'frontend',
        description: 'Higher priority tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: higherPriorityExecute,
        matchPriority: 100,
        matchPrompt: (input: string) => (input.includes('shared match') ? {} : null),
      },
    };

    const RegisterTools = () => {
      useRegisterAssistantTools(customToolkit);
      return null;
    };

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <RegisterTools />
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user';
          content: Array<{ type: 'text'; text: string }>;
        }>;
      }) => AsyncGenerator<{
        content: Array<{
          type: string;
          toolName?: string;
          result?: unknown;
        }>;
        status?: {
          type: string;
          reason?: string;
        };
      }>;
    };

    let firstResult;
    let finalResult;
    await act(async () => {
      const stream = adapter.run({
        messages: [
          {
            id: 'msg-priority',
            role: 'user',
            content: [{ type: 'text', text: 'please use the shared match flow' }],
          },
        ],
        abortSignal: new AbortController().signal,
      });

      firstResult = stream.next();
      finalResult = stream.next();
    });

    expect(lowerPriorityExecute).not.toHaveBeenCalled();
    expect(higherPriorityExecute).not.toHaveBeenCalled();
    expect(mockEventSourceInstances.length).toBe(1);
    const requestBody = parseStreamRequestBody(mockEventSourceInstances[0]!);
    expect(requestBody.frontendTools).toEqual(
      expect.stringContaining('"name":"lower_priority_tool"'),
    );
    expect(requestBody.frontendTools).toEqual(
      expect.stringContaining('"name":"higher_priority_tool"'),
    );

    mockEventSourceInstances[0]?.emit('message', 'Backend chose a tool');
    mockEventSourceInstances[0]?.emit('done');

    await expect(firstResult).resolves.toMatchObject({
      value: {
        content: [{ type: 'text', text: 'Backend chose a tool' }],
      },
      done: false,
    });
    await expect(finalResult).resolves.toMatchObject({
      value: {
        status: { type: 'complete', reason: 'stop' },
      },
      done: false,
    });
  });

  it('sends all equal-priority frontend tools in the manifest instead of resolving by confidence locally', async () => {
    const lowerConfidenceExecute = jest.fn(async () => ({ source: 'lower' }));
    const higherConfidenceExecute = jest.fn(async () => ({ source: 'higher' }));
    const customToolkit: AssistantRegisteredToolkit = {
      lower_confidence_tool: {
        type: 'frontend',
        description: 'Lower confidence tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: lowerConfidenceExecute,
        matchPriority: 50,
        matchPrompt: (input: string) =>
          input.includes('confidence request')
            ? {
                args: { source: 'lower' },
                confidence: 0.25,
              }
            : null,
      },
      higher_confidence_tool: {
        type: 'frontend',
        description: 'Higher confidence tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: higherConfidenceExecute,
        matchPriority: 50,
        matchPrompt: (input: string) =>
          input.includes('confidence request')
            ? {
                args: { source: 'higher' },
                confidence: 0.9,
              }
            : null,
      },
    };

    const RegisterTools = () => {
      useRegisterAssistantTools(customToolkit);
      return null;
    };

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <RegisterTools />
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user';
          content: Array<{ type: 'text'; text: string }>;
        }>;
      }) => AsyncGenerator<{
        content: Array<{
          type: string;
          toolName?: string;
          result?: unknown;
        }>;
        status?: {
          type: string;
          reason?: string;
        };
      }>;
    };

    let firstResult;
    let finalResult;
    await act(async () => {
      const stream = adapter.run({
        messages: [
          {
            id: 'msg-confidence',
            role: 'user',
            content: [{ type: 'text', text: 'please handle this confidence request' }],
          },
        ],
        abortSignal: new AbortController().signal,
      });

      firstResult = stream.next();
      finalResult = stream.next();
    });

    expect(lowerConfidenceExecute).not.toHaveBeenCalled();
    expect(higherConfidenceExecute).not.toHaveBeenCalled();
    expect(mockEventSourceInstances.length).toBe(1);
    const requestBody = parseStreamRequestBody(mockEventSourceInstances[0]!);
    expect(requestBody.frontendTools).toEqual(
      expect.stringContaining('"name":"lower_confidence_tool"'),
    );
    expect(requestBody.frontendTools).toEqual(
      expect.stringContaining('"name":"higher_confidence_tool"'),
    );

    mockEventSourceInstances[0]?.emit('message', 'Backend kept control');
    mockEventSourceInstances[0]?.emit('done');

    await expect(firstResult).resolves.toMatchObject({
      value: {
        content: [{ type: 'text', text: 'Backend kept control' }],
      },
      done: false,
    });
    await expect(finalResult).resolves.toMatchObject({
      value: {
        status: { type: 'complete', reason: 'stop' },
      },
      done: false,
    });
  });

  it('streams backend responses through an async generator when no tool prompt matcher matches', async () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user';
          content: Array<{ type: 'text'; text: string }>;
        }>;
        abortSignal?: AbortSignal;
      }) => AsyncGenerator<{
        content?: Array<{
          type: string;
          text?: string;
          toolName?: string;
          result?: unknown;
          name?: string;
          data?: unknown;
        }>;
        status?: {
          type: string;
          reason?: string;
        };
      }>;
    };

    const stream = adapter.run({
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: [{ type: 'text', text: 'plain backend prompt' }],
        },
      ],
      abortSignal: new AbortController().signal,
    });

    expect(typeof stream[Symbol.asyncIterator]).toBe('function');
    const firstYieldPromise = stream.next();
    const secondYieldPromise = stream.next();
    const thirdYieldPromise = stream.next();
    const fourthYieldPromise = stream.next();
    const doneYieldPromise = stream.next();

    expect(mockEventSourceInstances).toHaveLength(1);
    expect(mockEventSourceInstances[0]?.url).toContain('/api/chat/stream');
    expect(parseStreamRequestBody(mockEventSourceInstances[0]!)).toMatchObject({
      message: 'plain backend prompt',
    });

    act(() => {
      mockEventSourceInstances[0]?.emit('conversation_id', 'conversation-1');
      mockEventSourceInstances[0]?.emit('message', 'backend ');
      mockEventSourceInstances[0]?.emit('message', 'reply');
      mockEventSourceInstances[0]?.emit(
        'tool_call',
        JSON.stringify({
          id: 'tool-call-1',
          name: 'backend_tool',
          arguments: { source: 'backend' },
          status: 'running',
        }),
      );
      mockEventSourceInstances[0]?.emit(
        'tool_result',
        JSON.stringify({
          toolCallId: 'tool-call-1',
          result: { ok: true },
        }),
      );
      mockEventSourceInstances[0]?.emit(
        'generative_ui',
        JSON.stringify({
          name: 'ChartCard',
          props: { title: 'Revenue' },
        }),
      );
      mockEventSourceInstances[0]?.emit('message', ' with details');
      mockEventSourceInstances[0]?.emit('done');
    });

    await expect(firstYieldPromise).resolves.toMatchObject({
      value: {
        content: [{ type: 'text', text: 'backend ' }],
      },
      done: false,
    });
    await expect(secondYieldPromise).resolves.toMatchObject({
      value: {
        content: [{ type: 'text', text: 'backend reply' }],
      },
      done: false,
    });
    await expect(thirdYieldPromise).resolves.toMatchObject({
      value: {
        content: [
          { type: 'text', text: 'backend reply' },
          { type: 'tool-call', toolName: 'backend_tool', result: { ok: true } },
          {
            type: 'data',
            name: 'generative-ui',
            data: {
              componentName: 'ChartCard',
              props: { title: 'Revenue' },
            },
          },
          { type: 'text', text: ' with details' },
        ],
      },
      done: false,
    });
    await expect(fourthYieldPromise).resolves.toMatchObject({
      value: {
        status: {
          type: 'complete',
          reason: 'stop',
        },
      },
      done: false,
    });
    await expect(doneYieldPromise).resolves.toMatchObject({
      value: undefined,
      done: true,
    });
  });

  it('does not surface a connection error after the stream has already completed', async () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user';
          content: Array<{ type: 'text'; text: string }>;
        }>;
        abortSignal?: AbortSignal;
      }) => AsyncGenerator<{
        content?: Array<{
          type: string;
          text?: string;
        }>;
        status?: {
          type: string;
          reason?: string;
        };
      }>;
    };

    const stream = adapter.run({
      messages: [
        {
          id: 'msg-stream-complete',
          role: 'user',
          content: [{ type: 'text', text: 'plain backend prompt' }],
        },
      ],
      abortSignal: new AbortController().signal,
    });

    const firstYieldPromise = stream.next();
    const secondYieldPromise = stream.next();
    const doneYieldPromise = stream.next();

    expect(mockEventSourceInstances).toHaveLength(1);

    act(() => {
      mockEventSourceInstances[0]?.emit('message', 'backend reply');
      mockEventSourceInstances[0]?.emit('done');
      mockEventSourceInstances[0]?.failConnection();
    });

    await expect(firstYieldPromise).resolves.toMatchObject({
      value: {
        content: [{ type: 'text', text: 'backend reply' }],
      },
      done: false,
    });
    await expect(secondYieldPromise).resolves.toMatchObject({
      value: {
        status: {
          type: 'complete',
          reason: 'stop',
        },
      },
      done: false,
    });
    await expect(doneYieldPromise).resolves.toMatchObject({
      value: undefined,
      done: true,
    });
  });

  it('treats a connection close after streamed assistant text as a completed turn', async () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user';
          content: Array<{ type: 'text'; text: string }>;
        }>;
        abortSignal?: AbortSignal;
      }) => AsyncGenerator<{
        content?: Array<{
          type: string;
          text?: string;
        }>;
        status?: {
          type: string;
          reason?: string;
        };
      }>;
    };

    const stream = adapter.run({
      messages: [
        {
          id: 'msg-stream-close-after-text',
          role: 'user',
          content: [{ type: 'text', text: 'hi' }],
        },
      ],
      abortSignal: new AbortController().signal,
    });

    const firstYieldPromise = stream.next();
    const secondYieldPromise = stream.next();
    const doneYieldPromise = stream.next();

    expect(mockEventSourceInstances).toHaveLength(1);

    act(() => {
      mockEventSourceInstances[0]?.emit('message', 'Hello there');
      mockEventSourceInstances[0]?.failConnection();
    });

    await expect(firstYieldPromise).resolves.toMatchObject({
      value: {
        content: [{ type: 'text', text: 'Hello there' }],
      },
      done: false,
    });
    await expect(secondYieldPromise).resolves.toMatchObject({
      value: {
        content: [{ type: 'text', text: 'Hello there' }],
        status: {
          type: 'complete',
          reason: 'stop',
        },
      },
      done: false,
    });
    await expect(doneYieldPromise).resolves.toMatchObject({
      value: undefined,
      done: true,
    });
  });

  it('completes the local tool roundtrip by continuing to backend for AI analysis (ReAct)', async () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user' | 'assistant' | 'tool';
          content: Array<
            | { type: 'text'; text: string }
            | {
                type: 'tool-call';
                toolCallId: string;
                toolName: string;
                args: Record<string, unknown>;
                executionTarget?: 'frontend' | 'backend';
              }
            | {
                type: 'tool-result';
                toolCallId: string;
                result: unknown;
                isError?: boolean;
              }
          >;
        }>;
        abortSignal?: AbortSignal;
      }) => AsyncGenerator<{
        content?: Array<{
          type: string;
          text?: string;
        }>;
        status?: {
          type: string;
          reason?: string;
        };
      }>;
    };

    const stream = adapter.run({
      messages: [
        {
          id: 'user-msg-1',
          role: 'user',
          content: [{ type: 'text', text: 'summarize my workspace' }],
        },
        {
          id: 'assistant-msg-1',
          role: 'assistant',
          content: [
            {
              type: 'tool-call',
              toolCallId: 'tool-call-1',
              toolName: 'summarize_workspace_state',
              args: { scope: 'active' },
              executionTarget: 'frontend',
            },
          ],
        },
        {
          id: 'tool-msg-1',
          role: 'tool',
          content: [
            {
              type: 'tool-result',
              toolCallId: 'tool-call-1',
              result: { ok: true },
            },
          ],
        },
      ],
      abortSignal: new AbortController().signal,
    });

    // ReAct pattern: Tool roundtrip continues to backend for AI analysis
    const firstYieldPromise = stream.next();

    // Backend should be called with tool context
    expect(mockEventSourceInstances.length).toBe(1);
    const continuationRequestBody = parseStreamRequestBody(mockEventSourceInstances[0]!);
    expect(continuationRequestBody.message).toBe('summarize my workspace');
    expect(continuationRequestBody.toolContext).toEqual(
      expect.stringContaining('"toolCallId":"tool-call-1"'),
    );
    expect(continuationRequestBody.toolContext).toEqual(
      expect.stringContaining('"originalUserMessage":"summarize my workspace"'),
    );
    expect(continuationRequestBody.toolContext).toEqual(
      expect.stringContaining('"toolName":"summarize_workspace_state"'),
    );

    // Simulate backend response
    mockEventSourceInstances[0]?.emit('conversation_id', 'conv-123');
    mockEventSourceInstances[0]?.emit('message', 'The tool executed successfully.');
    mockEventSourceInstances[0]?.emit('done');

    const firstYield = await firstYieldPromise;
    expect(firstYield.done).toBe(false);
    expect(firstYield.value.content).toHaveLength(1);
    expect(firstYield.value.content[0]).toMatchObject({
      type: 'text',
      text: 'The tool executed successfully.',
    });

    // Final status
    const secondYield = await stream.next();
    expect(secondYield.done).toBe(false);
    expect(secondYield.value.status).toMatchObject({
      type: 'complete',
      reason: 'stop',
    });

    // Generator completes
    const thirdYield = await stream.next();
    expect(thirdYield.done).toBe(true);
  });

  it('continues HITL tool approvals when assistant-ui reruns with a completed assistant tool-call part', async () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user' | 'assistant';
          content: Array<
            | { type: 'text'; text: string }
            | {
                type: 'tool-call';
                toolCallId: string;
                toolName: string;
                args: Record<string, unknown>;
                executionTarget?: 'frontend' | 'backend';
                result?: unknown;
              }
          >;
        }>;
        abortSignal?: AbortSignal;
        unstable_getMessage?: () => {
          id: string;
          role: 'assistant';
          content: Array<{
            type: 'tool-call';
            toolCallId: string;
            toolName: string;
            args: Record<string, unknown>;
            executionTarget?: 'frontend' | 'backend';
            result?: unknown;
          }>;
        };
      }) => Promise<
        AsyncGenerator<{
          content?: Array<{
            type: string;
            text?: string;
          }>;
          status?: {
            type: string;
            reason?: string;
          };
        }>
      >;
    };

    const stream = await adapter.run({
      messages: [
        {
          id: 'user-msg-hitl',
          role: 'user',
          content: [{ type: 'text', text: 'please process an fdc3 intent' }],
        },
      ],
      abortSignal: new AbortController().signal,
      unstable_getMessage: () => ({
        id: 'assistant-msg-hitl',
        role: 'assistant',
        content: [
          {
            type: 'tool-call',
            toolCallId: 'tool-hitl-1',
            toolName: 'process_fdc3_intent',
            args: {
              matchedIntent: 'ViewChart',
              targetAppId: 'test.chart',
              targetContexts: ['fdc3.instrument'],
              payload: {
                type: 'fdc3.instrument',
                id: { ticker: 'AAPL' },
              },
              canProcess: true,
              sourcePrompt: 'please process an fdc3 intent',
            },
            executionTarget: 'frontend',
            result: {
              outcome: 'success',
              matchedIntent: 'ViewChart',
              targetAppId: 'test.chart',
              payload: {
                type: 'fdc3.instrument',
                id: { ticker: 'AAPL' },
              },
            },
          },
        ],
      }),
    });

    const firstYieldPromise = stream.next();

    expect(mockEventSourceInstances.length).toBe(1);
    const continuationRequestBody = parseStreamRequestBody(mockEventSourceInstances[0]!);
    expect(continuationRequestBody.message).toBe('please process an fdc3 intent');
    expect(continuationRequestBody.toolContext).toEqual(
      expect.stringContaining('"toolName":"process_fdc3_intent"'),
    );
    expect(continuationRequestBody.toolContext).toEqual(
      expect.stringContaining('"matchedIntent":"ViewChart"'),
    );

    mockEventSourceInstances[0]?.emit('message', 'The announcement was approved.');
    mockEventSourceInstances[0]?.emit('done');

    await expect(firstYieldPromise).resolves.toMatchObject({
      value: {
        content: [{ type: 'text', text: 'The announcement was approved.' }],
      },
      done: false,
    });
  });

  it('does not trigger continuation for completed backend tool-call parts', async () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user' | 'assistant';
          content: Array<
            | { type: 'text'; text: string }
            | {
                type: 'tool-call';
                toolCallId: string;
                toolName: string;
                args: Record<string, unknown>;
                executionTarget?: 'frontend' | 'backend';
                result?: unknown;
              }
          >;
        }>;
        abortSignal?: AbortSignal;
        unstable_getMessage?: () => {
          id: string;
          role: 'assistant';
          content: Array<{
            type: 'tool-call';
            toolCallId: string;
            toolName: string;
            args: Record<string, unknown>;
            executionTarget?: 'frontend' | 'backend';
            result?: unknown;
          }>;
        };
      }) => Promise<
        | {
            content?: Array<{ type: string; text?: string }>;
            status?: {
              type: string;
              reason?: string;
            };
          }
        | AsyncGenerator<{
            content?: Array<{ type: string; text?: string }>;
            status?: {
              type: string;
              reason?: string;
            };
          }>
      >;
    };

    const stream = await adapter.run({
      messages: [
        {
          id: 'user-msg-weather',
          role: 'user',
          content: [{ type: 'text', text: 'weather in shanghai' }],
        },
      ],
      abortSignal: new AbortController().signal,
      unstable_getMessage: () => ({
        id: 'assistant-msg-weather',
        role: 'assistant',
        content: [
          {
            type: 'tool-call',
            toolCallId: 'tool-weather-1',
            toolName: 'get_weather',
            args: { location: 'Shanghai' },
            executionTarget: 'backend',
            result: { location: 'Shanghai', temperature: 22 },
          },
        ],
      }),
    });

    expect(mockEventSourceInstances).toHaveLength(0);

    const nextPromise = stream.next();

    expect(mockEventSourceInstances).toHaveLength(1);
    const continuationRequestBody = parseStreamRequestBody(mockEventSourceInstances[0]!);
    expect(continuationRequestBody.message).toBe('weather in shanghai');
    expect(continuationRequestBody.toolContext).toBeUndefined();

    act(() => {
      mockEventSourceInstances[0]?.emit('message', 'Fresh backend response.');
      mockEventSourceInstances[0]?.emit('done');
    });

    await expect(nextPromise).resolves.toMatchObject({
      value: {
        content: [{ type: 'text', text: 'Fresh backend response.' }],
      },
      done: false,
    });
  });

  it('persists the backend conversation id across streamed turns', async () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user';
          content: Array<{ type: 'text'; text: string }>;
        }>;
        abortSignal?: AbortSignal;
      }) => AsyncGenerator<unknown>;
    };

    const firstStream = adapter.run({
      messages: [
        {
          id: 'msg-first-turn',
          role: 'user',
          content: [{ type: 'text', text: 'first turn' }],
        },
      ],
      abortSignal: new AbortController().signal,
      unstable_threadId: 'persistent-thread',
    });

    const firstYieldPromise = firstStream.next();
    const firstDonePromise = firstStream.next();

    act(() => {
      mockEventSourceInstances[0]?.emit('conversation_id', 'conversation-keep');
      mockEventSourceInstances[0]?.emit('message', 'first');
      mockEventSourceInstances[0]?.emit('done');
    });

    await firstYieldPromise;
    await firstDonePromise;

    const secondStream = adapter.run({
      messages: [
        {
          id: 'msg-second-turn',
          role: 'user',
          content: [{ type: 'text', text: 'second turn' }],
        },
      ],
      abortSignal: new AbortController().signal,
      unstable_threadId: 'persistent-thread',
    });

    const secondDonePromise = secondStream.next();
    expect(parseStreamRequestBody(mockEventSourceInstances[1]!)).toMatchObject({
      message: 'second turn',
      conversationId: 'conversation-keep',
    });

    act(() => {
      mockEventSourceInstances[1]?.emit('done');
    });

    await secondDonePromise;
  });

  it('throws when the runtime hook is used outside the provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const Probe = () => {
      useAssistantUIRuntime();
      return null;
    };

    expect(() => render(<Probe />)).toThrow(
      'useAssistantUIRuntime must be used within AssistantUIRuntimeProvider',
    );

    consoleSpy.mockRestore();
  });

  it('throws when the tool metadata hook is used outside the provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const Probe = () => {
      useAssistantToolMetadata();
      return null;
    };

    expect(() => render(<Probe />)).toThrow(
      'useAssistantToolMetadata must be used within AssistantUIRuntimeProvider',
    );

    consoleSpy.mockRestore();
  });

  it('throws when the tool routing debug hook is used outside the provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const Probe = () => {
      useAssistantToolRoutingDebug();
      return null;
    };

    expect(() => render(<Probe />)).toThrow(
      'useAssistantToolRoutingDebug must be used within AssistantUIRuntimeProvider',
    );

    consoleSpy.mockRestore();
  });
});
