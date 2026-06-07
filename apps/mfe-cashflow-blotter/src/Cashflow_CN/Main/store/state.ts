import { BulkUserType } from "src/Cashflow_CN/components/BulkFixExceptions/type";

import { PAGE_SIZE_FOR_CASHFLOW } from "../config/UIconfig";
import { SettleUserType } from "../workflow/manualSettle/interface";
import { NetType } from "../workflow/netCashflow/netCashflowRightMenu";
import {
  RoundingType,
  SplitActionType,
} from "../workflow/splitting/common/interface";
import { RootState } from "./interface";

// preload state object key must be same as reducer
const preloadState: RootState = {
  // cashflow
  cashflowGridEvent: {
    api: undefined,
  }, // Data grid ready event of cashflow page
  cashflowList: [],
  cashflowListQueryPageSize: PAGE_SIZE_FOR_CASHFLOW,
  cashflowListQueryId: 0,
  cashflowListQueryStatus: new Promise(() => {}),
  cashflowListPagination: {
    lastPage: true,
    totalHits: 0,
    pageNo: 0,
    pageSize: PAGE_SIZE_FOR_CASHFLOW,
  },
  queryCount: {
    totalHits: 0,
  },

  // id of stack, will refresh eachtime stack updates.
  latestNotificationStack: {
    id: "",
    pool: [],
  },

  showCashflowSearchBar: true,

  // quick search
  quickSearch: {},
  advancedSearch: {
    appliedFilter: null,
  },

  netWorkflow: {
    isNetCashflowDialogVisible: false,
    nettingStatus: "INIT",
    data: {
      requestParams: [],
    },
    netType: NetType.BilateralNetting,
  },
  unNetWorkflow: {
    isOpenComponentCashflow: false,
    isVerify: false,
    data: null,
  },
  splittingWorkflow: {
    splitStatus: "INIT",
    isOpenSplittingDialog: false,
    isOpenLookUpSSIDialog: false,
    targetRowIndex: null,
    isChildCashflowDialogVisible: false,
    sourceCashflow: {},
    targetCashflows: [],
    initialTargetCashflows: [],
    amountSetting: {
      precision: 2,
      type: RoundingType.ROUNDING_OFF,
    },
    splitAction: SplitActionType.COMPONENT_SPLIT,
  },
  splittingValidation: {
    isValid: true,
    message: null,
    validationArr: [],
  },
  viewCashflowDetailsWorkflow: {
    isOpenCashflowDetails: false,
    defaultTabKey: "1",
    data: null,
    refreshCashflow: async () => {},
  },
  viewTradeDetailsWorkflow: {
    isOpenTradeDetails: false,
    data: null,
  },
  holdWorkflow: {
    isOpenHold: false,
    data: null,
    action: "",
  },
  earlyMaterializationWorkflow: {
    isOpenDialog: false,
    action: "",
    data: undefined,
  },
  commonCommentActionWorkflow: {
    isOpenDialog: false,
    data: undefined,
  },
  suppressWorkflow: {
    isOpenDialog: false,
    data: undefined,
    action: undefined,
  },
  manualSettleWorkflow: {
    isOpenDialog: false,
    data: [],
    role: SettleUserType.Maker,
  },

  searchFilters: {
    combinator: "and",
    rules: [],
  },
  quickFilters: {
    combinator: "and",
    rules: [],
  },
  switchSearch: "init",
  dialogRefreshAlert: {
    showAlert: false,
    onClickRefresh: () => {},
  },

  bulkFixExceptions: {
    isOpenDialog: false,
    cashflowsReadyToFix: [],
    userType: BulkUserType.Maker,
  },
  isLoadingNextPage: false,
  opensearch: false,
  settlementMethodUpdateWorkflow: {
    isOpenDialog: false,
    cashflowData: [],
    cashflowDataByTrade: [],
  },
};
export default preloadState;
