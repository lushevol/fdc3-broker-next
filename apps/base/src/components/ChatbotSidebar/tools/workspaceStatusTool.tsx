import React, { useEffect, useMemo, useState } from 'react';
import type { ToolCallMessagePartProps } from '@assistant-ui/react';
import { z } from 'zod';
import type { AssistantRegisteredToolkit } from './toolRouting';

export interface WorkspaceStatusWorkspaceSummary {
  id: string;
  label: string;
  tileCount: number;
  isActive: boolean;
}

export interface WorkspaceStatusSnapshot {
  activeWorkspaceId: string | null;
  activeWorkspaceLabel: string | null;
  activeTileTitle: string | null;
  totalWorkspaces: number;
  totalTiles: number;
  workspaces: WorkspaceStatusWorkspaceSummary[];
  actionMessage?: string;
  actionError?: string;
}

export interface WorkspaceStatusToolConfig {
  getWorkspaceSnapshot: () => WorkspaceStatusSnapshot;
  closeAllTiles: () => Promise<WorkspaceStatusSnapshot> | WorkspaceStatusSnapshot;
}

type WorkspaceStatusArgs = WorkspaceStatusSnapshot;

interface WorkspaceStatusToolUiDependencies {
  closeAllTiles: WorkspaceStatusToolConfig['closeAllTiles'];
}

function matchesWorkspaceStatusPrompt(input: string): boolean {
  const normalized = input.toLowerCase();

  return (
    normalized.includes('workspace status') ||
    normalized.includes('workspaces status') ||
    normalized.includes('opened tiles') ||
    normalized.includes('active tile') ||
    normalized.includes('workspace snapshot') ||
    normalized.includes('tabs status')
  );
}

function getActionPalette(hasError: boolean): React.CSSProperties {
  if (hasError) {
    return {
      border: '1px solid #f5c2c7',
      backgroundColor: '#fff5f5',
      color: '#842029',
    };
  }

  return {
    border: '1px solid #d7deea',
    backgroundColor: '#f7f9fc',
    color: '#132238',
  };
}

