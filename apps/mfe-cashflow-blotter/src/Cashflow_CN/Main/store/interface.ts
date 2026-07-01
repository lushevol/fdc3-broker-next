import { GridReadyEvent } from "ag-grid-community";
import { RuleGroupType } from "react-querybuilder";
import { FilterRecord } from "src/Cashflow_CN/components/AdvancedSearch/types";
import { BulkUserType } from "src/Cashflow_CN/components/BulkFixExceptions/type";
import { NotifiedCashflow } from "src/Cashflow_CN/components/CashflowNotification/CashflowNotificationSubscriber/interface";
import { ToBeNettedCashflowRequest } from "src/Cashflow_CN/components/NettingPreview/common/interface";

import { ActionType as FailedActionType } from "../workflow/failed/interface";
import { SettleUserType } from "../workflow/manualSettle/interface";
import { NetType } from "../workflow/netCashflow/netCashflowRightMenu";
import {
  RoundingType,
  SplitActionType,
  SplitRowIndexType,
  SplittingTargetCashflowType,
  SplitValidationArrItem,
} from "../workflow/splitting/common/interface";
import { ActionType } from "../workflow/swiftSuppress/interface";

export interface FilterItem {
  field: string;
  operator: string;
  values: string | number | string[];
}

export interface RatanPagination {
  lastPage: boolean;
  totalHits: number;
  pageNo: number;
  pageSize: number;
}

export interface RootState {
  //init param from container
  initParams?: Record<string, any>;
  // cashflow list aggrid handler
  cashflowGridEvent:
    | GridReadyEvent
    | {
        api: undefined;
      };
  // cashflow list data
  cashflowList: any[];
  // cashflow list query page size, can be changed by user
  cashflowListQueryPageSize: number;
  // only one query id valid for time, older query should be deprecated.
  cashflowListQueryId: number;
  // indicate whether cashflowList query is finished. true: success, false: failed.
  cashflowListQueryStatus: Promise<boolean>;
  // cashflow list pagination
  cashflowListPagination: RatanPagination;
  queryCount: Pick<RatanPagination, "totalHits">;
  latestNotificationStack: {
    id: string;
    pool: NotifiedCashflow[];
  };

  // quick search
  quickSearch: {};

  // show or hide search section
  showCashflowSearchBar: boolean;

  netWorkflow: {
    isNetCashflowDialogVisible: boolean;
    previewGridReadyEvent?: GridReadyEvent;
    sourceGridReadyEvent?: GridReadyEvent;
    nettingStatus: "INIT" | "ERROR" | "FINISHED";
    data: ToBeNettedCashflowRequest;
    netType: NetType;
  };

  unNetWorkflow: {
    isOpenComponentCashflow: boolean;
    isVerify: boolean;
    data: any;
  };

  splittingWorkflow: {
    splitStatus: "INIT" | "ERROR" | "FINISHED";
    isOpenSplittingDialog: boolean;
    isOpenLookUpSSIDialog: boolean;
    targetRowIndex: SplitRowIndexType;
    isChildCashflowDialogVisible?: boolean;
    sourceCashflow: CNCashflow | null;
    targetCashflows: SplittingTargetCashflowType;
    initialTargetCashflows: CNCashflow[] | null;
    amountSetting: {
      precision: number;
      type: RoundingType;
    } | null;
    splitAction: SplitActionType;
  };

  splittingValidation: {
    isValid: boolean;
    message: string | null;
    validationArr: SplitValidationArrItem[];
  };

  viewCashflowDetailsWorkflow: {
    isOpenCashflowDetails: boolean;
    defaultTabKey: string;
    data: any;
    refreshCashflow?: () => Promise<any>;
  };

  viewTradeDetailsWorkflow: {
    isOpenTradeDetails: boolean;
    data: any;
  };

  holdWorkflow: {
    isOpenHold: boolean;
    data: any;
    action: string;
  };

  earlyMaterializationWorkflow: {
    isOpenDialog: boolean;
    action: string;
    data?: CNCashflow[];
  };

  commonCommentActionWorkflow: {
    isOpenDialog: boolean;
    data?: CNCashflow[];
    action?: FailedActionType;
  };

  suppressWorkflow: {
    isOpenDialog: boolean;
    data?: CNCashflow[];
    action?: ActionType;
  };

  manualSettleWorkflow: {
    isOpenDialog: boolean;
    data: CNCashflow[];
    role: SettleUserType;
  };

  // cashflow list query filters
  searchFilters: RuleGroupType;
  quickFilters: RuleGroupType;
  advancedSearch: {
    appliedFilter: FilterRecord | null;
  };
  switchSearch: string;

  // cashflow notification level2 alert
  dialogRefreshAlert: {
    showAlert: boolean;
    onClickRefresh: (actions: string[]) => void;
  };

  // bulk fix exceptions
  bulkFixExceptions: {
    isOpenDialog: boolean;
    cashflowsReadyToFix: CNCashflow[];
    userType: BulkUserType;
  };
  isLoadingNextPage: boolean;

  opensearch: boolean;

  // Settlement Method Update
  settlementMethodUpdateWorkflow: {
    isOpenDialog: boolean;
    cashflowData: CNCashflow[];
    cashflowDataByTrade: CNCashflow[];
  };
}
