import React from "react";

import { Container } from "../../../hooks/model/workspaces";
declare const useController: () => {
  store: import("../../../hooks/model/root").RootModel;
  anchor: boolean;
  toggleDrawer: (
    val: boolean
  ) => (_event: React.KeyboardEvent | React.MouseEvent) => void;
  addTile: (inputContainer: Container) => void;
  surveyLink: string;
  openPopUp: () => void;
  winFocusEvent: (_e?: any) => void;
  beforeunloadEvent: (e: any) => string;
  openLogoutModal: boolean;
  setOpenLogoutModal: React.Dispatch<React.SetStateAction<boolean>>;
};
export default useController;
