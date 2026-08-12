import { createSlice } from "@reduxjs/toolkit";

type AuditState = {
  openDialog: boolean;
};

export const auditSlice = createSlice({
  name: "audit",
  initialState: {
    openDialog: false,
  } as AuditState,
  reducers: {
    openAuditDialog: (state) => {
      state.openDialog = true;
    },
    closeAuditDialog: (state) => {
      state.openDialog = false;
    },
  },
});

export const { openAuditDialog, closeAuditDialog } = auditSlice.actions;

export default auditSlice.reducer;
