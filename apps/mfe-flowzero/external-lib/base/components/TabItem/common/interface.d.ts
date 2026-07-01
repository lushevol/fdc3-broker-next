import { Workspace } from "../../../hooks/model/workspaces";
export interface TabProps {
  item: Workspace;
  edit: (item: Workspace) => (event: any) => void;
  remove: (item: Workspace) => (event: any) => boolean;
  refreshTab: (item: Workspace) => (event: any) => void;
  showRemove: boolean;
  showRefresh: boolean;
}
