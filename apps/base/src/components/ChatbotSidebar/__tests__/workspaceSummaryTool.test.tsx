import React from 'react';
import { render, screen } from '@testing-library/react';
import { createWorkspaceSummaryToolkit } from '../tools/workspaceSummaryTool';

describe('workspaceSummaryTool', () => {
  it('creates a frontend workspace summary tool with browser execution', async () => {
    const toolkit = createWorkspaceSummaryToolkit({
      workspaceLabel: 'Workspace 3',
      tileCount: 2,
    });

    expect(toolkit).toMatchObject({
      summarize_workspace_state: expect.objectContaining({
        description: expect.any(String),
        execute: expect.any(Function),
        render: expect.any(Function),
      }),
    });

    await expect(toolkit.summarize_workspace_state.execute({})).resolves.toMatchObject({
      workspaceLabel: 'Workspace 3',
      tileCount: 2,
      summary: expect.stringContaining('2'),
    });
  });

  it('renders inline ui for the workspace summary tool', () => {
    const toolkit = createWorkspaceSummaryToolkit({
      workspaceLabel: 'Workspace 3',
      tileCount: 2,
    });
    const WorkspaceSummaryToolUi = toolkit.summarize_workspace_state.render;
    const addResult = jest.fn();

    render(
      <WorkspaceSummaryToolUi
        toolName="summarize_workspace_state"
        toolCallId="tool-2"
        status={{ type: 'complete' }}
        args={{}}
        result={{
          workspaceLabel: 'Workspace 3',
          tileCount: 2,
          summary: 'Workspace 3 currently has 2 active tiles.',
        }}
        isError={false}
        addResult={addResult}
        resume={jest.fn()}
      />,
    );

    expect(screen.getByText('Workspace Snapshot')).toBeInTheDocument();
    expect(screen.getByText('Workspace 3')).toBeInTheDocument();
    expect(screen.getByText('2 active tiles')).toBeInTheDocument();
  });
});
