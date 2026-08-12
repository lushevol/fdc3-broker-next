import {
  RoundingType,
  SplitActionType,
} from "../../workflow/splitting/common/interface";
import { RootState } from "../interface";
import {
  netWorkflow,
  splittingValidation,
  splittingWorkflow,
  unNetWorkflow,
  viewCashflowDetailsWorkflow,
  viewTradeDetailsWorkflow} from "./workflowReducer";

describe("workflowReducer", () => {
  it("netWorkflow reducers", async () => {
    const action1 = {
      type: "UPDATE_NET_DATAGRID_DEF",
      data: { test: "updateNetDatagridDef" },
    };
    const updateNetDatagridDefReducer = netWorkflow({}, action1);
    expect(updateNetDatagridDefReducer).toBeDefined();

    const action2 = {
      type: "NET_CASHFLOW_FINISHED",
      data: { test: "netCashflowFinished" },
    };
    const netCashflowFinishedReducer = netWorkflow({}, action2);
    expect(netCashflowFinishedReducer).toBeDefined();

    const action3 = {
      type: "NET_WORKFLOW",
      data: "netWorkflow",
    };
    const netWorkflowReducer = netWorkflow({}, action3);
    expect(netWorkflowReducer).toBeDefined();
  });
  it("unNetWorkflow reducers", async () => {
    const action = {
      type: "UN_NET_WORKFLOW",
      data: "unNetWorkflow",
    };
    const unNetWorkflowReducer = unNetWorkflow({}, action);
    expect(unNetWorkflowReducer).toEqual("unNetWorkflow");
  });
  it("viewCashflowDetailsWorkflow reducers", async () => {
    const action = {
      type: "VIEW_CASHFLOW_DETAILS",
      data: { isOpenCashflowDetails: true, defaultTabKey: "1" },
    };
    const viewCashflowDetailsReducer = viewCashflowDetailsWorkflow({}, action);
    expect(viewCashflowDetailsReducer).toEqual(action.data);
  });
  it("viewTradeDetailsWorkflow reducers", async () => {
    const action = {
      type: "VIEW_TRADE_DETAILS",
      data: { isOpenTradeDetails: true, defaultTabKey: "1" },
    };
    const viewTradeDetailsReducer = viewTradeDetailsWorkflow({}, action);
    expect(viewTradeDetailsReducer).toEqual(action.data);
  });
});

describe("splittingWorkflow reducer", () => {
  const initialState: RootState["splittingWorkflow"] = {
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
  };

  it("should return initial state when state is undefined", () => {
    expect(splittingWorkflow(undefined, { type: "@@INIT" } as any)).toEqual(initialState);
  });

  it("should handle SPLITTING_WORKFLOW action", () => {
    const action = {
      type: "SPLITTING_WORKFLOW",
      data: { ...initialState, splitStatus: "UPDATED" },
    } as any;
    expect(splittingWorkflow(initialState, action)).toEqual({
      ...initialState,
      splitStatus: "UPDATED",
    });
  });
});
describe("splittingValidation reducer", () => {
  const initialState: RootState["splittingValidation"] = {
    isValid: true,
    message: null,
    validationArr: [],
  };

  it("should return initial state when state is undefined", () => {
    expect(splittingValidation(undefined, { type: "@@INIT" } as any)).toEqual(initialState);
  });

  it("should handle SPLITTING_VALIDATION action", () => {
    const action = {
      type: "SPLITTING_VALIDATION",
      data: { isValid: false, message: "error", validationArr: [{ rowId: 1 }] },
    } as any;
    expect(splittingValidation(initialState, action)).toEqual({
      isValid: false,
      message: "error",
      validationArr: [{ rowId: 1 }],
    });
  });
});