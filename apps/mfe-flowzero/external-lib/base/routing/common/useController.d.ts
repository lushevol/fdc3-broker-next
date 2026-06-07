import { SnackbarCloseReason } from "@mui/material";
import React from "react";
declare const useController: () => {
  store: import("../../hooks/model/root").RootModel;
  isReady: boolean;
  storageHandler: (r: any) => void;
  checkSession: () => Promise<void>;
  handleCloseErrorMessage: (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
  openfinCheckSession: () => Promise<void>;
};
export default useController;
