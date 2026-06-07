import React from "react";

import { Workspace } from "../../../hooks/model/workspaces";
declare const useController: () => {
  store: import("../../../hooks/model/root").RootModel;
  value: number;
  handleChange: (event: any, newValue: number) => void;
  add: () => void;
  edit: (item: Workspace) => (event: any) => void;
  focus: (id: any) => () => void;
  remove: (item: Workspace) => (event: React.MouseEvent) => boolean;
  ready: boolean;
  showTimeout: boolean;
  setShowTimeout: React.Dispatch<React.SetStateAction<boolean>>;
  mouseMove: () => void;
  validateWorkspaceReady: boolean;
  runExtend: () => void;
  updateValue: (workspaces: any, index_: any, value_: any) => void;
  refreshTab: (item: Workspace) => (event: React.MouseEvent) => void;
};
export default useController;
