import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AgGridEvent } from "ag-grid-community";

type AggridState = {
  aggridEvent?: AgGridEvent;
};

export const aggridSlice = createSlice({
  name: "aggrid",
  initialState: {
    aggridEvent: undefined,
  } as AggridState,
  reducers: {
    setAggridEvent: (state, action: PayloadAction<AgGridEvent>) => {
      state.aggridEvent = action.payload;
    },
  },
});

export const { setAggridEvent } = aggridSlice.actions;

export default aggridSlice.reducer;