export function WorkspaceStatusToolUi({
  args,
  result,
  addResult,
}: ToolCallMessagePartProps<WorkspaceStatusArgs, WorkspaceStatusSnapshot>): JSX.Element {
  const [pending, setPending] = useState(false);
  const [optimisticResult, setOptimisticResult] = useState<WorkspaceStatusSnapshot | null>(
    result ?? null,
  );

  useEffect(() => {
    setOptimisticResult(result ?? null);
    setPending(false);
  }, [result]);

  const resolvedResult = optimisticResult ?? result ?? args;
  const typedResult = resolvedResult as (WorkspaceStatusSnapshot & {
    __dependencies?: WorkspaceStatusToolUiDependencies;
  }) | null;
  const hasError = !!typedResult?.actionError;

  const handleCloseAllTiles = async () => {
    if (pending || !typedResult?.__dependencies?.closeAllTiles) {
      return;
    }

    setPending(true);

    try {
      const nextSnapshot = await typedResult.__dependencies.closeAllTiles();
      setOptimisticResult(nextSnapshot);
      addResult(nextSnapshot);
    } catch (error) {
      const failureResult: WorkspaceStatusSnapshot = {
        ...(typedResult ?? {
          activeWorkspaceId: null,
          activeWorkspaceLabel: null,
          activeTileTitle: null,
          totalWorkspaces: 0,
          totalTiles: 0,
          workspaces: [],
        }),
        actionError:
          error instanceof Error ? error.message : 'Failed to close all tiles across workspaces.',
      };
      setOptimisticResult(failureResult);
      addResult(failureResult);
    } finally {
      setPending(false);
    }
  };

  const workspaceRows = useMemo(() => typedResult?.workspaces ?? [], [typedResult?.workspaces]);

  return (
    <div
      style={{
        marginTop: '0.75rem',
        borderRadius: '14px',
        padding: '1rem',
        ...getActionPalette(hasError),
      }}
    >
      <div style={{ fontWeight: 700 }}>Workspace Status</div>
      <div style={{ marginTop: '0.375rem', fontSize: '0.95rem' }}>
        Active workspace: {typedResult?.activeWorkspaceLabel ?? 'None'}
      </div>
      <div style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
        Active tile: {typedResult?.activeTileTitle ?? 'No active tile'}
      </div>
      <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.25rem', fontSize: '0.9rem' }}>
        <div>Total workspaces: {typedResult?.totalWorkspaces ?? 0}</div>
        <div>Total opened tiles: {typedResult?.totalTiles ?? 0}</div>
      </div>
      <div style={{ marginTop: '0.75rem', fontWeight: 600 }}>Per-workspace tiles</div>
      <div style={{ marginTop: '0.35rem', display: 'grid', gap: '0.35rem' }}>
        {workspaceRows.map((workspace) => (
          <div
            key={workspace.id}
            style={{
              borderRadius: '10px',
              border: '1px solid rgba(19,34,56,0.12)',
              padding: '0.65rem 0.75rem',
              backgroundColor: workspace.isActive ? 'rgba(21,101,192,0.08)' : '#ffffff',
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {workspace.label}
              {workspace.isActive ? ' (active)' : ''}
            </div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
              {workspace.tileCount} {workspace.tileCount === 1 ? 'tile' : 'tiles'}
            </div>
          </div>
        ))}
      </div>
      {typedResult?.actionMessage ? (
        <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>{typedResult.actionMessage}</div>
      ) : null}
      {typedResult?.actionError ? (
        <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>{typedResult.actionError}</div>
      ) : null}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <button
          type="button"
          onClick={() => {
            void handleCloseAllTiles();
          }}
          disabled={pending || !typedResult?.__dependencies?.closeAllTiles}
          style={{
            border: 'none',
            borderRadius: '999px',
            padding: '0.55rem 0.95rem',
            backgroundColor: '#b42318',
            color: '#ffffff',
            cursor:
              pending || !typedResult?.__dependencies?.closeAllTiles ? 'not-allowed' : 'pointer',
            opacity: pending || !typedResult?.__dependencies?.closeAllTiles ? 0.6 : 1,
            fontWeight: 600,
          }}
        >
          {pending ? 'Closing tiles...' : 'Close all tiles'}
        </button>
      </div>
    </div>
  );
}

export function createWorkspaceStatusToolkit(
  config: WorkspaceStatusToolConfig,
): AssistantRegisteredToolkit {
  const workspaceStatusParameters = z.object({
    activeWorkspaceId: z.string().nullable(),
    activeWorkspaceLabel: z.string().nullable(),
    activeTileTitle: z.string().nullable(),
    totalWorkspaces: z.number(),
    totalTiles: z.number(),
    workspaces: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        tileCount: z.number(),
        isActive: z.boolean(),
      }),
    ),
    actionMessage: z.string().optional(),
    actionError: z.string().optional(),
  });

  return {
    report_workspace_status: {
      type: 'frontend',
      description:
        'Report workspace status, including opened tiles and the active tile, and allow closing all tiles across all tabs.',
      humanInTheLoop: true,
      parameters: workspaceStatusParameters,
      execute: async (args): Promise<WorkspaceStatusSnapshot> => args as WorkspaceStatusSnapshot,
      render: (props) => (
        <WorkspaceStatusToolUi
          {...props}
          args={{
            ...props.args,
            __dependencies: {
              closeAllTiles: config.closeAllTiles,
            },
          }}
          result={
            props.result
              ? {
                  ...props.result,
                  __dependencies: {
                    closeAllTiles: config.closeAllTiles,
                  },
                }
              : props.result
          }
        />
      ),
      matchPrompt: (input: string) =>
        matchesWorkspaceStatusPrompt(input) ? config.getWorkspaceSnapshot() : null,
    },
  };
}
