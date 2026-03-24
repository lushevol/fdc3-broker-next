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
const mockEventSourceInstances: MockEventSource[] = [];

class MockEventSource {
  public onerror: ((event: Event) => void) | null = null;

  private readonly listeners = new Map<string, Array<(event: MessageEvent) => void>>();

  constructor(public readonly url: string) {
    mockEventSourceInstances.push(this);
  }

  addEventListener(type: string, listener: (event: MessageEvent) => void): void {
    const currentListeners = this.listeners.get(type) ?? [];
    currentListeners.push(listener);
    this.listeners.set(type, currentListeners);
  }

  emit(type: string, data = ''): void {
    const event = new MessageEvent(type, { data });
    (this.listeners.get(type) ?? []).forEach((listener) => listener(event));
  }

  failConnection(): void {
    this.onerror?.({} as Event);
  }

  close = jest.fn();
}

Object.defineProperty(global, 'fetch', {
  writable: true,
  value: mockFetch,
});

Object.defineProperty(global, 'EventSource', {
  writable: true,
  value: MockEventSource,
});

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
    mockEventSourceInstances.length = 0;
  });

  it('creates a local runtime and registers the demo toolkit with assistant-ui tools', () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    expect(mockUseLocalRuntime).toHaveBeenCalledTimes(1);
    expect(mockUseAui).toHaveBeenCalledTimes(1);
    expect(mockTools).toHaveBeenCalledTimes(1);

    expect(mockTools.mock.calls[0]?.[0]).toMatchObject({
      toolkit: expect.any(Object),
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
        get_current_time: expect.any(Object),
        generate_status_card: expect.any(Object),
        custom_client_tool: expect.any(Object),
      }),
    });
  });

  it('throws when active registrations define the same tool name', () => {
    const duplicateToolkit: AssistantRegisteredToolkit = {
      get_current_time: {
        type: 'frontend',
        description: 'Duplicate time tool',
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
    ).toThrow('Duplicate assistant tool registration: get_current_time');

    consoleSpy.mockRestore();
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
    expect(screen.getByTestId('runtime-probe')).toHaveTextContent('"get_current_time"');
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

  it('exposes the last matched tool route through a dedicated hook', async () => {
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
      });

      await stream.next();
    });

    expect(screen.getByTestId('tool-route-hook')).toHaveTextContent(
      '"toolName":"custom_client_tool"',
    );
    expect(screen.getByTestId('tool-route-hook')).toHaveTextContent('"priority":55');
    expect(screen.getByTestId('tool-route-hook')).toHaveTextContent('"confidence":0.85');
    expect(screen.getByTestId('tool-route-hook')).toHaveTextContent(
      '"input":"please run the debug route flow"',
    );
  });

  it('routes a registered tool from its prompt matcher inside the local adapter', async () => {
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
    let finalResult;
    await act(async () => {
      const stream = adapter.run({
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: [{ type: 'text', text: 'please run custom tool now' }],
          },
        ],
      });

      firstResult = await stream.next();
      finalResult = await stream.next();
    });

    expect(routedExecute).toHaveBeenCalledWith({}, expect.any(Object));
    expect(firstResult.value.content[0]).toMatchObject({
      type: 'tool-call',
      toolName: 'custom_client_tool',
    });
    expect(firstResult.value.status).toMatchObject({
      type: 'requires-action',
      reason: 'tool-calls',
    });
    expect(finalResult.value.content[0]).toMatchObject({
      type: 'tool-call',
      toolName: 'custom_client_tool',
      result: { routed: true },
    });
    expect(finalResult.value.status).toMatchObject({
      type: 'complete',
      reason: 'stop',
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('prefers the highest-priority matching tool when multiple tools match', async () => {
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
      });

      firstResult = await stream.next();
      finalResult = await stream.next();
    });

    expect(lowerPriorityExecute).not.toHaveBeenCalled();
    expect(higherPriorityExecute).toHaveBeenCalledWith({}, expect.any(Object));
    expect(firstResult.value.content[0]).toMatchObject({
      type: 'tool-call',
      toolName: 'higher_priority_tool',
    });
    expect(firstResult.value.status).toMatchObject({
      type: 'requires-action',
      reason: 'tool-calls',
    });
    expect(finalResult.value.content[0]).toMatchObject({
      type: 'tool-call',
      toolName: 'higher_priority_tool',
      result: { source: 'higher' },
    });
  });

  it('prefers the higher-confidence match when priorities are equal', async () => {
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
      });

      firstResult = await stream.next();
      finalResult = await stream.next();
    });

    expect(lowerConfidenceExecute).not.toHaveBeenCalled();
    expect(higherConfidenceExecute).toHaveBeenCalledWith({ source: 'higher' }, expect.any(Object));
    expect(firstResult.value.content[0]).toMatchObject({
      type: 'tool-call',
      toolName: 'higher_confidence_tool',
    });
    expect(firstResult.value.status).toMatchObject({
      type: 'requires-action',
      reason: 'tool-calls',
    });
    expect(finalResult.value.content[0]).toMatchObject({
      type: 'tool-call',
      toolName: 'higher_confidence_tool',
      result: { source: 'higher' },
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
    expect(mockFetch).not.toHaveBeenCalled();

    const firstYieldPromise = stream.next();
    const secondYieldPromise = stream.next();
    const thirdYieldPromise = stream.next();
    const doneYieldPromise = stream.next();

    expect(mockEventSourceInstances).toHaveLength(1);
    expect(mockEventSourceInstances[0]?.url).toContain(
      '/api/chat/stream?message=plain+backend+prompt',
    );

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
        ],
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

  it('completes the local tool roundtrip without synthesizing a demo follow-up message', async () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <div>child</div>
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'tool';
          content: Array<{
            type: 'tool-result';
            toolCallId: string;
            result: unknown;
            isError?: boolean;
          }>;
        }>;
      }) => Promise<{
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

    const result = await adapter.run({
      messages: [
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
    });

    expect(result).toMatchObject({
      status: {
        type: 'complete',
        reason: 'stop',
      },
    });
    expect(result.content ?? []).toHaveLength(0);
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
    });

    const secondDonePromise = secondStream.next();
    expect(mockEventSourceInstances[1]?.url).toContain('conversationId=conversation-keep');

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
