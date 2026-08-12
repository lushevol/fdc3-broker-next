import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { FormInstance } from "antd";
import type { FilterRecord } from "src/Cashflow_CN/components/AdvancedSearch/types";

import type { SearchCriteria } from "../../store/interface";

type DashboardSearchRootType = {
  searchFormInstance: {
    resetFields: (fields?: any[] | undefined) => void;
  } | null;
  quickSearch: SearchCriteria;
  advancedSearch: {
    appliedFilter: FilterRecord | null;
  };
  searchIndicator: "quickSearch" | "advancedSearch";
  isSearching: boolean;
};

export const dashboardSearchSlice = createSlice({
  name: "dashboardSearch",
  initialState: {
    searchFormInstance: null,
    quickSearch: {},
    advancedSearch: {
      appliedFilter: null,
    },
    searchIndicator: "quickSearch",
    isSearching: false,
  } as DashboardSearchRootType,
  reducers: {
    setSearchFormInstance: (state, action: PayloadAction<FormInstance>) => {
      state.searchFormInstance = {
        resetFields: action.payload.resetFields,
      };
    },
    searchFormClear: (state) => {
      state.searchFormInstance?.resetFields();
    },
    setQuickSearch: (state, action: PayloadAction<SearchCriteria>) => {
      state.quickSearch = action.payload;
      state.searchIndicator = "quickSearch";
      state.advancedSearch.appliedFilter = null;
    },
    clearQuickSearch: (state) => {
      state.quickSearch = {};
      state.searchIndicator = "quickSearch";
    },
    setAdvancedSearch: (state, action: PayloadAction<FilterRecord>) => {
      state.advancedSearch.appliedFilter = action.payload;
      state.searchIndicator = "advancedSearch";
      state.quickSearch = {};
    },
    clearAdvancedSearch: (state) => {
      state.advancedSearch.appliedFilter = null;
      state.searchIndicator = "quickSearch";
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
  },
});

export const {
  setQuickSearch,
  clearQuickSearch,
  setAdvancedSearch,
  clearAdvancedSearch,
  setIsSearching,
  setSearchFormInstance,
  searchFormClear,
} = dashboardSearchSlice.actions;
export default dashboardSearchSlice.reducer;
