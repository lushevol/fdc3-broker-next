import { render } from '@testing-library/react';
import React from 'react';
import { AssistantUIRuntimeProvider } from '../AssistantUIRuntimeProvider';
import { WorkspaceSummaryToolRegistrationExample } from '../WorkspaceSummaryToolRegistrationExample';

const mockUseLocalRuntime = jest.fn(() => ({ kind: 'local-runtime' }));
const mockUseAui = jest.fn(() => ({ kind: 'aui-instance' }));
const mockTools = jest.fn((config: unknown) => ({ kind: 'tools-resource', config }));

jest.mock('@assistant-ui/react', () => {
  const React = jest.requireActual('react');

  return {
    AssistantRuntimeProvider: ({
      children,
    }: {
      children: React.ReactNode;
      runtime: unknown;
      aui: unknown;
    }) => <div>{children}</div>,
    useLocalRuntime: (adapter: unknown, options?: unknown) => mockUseLocalRuntime(adapter, options),
    useAui: (config?: unknown) => mockUseAui(config),
    Tools: (config: unknown) => mockTools(config),
  };
});

describe('WorkspaceSummaryToolRegistrationExample', () => {
  it('registers the workspace summary tool from a subtree hook', () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <WorkspaceSummaryToolRegistrationExample workspaceLabel="Workspace 2" tileCount={3} />
      </AssistantUIRuntimeProvider>,
    );

    expect(mockTools.mock.calls.at(-1)?.[0]).toMatchObject({
      toolkit: expect.objectContaining({
        summarize_workspace_state: expect.any(Object),
      }),
    });
  });
});
