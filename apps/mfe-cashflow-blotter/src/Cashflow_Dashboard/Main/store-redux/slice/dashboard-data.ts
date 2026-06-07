import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import set from "lodash/set";

import { CashflowStatusNum } from "../../common/interface";

type ItemChangeType = {
  path: string;
  value: string | number;
};

type ItemLoadingType = {
  path: string;
  isLoading: boolean;
};

type DashboardDataRootType = {
  Status_Num: CashflowStatusNum;
};

export const dashboardDataSlice = createSlice({
  name: "dashboardData",
  initialState: {
    Status_Num: {},
  } as DashboardDataRootType,
  reducers: {
    setStatusValueByPath: (state, action: PayloadAction<ItemChangeType>) => {
      set(
        state.Status_Num,
        `${action.payload.path}.value`,
        action.payload.value
      );
    },
    setStatusLoadingByPath: (state, action: PayloadAction<ItemLoadingType>) => {
      set(
        state.Status_Num,
        `${action.payload.path}.loading`,
        action.payload.isLoading
      );
    },
    setAllStatusLoading: (state, action: PayloadAction<boolean>) => {
      Object.keys(state.Status_Num).forEach((key) => {
        set(state.Status_Num, `${key}.loading`, action.payload);
      });
    },
  },
});

export const {
  setStatusValueByPath,
  setStatusLoadingByPath,
  setAllStatusLoading,
} = dashboardDataSlice.actions;
export default dashboardDataSlice.reducer;
