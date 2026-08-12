import {
  advancedSearch,
  cashflowGridEvent,
  cashflowListPagination,
  commonCommentActionWorkflow,
  earlyMaterializationWorkflow,
  holdWorkflow,
  initParams,
  latestNotificationStack,
  opensearch,
  searchFilters,
  switchSearch} from "./cashflowReducers";

describe("cashflowReducers", () => {
  it("defalut render", async () => {
    const state = {
      appliedFilter: null,
    };
    const action = { type: "ACTION_TYPE_SET_ADVANCED_SEARCH", data: "test" };
    const advancedSearchReducer = advancedSearch(state, action);
    expect(advancedSearchReducer).toEqual("test");
  });
  it("initParams reducers", async () => {
    const state = {};
    const action = { type: "SET_INIT_PARAMS", data: "" };
    const initParamsReducer = initParams(state, action);
    expect(initParamsReducer).toEqual({});
  });
  it("cashflowGridEvent reducers", async () => {
    const state = {};
    const action = {
      type: "SET_CASHFLOW_GRID_EVENT",
      data: "cashflowGridEvent",
    };
    const cashflowGridEventReducer = cashflowGridEvent(state, action);
    expect(cashflowGridEventReducer).toEqual("cashflowGridEvent");
  });
  it("switchSearch reducers", async () => {
    const state = {};
    const action = {
      type: "ACTION_TYPE_SWITCH_SEARCH",
      data: "cashflowGridEvent",
    };
    const switchSearchReducer = switchSearch(state, action);
    expect(switchSearchReducer).toEqual("cashflowGridEvent");
  });
  it("searchFilters reducers", async () => {
    const state = {};
    const action = {
      type: "ACTION_TYPE_SET_SEARCH_FILTERS",
      data: "searchFilters",
    };
    const searchFiltersReducer = searchFilters(state, action);
    expect(searchFiltersReducer).toEqual("searchFilters");
  });
  it("cashflowListPagination reducers", async () => {
    const state = {
      totalHits: 0,
      lastPage: false,
      pageSize: 50,
      pageNo: 0,
    };
    const action = {
      type: "SET_CASHFLOW_LIST_PAGINATION",
      data: "cashflowListPagination",
    };
    const cashflowListPaginationReducer = cashflowListPagination(state, action);
    expect(cashflowListPaginationReducer).toEqual("cashflowListPagination");
  });
  it("holdWorkflow reducers", async () => {
    const state = {};
    const action = {
      type: "HOLD_WORKFLOW",
      data: "holdWorkflow",
    };
    const holdWorkflowReducer = holdWorkflow(state, action);
    expect(holdWorkflowReducer).toEqual("holdWorkflow");
  });
  it("earlyMaterializationWorkflow reducers", async () => {
    const state = { isOpenDialog: false, action: "" };
    const action = {
      type: "EARLY_MATERIALIZATION_WORKFLOW",
      data: "earlyMaterializationWorkflow",
    };
    const earlyMaterializationWorkflowReducer = earlyMaterializationWorkflow(
      state,
      action
    );
    expect(earlyMaterializationWorkflowReducer).toEqual(
      "earlyMaterializationWorkflow"
    );
  });
  it("commonCommentActionWorkflow reducers", async () => {
    const state = { isOpenDialog: false };
    const action = {
      type: "COMMON_COMMENT_ACTION_WORKFLOW",
      data: "commonCommentActionWorkflow",
    };
    const commonCommentActionWorkflowReducer = commonCommentActionWorkflow(
      state,
      action
    );
    expect(commonCommentActionWorkflowReducer).toEqual(
      "commonCommentActionWorkflow"
    );
  });
  it("latestNotificationStack reducers", async () => {
    const state = { id: "", pool: [] };
    const action = {
      type: "LATEST_NOTIFICATION_STACK",
      data: "latestNotificationStack",
    };
    const latestNotificationStackReducer = latestNotificationStack(
      state,
      action
    );
    expect(latestNotificationStackReducer).toEqual("latestNotificationStack");
  });
  it("opensearch reducers", async () => {
    const state = false;
    const action = {
      type: "ACTION_TYPE_OPENSEARCH",
      data: false,
    };
    const opensearchReducer = opensearch(state, action);
    expect(opensearchReducer).toEqual(false);

    const state1 = true;
    const action1 = {
      type: "ACTION_TYPE_OPENSEARCH",
      data: "opensearch",
    };
    const opensearchReducer1 = opensearch(state1, action1);
    expect(opensearchReducer1).toEqual(true);
  });
});
