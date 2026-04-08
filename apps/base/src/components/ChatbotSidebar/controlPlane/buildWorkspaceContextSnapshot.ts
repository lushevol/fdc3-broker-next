import type { WorkspaceStatusSnapshot } from '../tools/workspaceStatusTool';
import type { WorkspaceContextSnapshot } from './types';

export function buildWorkspaceContextSnapshot(
  snapshot?: WorkspaceStatusSnapshot | null,
): WorkspaceContextSnapshot | null {
  if (!snapshot?.activeWorkspaceId) {
    return null;
  }

  return {
    workspaceId: snapshot.activeWorkspaceId,
    activeTileId: snapshot.activeTileId ?? null,
    activeAppId: snapshot.activeAppId ?? null,
  };
}
