import { PAGE_SIZE_FOR_CASHFLOW } from "../../config/UIconfig";
import { SettleUserType } from "../../workflow/manualSettle/interface";
import * as types from "../actionTypes";
import { RootState } from "../interface";

export const initParams = (state: any = {}, action: ActionType) => {
  if (action.type === types.SET_INIT_PARAMS) {
    return { ...state, ...action.data };
  } else {
    return state;
  }
};

export const cashflowGridEvent = (state: any = {}, action: ActionType) => {
  if (action.type === types.SET_CASHFLOW_GRID_EVENT) {
    return action.data;
  } else {
    return state;
  }
};

export const cashflowList = (state: any = {}, action: ActionType) => {
  if (action.type === types.SET_CASHFLOW_LIST) {
    return action.data;
  } else {
    return state;
  }
};

export const cashflowListQueryStatus = (
  state: RootState["cashflowListQueryStatus"] = Promise.resolve(true),
  action: ActionType
) => {
  if (action.type === types.SET_CASHFLOW_LIST_QUERY_STATUS) {
    return action.data;
  } else {
    return state;
  }
};

export const switchSearch = (state: any = {}, action: ActionType) => {
  if (action.type === types.ACTION_TYPE_SWITCH_SEARCH) {
    return action.data;
  } else {
    return state;
  }
};

export const searchFilters = (state: any = {}, action: ActionType) => {
  if (action.type === types.ACTION_TYPE_SET_SEARCH_FILTERS) {
    return action.data;
  } else {
    return state;
  }
};

export const quickFilters = (state: any = {}, action: ActionType) => {
  if (action.type === types.ACTION_TYPE_SET_QUICK_FILTERS) {
    return action.data;
  } else {
    return state;
  }
};

export const advancedSearch = (
  state: RootState["advancedSearch"] = {
    appliedFilter: null,
  },
  action: ActionType
) => {
  if (action.type === types.ACTION_TYPE_SET_ADVANCED_SEARCH) {
    return action.data;
  } else {
    return state;
  }
};

export const cashflowListPagination = (
  state: RootState["cashflowListPagination"] = {
    totalHits: 0,
    lastPage: false,
    pageSize: 50,
    pageNo: 0,
  },
  action: ActionType
) => {
  if (action.type === types.SET_CASHFLOW_LIST_PAGINATION) {
    return action.data;
  } else {
    return state;
  }
};

export const holdWorkflow = (state: any = {}, action: ActionType) => {
  if (action.type === types.HOLD_WORKFLOW) {
    return action.data;
  } else {
    return state;
  }
};

export const earlyMaterializationWorkflow = (
  state: RootState["earlyMaterializationWorkflow"] = {
    isOpenDialog: false,
    action: "",
  },
  action: ActionType
) => {
  if (action.type === types.EARLY_MATERIALIZATION_WORKFLOW) {
    return action.data;
  } else {
    return state;
  }
};
export const commonCommentActionWorkflow = (
  state: RootState["commonCommentActionWorkflow"] = {
    isOpenDialog: false,
  },
  action: ActionType
) => {
  if (action.type === types.COMMON_COMMENT_ACTION_WORKFLOW) {
    return action.data;
  } else {
    return state;
  }
};
export const suppressWorkflow = (
  state: RootState["suppressWorkflow"] = {
    isOpenDialog: false,
  },
  action: ActionType
) => {
  if (action.type === types.SUPPRESS_WORKFLOW) {
    return action.data;
  } else {
    return state;
  }
};

export const dialogRefreshAlert = (
  state: RootState["dialogRefreshAlert"] = {
    showAlert: false,
    onClickRefresh: () => {},
  },
  action: ActionType
) => {
  if (action.type === types.SET_DIALOG_REFRESH_ALERT) {
    return action.data;
  } else {
    return state;
  }
};

export const latestNotificationStack = (
  state: RootState["latestNotificationStack"] = { id: "", pool: [] },
  action: ActionType
) => {
  if (action.type === types.LATEST_NOTIFICATION_STACK) {
    return action.data;
  } else {
    return state;
  }
};

export const cashflowListQueryId = (
  state: RootState["cashflowListQueryId"] = 0,
  action: ActionType
) => {
  if (action.type === types.CASHFLOW_LIST_QUERY_ID) {
    return action.data;
  } else {
    return state;
  }
};

export const isLoadingNextPage = (
  state: boolean = false,
  action: ActionType
) => {
  if (action.type === types.LOAD_NEXT_PAGE) {
    return action.data;
  } else {
    return state;
  }
};

export const cashflowListQueryPageSize = (
  state: RootState["cashflowListQueryPageSize"] = PAGE_SIZE_FOR_CASHFLOW,
  action: ActionType
) => {
  if (action.type === types.CASHFLOW_LIST_QUERY_PAGE_SIZE) {
    return action.data;
  } else {
    return state;
  }
};

export const manualSettleWorkflow = (
  state: RootState["manualSettleWorkflow"] = {
    isOpenDialog: false,
    data: [],
    role: SettleUserType.Maker,
  },
  action: ActionType
) => {
  if (action.type === types.MANUAL_SETTLE_WORKFLOW) {
    return action.data;
  } else {
    return state;
  }
};

export const opensearch = (state: boolean = false, action: ActionType) => {
  if (action.type === types.OPENSEARCH) {
    return action.data;
  } else {
    return state;
  }
};
