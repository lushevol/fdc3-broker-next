import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DEFAULT_PAGINATION_SIZE } from "../components/DataGrid/config";
import { RuleListResponse, StaticRuleRow } from "../services/api.type";

type PaginationType = {
  lastPageNo: number;
  nextPageNo: number;
  pageSize: number;
  totalHits: number;
  reachTheEnd: boolean;
  rowData: StaticRuleRow[];
};

export const paginationSlice = createSlice({
  name: "pagination",
  initialState: {
    lastPageNo: -1,
    nextPageNo: 0,
    pageSize: DEFAULT_PAGINATION_SIZE,
    totalHits: 0,
    reachTheEnd: false,
    rowData: [],
  } as PaginationType,
  reducers: {
    resetPageNo: (state) => {
      state.lastPageNo = -1;
      state.nextPageNo = 0;
      state.reachTheEnd = false;
      state.rowData = [];
    },
    goToNextPage: (state) => {
      if (!state.reachTheEnd) {
        state.nextPageNo = state.lastPageNo + 1;
      }
    },
    setPagination: (
      state,
      action: PayloadAction<RuleListResponse<StaticRuleRow>>
    ) => {
      const { pageNo, results, totalHits, totalPages } = action.payload;
      state.lastPageNo = pageNo;
      state.reachTheEnd = pageNo === totalPages - 1;
      state.totalHits = totalHits;
      if (pageNo === 0) {
        state.rowData = results;
      } else {
        const existingIds = new Set(state.rowData.map((i) => i.id));
        state.rowData = [
          ...state.rowData,
          ...results.filter((i) => !existingIds.has(i.id)),
        ];
      }
    },
    updateRowDataAfterMutation: (
      state,
      action: PayloadAction<StaticRuleRow>
    ) => {
      const rowIndex = state.rowData.findIndex(
        (i) => i.id === action.payload.id
      );
      if (rowIndex > -1) {
        state.rowData[rowIndex] = action.payload;
      } else {
        state.rowData = [action.payload, ...state.rowData];
      }
    },
  },
});

export const {
  setPagination,
  resetPageNo,
  goToNextPage,
  updateRowDataAfterMutation,
} = paginationSlice.actions;

type AuditTablePaginationType = {
  page: number;
  size: number;
};

export const auditTablePaginationSlice = createSlice({
  name: "auditTablePagination",
  initialState: {
    page: 0,
    size: DEFAULT_PAGINATION_SIZE,
  } as AuditTablePaginationType,
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
