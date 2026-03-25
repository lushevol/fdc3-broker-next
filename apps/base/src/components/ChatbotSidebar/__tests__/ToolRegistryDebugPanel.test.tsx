import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import {
  AssistantUIRuntimeProvider,
  useRegisterAssistantTools,
} from '../AssistantUIRuntimeProvider';
import { ToolRegistryDebugPanel } from '../ToolRegistryDebugPanel';
import type { AssistantRegisteredToolkit } from '../tools/toolRouting';

const mockUseLocalRuntime = jest.fn(() => ({ kind: 'local-runtime' }));
const mockUseAui = jest.fn(() => ({ kind: 'aui-instance' }));
const mockTools = jest.fn((config: unknown) => ({ kind: 'tools-resource', config }));

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
      <div data-runtime={JSON.stringify(runtime)} data-aui={JSON.stringify(aui)}>
        {children}
      </div>
    ),
    useLocalRuntime: (adapter: unknown, options?: unknown) => mockUseLocalRuntime(adapter, options),
    useAui: (config?: unknown) => mockUseAui(config),
    Tools: (config: unknown) => mockTools(config),
  };
});

describe('ToolRegistryDebugPanel', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('renders active tool metadata in development mode', () => {
    process.env.NODE_ENV = 'development';

    const customToolkit: AssistantRegisteredToolkit = {
      custom_client_tool: {
        type: 'frontend',
        description: 'Custom tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ ok: true }),
        matchPriority: 40,
        matchPrompt: (input: string) => (input.includes('route') ? {} : null),
      },
    };

    const RegisterTools = () => {
      useRegisterAssistantTools(customToolkit);
      return null;
    };

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <RegisterTools />
        <ToolRegistryDebugPanel />
      </AssistantUIRuntimeProvider>,
    );

    expect(screen.getByTestId('tool-registry-debug-panel')).toBeInTheDocument();
    expect(screen.getByText('Assistant Tools')).toBeInTheDocument();
    expect(screen.getByText('custom_client_tool')).toBeInTheDocument();
    expect(screen.getByText('priority 40')).toBeInTheDocument();
    expect(screen.getAllByText('matcher on').length).toBeGreaterThan(0);
    expect(screen.getByText('No recent frontend tool route')).toBeInTheDocument();
    expect(screen.getByTestId('tool-registry-debug-panel')).toHaveStyle({
      left: '1rem',
      bottom: '1rem',
    });
  });

  it('renders the last matched tool route when a frontend tool is invoked', async () => {
    process.env.NODE_ENV = 'development';

    const customToolkit: AssistantRegisteredToolkit = {
      custom_client_tool: {
        type: 'frontend',
        description: 'Custom tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ ok: true }),
        matchPriority: 40,
        matchPrompt: (input: string) =>
          input.includes('route winner')
            ? {
                args: { source: 'panel' },
                confidence: 0.72,
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
        <ToolRegistryDebugPanel />
      </AssistantUIRuntimeProvider>,
    );

    const adapter = mockUseLocalRuntime.mock.calls.at(-1)?.[0] as {
      run: (input: {
        messages: Array<{
          id: string;
          role: 'user';
          content: Array<{ type: 'text'; text: string }>;
        }>;
      }) => Promise<unknown>;
    };

    await act(async () => {
      await adapter.run({
        messages: [
          {
            id: 'msg-debug-panel',
            role: 'user',
            content: [{ type: 'text', text: 'please choose the route winner now' }],
          },
        ],
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Last Route')).toBeInTheDocument();
      expect(screen.getAllByText('custom_client_tool').length).toBeGreaterThan(0);
      expect(screen.getByText('confidence 0.72')).toBeInTheDocument();
      expect(screen.getByText('prompt please choose the route winner now')).toBeInTheDocument();
    });
  });

  it('does not render in production mode by default', () => {
    process.env.NODE_ENV = 'production';

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <ToolRegistryDebugPanel />
      </AssistantUIRuntimeProvider>,
    );

    expect(screen.queryByTestId('tool-registry-debug-panel')).not.toBeInTheDocument();
  });

  it('can hide the debug panel and restore it from a compact trigger', () => {
    process.env.NODE_ENV = 'development';

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <ToolRegistryDebugPanel />
      </AssistantUIRuntimeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Hide tool debug panel' }));

    expect(screen.queryByTestId('tool-registry-debug-panel')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show Tools' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show Tools' })).toHaveStyle({
      left: '1rem',
      bottom: '1rem',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Show Tools' }));

    expect(screen.getByTestId('tool-registry-debug-panel')).toBeInTheDocument();
    expect(screen.getByText('Assistant Tools')).toBeInTheDocument();
  });

  it('can be dragged away from the default left-bottom position', () => {
    process.env.NODE_ENV = 'development';

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <ToolRegistryDebugPanel />
      </AssistantUIRuntimeProvider>,
    );

    const panel = screen.getByTestId('tool-registry-debug-panel');

    Object.defineProperty(panel, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 16,
        top: 200,
        right: 304,
        bottom: 600,
        width: 288,
        height: 400,
      }),
    });

    fireEvent.mouseDown(screen.getByTestId('tool-registry-drag-handle'), {
      clientX: 40,
      clientY: 220,
    });
    fireEvent.mouseMove(window, {
      clientX: 140,
      clientY: 260,
    });
    fireEvent.mouseUp(window);

    expect(panel).toHaveStyle({
      left: '116px',
      top: '240px',
    });
  });

  it('keeps the dragged position when hidden and restored', () => {
    process.env.NODE_ENV = 'development';

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <ToolRegistryDebugPanel />
      </AssistantUIRuntimeProvider>,
    );

    const panel = screen.getByTestId('tool-registry-debug-panel');

    Object.defineProperty(panel, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 16,
        top: 200,
        right: 304,
        bottom: 600,
        width: 288,
        height: 400,
      }),
    });

    fireEvent.mouseDown(screen.getByTestId('tool-registry-drag-handle'), {
      clientX: 40,
      clientY: 220,
    });
    fireEvent.mouseMove(window, {
      clientX: 140,
      clientY: 260,
    });
    fireEvent.mouseUp(window);

    fireEvent.click(screen.getByRole('button', { name: 'Hide tool debug panel' }));

    expect(screen.getByRole('button', { name: 'Show Tools' })).toHaveStyle({
      left: '116px',
      top: '240px',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Show Tools' }));

    expect(screen.getByTestId('tool-registry-debug-panel')).toHaveStyle({
      left: '116px',
      top: '240px',
    });
  });

  it('renders when explicitly enabled outside production gating', () => {
    process.env.NODE_ENV = 'production';

    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <ToolRegistryDebugPanel enabled />
      </AssistantUIRuntimeProvider>,
    );

    expect(screen.getByTestId('tool-registry-debug-panel')).toBeInTheDocument();
  });
});
