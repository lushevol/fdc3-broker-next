import { createBackendToolUiToolkit } from './backendToolUiToolkit';
import { createBrowserFdc3IntentToolkit, type Fdc3IntentToolResult } from './fdc3IntentTool';
import { mergeRegisteredToolkits, type AssistantRegisteredToolkit } from './toolRouting';
import { createWorkspaceStatusToolkit, type WorkspaceStatusSnapshot } from './workspaceStatusTool';
import { createWorkspaceSummaryToolkit } from './workspaceSummaryTool';

export interface FrontendToolRegistryConfig {
  workspaceLabel?: string;
  tileCount?: number;
  getWorkspaceSnapshot?: () => WorkspaceStatusSnapshot;
  closeAllTiles?: () => Promise<WorkspaceStatusSnapshot> | WorkspaceStatusSnapshot;
  openTile?: (args: { tile: string }) => Promise<{
    workspaceId: string;
    opened: boolean;
    newTile: boolean;
    failedReason: string;
  }>;
}

const DEFAULT_WORKSPACE_LABEL = 'Current workspace';
const DEFAULT_TILE_COUNT = 0;
const defaultWorkspaceSnapshot = (): WorkspaceStatusSnapshot => ({
  activeWorkspaceId: null,
  activeWorkspaceLabel: DEFAULT_WORKSPACE_LABEL,
  activeTileTitle: null,
  totalWorkspaces: 0,
  totalTiles: 0,
  workspaces: [],
});
const defaultCloseAllTiles = async (): Promise<WorkspaceStatusSnapshot> => ({
  ...defaultWorkspaceSnapshot(),
  actionError: 'Workspace tile closing is not configured.',
});
const defaultOpenTile: NonNullable<FrontendToolRegistryConfig['openTile']> = async () => ({
  workspaceId: '',
  opened: false,
  newTile: false,
  failedReason: 'FDC3 tile opening is not configured.',
});

function createBusinessToolkits(config: FrontendToolRegistryConfig): AssistantRegisteredToolkit[] {
  const toolkits: AssistantRegisteredToolkit[] = [
    createWorkspaceSummaryToolkit({
      workspaceLabel: config.workspaceLabel ?? DEFAULT_WORKSPACE_LABEL,
      tileCount: config.tileCount ?? DEFAULT_TILE_COUNT,
    }),
    createWorkspaceStatusToolkit({
      getWorkspaceSnapshot: config.getWorkspaceSnapshot ?? defaultWorkspaceSnapshot,
      closeAllTiles: config.closeAllTiles ?? defaultCloseAllTiles,
    }),
  ];

  toolkits.push(createBrowserFdc3IntentToolkit(config.openTile ?? defaultOpenTile));

  return toolkits;
}

export function createFrontendToolRegistry(
  config: FrontendToolRegistryConfig = {},
): AssistantRegisteredToolkit {
  return mergeRegisteredToolkits([createBackendToolUiToolkit(), ...createBusinessToolkits(config)]);
}

export function isFdc3IntentResult(value: unknown): value is Fdc3IntentToolResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    'matchedIntent' in value &&
    'targetAppId' in value &&
    'payload' in value
  );
}
