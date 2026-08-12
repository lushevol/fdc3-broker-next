import { Workspace } from "../../../hooks/model/workspaces";

export interface TabProps {
  item: Workspace;
  edit: (
    item: Workspace
  ) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  remove: (item: Workspace) => (event: React.MouseEvent) => boolean;
  refreshTab: (item: Workspace) => (event: React.MouseEvent) => void;
  showRemove: boolean;
  showRefresh: boolean;
}
