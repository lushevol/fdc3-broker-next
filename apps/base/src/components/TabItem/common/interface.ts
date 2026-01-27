import type { Workspace } from '../../../hooks/model/workspaces';

export interface TabProps {
  item: Workspace;
  edit: (item: Workspace) => (event) => void;
  remove: (item: Workspace) => (event) => boolean;
  refreshTab: (item: Workspace) => (event) => void;
  showRemove: boolean;
  showRefresh: boolean;
}
