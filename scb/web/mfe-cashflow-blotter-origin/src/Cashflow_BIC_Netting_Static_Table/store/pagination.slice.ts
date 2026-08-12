import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DEFAULT_PAGINATION_SIZE } from "../components/DataGrid/config";

type PaginationType = {
  page: number;
  size: number;
};

export const paginationSlice = createSlice({
  name: "pagination",
  initialState: {
    page: 0,
    size: DEFAULT_PAGINATION_SIZE,
  } as PaginationType,
  reducers: {
    setPageNo: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
    },
  },
});

export const { setPageNo, setPageSize } = paginationSlice.actions;

export const auditTablePaginationSlice = createSlice({
  name: "auditTablePagination",
  initialState: {
    page: 0,
    size: DEFAULT_PAGINATION_SIZE,
  } as PaginationType,
  reducers: {
    setAuditTablePageNo: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setAuditTablePageSize: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
    },
  },
});

export const { setAuditTablePageNo, setAuditTablePageSize } =
  auditTablePaginationSlice.actions;
