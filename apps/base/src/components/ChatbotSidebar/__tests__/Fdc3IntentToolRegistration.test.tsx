import { render } from '@testing-library/react';
import React from 'react';
import { AssistantUIRuntimeProvider } from '../AssistantUIRuntimeProvider';
import { Fdc3IntentToolRegistration } from '../Fdc3IntentToolRegistration';

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

jest.mock('../../../fdc3/useFDC3WorkspaceHelper', () => ({
  useFDC3WorkspaceHelper: () => ({
    workspaceOpenTile: jest.fn(),
    allAccessibleTiles: [],
  }),
}));

describe('Fdc3IntentToolRegistration', () => {
  it('registers the FDC3 intent tool from a subtree hook', () => {
    render(
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <Fdc3IntentToolRegistration />
      </AssistantUIRuntimeProvider>,
    );

    expect(mockTools.mock.calls.at(-1)?.[0]).toMatchObject({
      toolkit: expect.objectContaining({
        process_fdc3_intent: expect.any(Object),
      }),
    });
  });
});
