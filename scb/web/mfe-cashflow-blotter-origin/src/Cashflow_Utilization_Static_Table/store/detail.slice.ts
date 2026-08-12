import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ButtonProps } from "antd";

import {
  ActionButtonProps,
  getDetailsActionsRule,
} from "../components/Actions/utils";
import {
  UtilizationRuleMutation,
  UtilizationRuleRow,
} from "../services/api.type";
import { ActionType } from "../state/types";

export enum DetailMode {
  Edit = "Edit",
  Create = "Create",
}

type DetailState = {
  openDialog: boolean;
  detailData: UtilizationRuleMutation | UtilizationRuleRow;
  mode: DetailMode;
  actions: (ActionButtonProps & Pick<ButtonProps, "danger" | "type">)[];
};

const generateEmptyDetailFormData = (): UtilizationRuleMutation => ({
  counterpartyFmCode: "",
  counterpartyFmId: "",
  entityFmCode: "",
  entityFmId: "",
  autoUtil: "",
});

export const detailSlice = createSlice({
  name: "detail",
  initialState: {
    openDialog: false,
    detailData: generateEmptyDetailFormData(),
    mode: DetailMode.Edit,
    actions: [],
  } as DetailState,
  reducers: {
    openCreateDialog: (state) => {
      state.openDialog = true;
      state.detailData = generateEmptyDetailFormData();
      state.mode = DetailMode.Create;
      state.actions = [{ action: ActionType.Create, disabled: false }];
    },
    openEditDialog: (state, action: PayloadAction<UtilizationRuleRow>) => {
      state.openDialog = true;
      state.detailData = action.payload;
      state.mode = DetailMode.Edit;
      state.actions = getDetailsActionsRule(action.payload);
    },
    closeDialog: (state) => {
      state.openDialog = false;
      state.detailData = generateEmptyDetailFormData();
      state.mode = DetailMode.Create;
      state.actions = [];
    },
  },
});

export const { openCreateDialog, openEditDialog, closeDialog } =
  detailSlice.actions;

export default detailSlice.reducer;
