import React from 'react';
import type { ToolCallMessagePartProps } from '@assistant-ui/react';
import { z } from 'zod';
import type { AssistantRegisteredToolkit } from './toolRouting';

export interface WorkspaceSummaryToolConfig {
  workspaceLabel: string;
  tileCount: number;
}

export type WorkspaceSummaryArgs = Record<string, never>;

export interface WorkspaceSummaryResult {
  workspaceLabel: string;
  tileCount: number;
  summary: string;
}

function formatTileSummary(tileCount: number): string {
  return `${tileCount} active ${tileCount === 1 ? 'tile' : 'tiles'}`;
}

export function createWorkspaceSummaryToolkit({
  workspaceLabel,
  tileCount,
}: WorkspaceSummaryToolConfig): AssistantRegisteredToolkit {
  return {
    summarize_workspace_state: {
      type: 'frontend',
      description: 'Summarize the currently active workspace from the browser state.',
      parameters: z.object({}),
      execute: async (): Promise<WorkspaceSummaryResult> => ({
        workspaceLabel,
        tileCount,
        summary: `${workspaceLabel} currently has ${tileCount} active ${tileCount === 1 ? 'tile' : 'tiles'}.`,
      }),
      render: WorkspaceSummaryToolUi,
      matchPrompt: (input: string) => {
        const normalizedInput = input.toLowerCase();
        return normalizedInput.includes('workspace summary') ||
          normalizedInput.includes('summarize workspace') ||
          normalizedInput.includes('current workspace')
          ? {}
          : null;
      },
    },
  };
}

export function WorkspaceSummaryToolUi({
  result,
}: ToolCallMessagePartProps<WorkspaceSummaryArgs, WorkspaceSummaryResult>): JSX.Element {
  return (
    <div
      style={{
        marginTop: '0.75rem',
        border: '1px solid #d7deea',
        borderRadius: '14px',
        padding: '1rem',
        backgroundColor: '#f7f9fc',
      }}
    >
      <div style={{ fontWeight: 700 }}>Workspace Snapshot</div>
      <div style={{ marginTop: '0.375rem', fontSize: '0.95rem' }}>
        {result?.workspaceLabel ?? 'Current workspace'}
      </div>
      <div style={{ marginTop: '0.375rem', color: '#425466' }}>
        {result ? formatTileSummary(result.tileCount) : 'Collecting active workspace details...'}
      </div>
      {result?.summary ? (
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#526072' }}>
          {result.summary}
        </div>
      ) : null}
    </div>
  );
}
