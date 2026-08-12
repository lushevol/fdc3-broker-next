import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { mockAggridEvent } from "src/test/mockUtils/aggrid";

import { RootState } from "./interface";
import groupBlotterReducer, {
  setBlotterDatas,
  setBlotterGridEvent,
  setBlotterPagination,
  setQuickSearchCriteria,
  triggerSearch,
  updateBlotterDatas,
} from "./slice";

const createStore = () => {
  return configureStore({
    reducer: {
      groupBlotter: groupBlotterReducer,
    },
    middleware: [thunk],
  });
};

const gridEventPayload = mockAggridEvent;
const quickSearchPayload = {
  Status: "PENDING",
};
const blotterDatasPayload = [
  {
    Id: "7186224047519432704",
    Group_Id: "7186224047360049152",
    Trade_Id: "92038420",
    Major_Version: 1,
    Cashflow_Id: "M00101891741",
    Cashflow_Count: 3,
    Cashflow_Sequence: 2,
    Bussiness_Event: "New",
    Booking_System_Event: "ManualDeliver",
    Cashflow_Event_Reason: "NA",
    Status: "ERROR",
    Cashflow_Status: "PROJECTED",
    Group_Status: "COMPLETED",
    Group_Event: "NA",
    Is_Group_Locked: false,
    Create_At: "2024-04-17T04:48:46.515843",
    Update_At: "2024-04-19T06:59:31.126506028",
  },
];
const blotterPaginationPayload = {
  pageNo: 0,
  pageSize: 100,
  lastPage: false,
  totalHits: 26353,
};
const updatePayload = [
  {
    Id: "7186224047519432704",
    Group_Id: "7186224047360049152",
    Trade_Id: "92038420",
    Major_Version: 1,
    Cashflow_Id: "M00101891741",
    Cashflow_Count: 3,
    Cashflow_Sequence: 2,
    Bussiness_Event: "New",
    Booking_System_Event: "ManualDeliver",
    Cashflow_Event_Reason: "NA",
    Status: "WAITING",
    Cashflow_Status: "PROJECTED",
    Group_Status: "COMPLETED",
    Group_Event: "NA",
    Is_Group_Locked: false,
    Create_At: "2024-04-17T04:48:46.515843",
    Update_At: "2024-04-19T06:59:31.126506028",
  },
];

vi.mock("../../services/graphql", () => {
  return {
    queryGroupMessages: vi.fn(async () => ({
      groupMessages: {
        pageInfo: blotterPaginationPayload,
        results: []
      }
    })),
  }
})

describe("Group Blotter actions", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("setBlotterGridEvent", async () => {
    const store = createStore();
    const { dispatch, getState } = store;
    dispatch(setBlotterGridEvent(gridEventPayload));
    const groupBlotterState = getState().groupBlotter;
    expect(groupBlotterState.blotterGridEvent).toMatchObject(gridEventPayload);
  });
  it("setQuickSearchCriteria", async () => {
    const store = createStore();
    const { dispatch, getState } = store;
    dispatch(setQuickSearchCriteria(quickSearchPayload));
    const groupBlotterState = getState().groupBlotter;
    expect(groupBlotterState.quickSearch).toMatchObject(quickSearchPayload);
  });
  it("setBlotterDatas", async () => {
    const store = createStore();
    const { dispatch, getState } = store;
    dispatch(setBlotterDatas(blotterDatasPayload));
    const groupBlotterState = getState().groupBlotter;
    expect(groupBlotterState.blotterDatas).toHaveLength(1);
  });

  it("setBlotterPagination", async () => {
    const store = createStore();
    const { dispatch, getState } = store;
    dispatch(setBlotterPagination(blotterPaginationPayload));
    const groupBlotterState = getState().groupBlotter;
    expect(groupBlotterState.blotterPagination).toMatchObject(
      blotterPaginationPayload
    );
  });

  it("updateBlotterDatas", async () => {
    const store = createStore();
    const { dispatch, getState } = store;
    dispatch(setBlotterDatas(blotterDatasPayload));
    dispatch(updateBlotterDatas(updatePayload));
    const groupBlotterState = getState().groupBlotter;
    expect(groupBlotterState.blotterDatas).toHaveLength(1);
  });

  it("triggerSearch", async () => {
    const store = createStore();
    const payload = blotterPaginationPayload;
    const { dispatch, getState } = store;
    dispatch(setBlotterGridEvent(gridEventPayload));
    dispatch(setQuickSearchCriteria(quickSearchPayload));
    dispatch(setBlotterDatas(blotterDatasPayload));
    dispatch(setBlotterPagination(blotterPaginationPayload));
    const action = triggerSearch("initial");
    await action(dispatch, getState);
    const groupBlotterState = getState().groupBlotter;
    expect(groupBlotterState.blotterPagination).toMatchObject(payload);
  });

  it("triggerSearch - next", async () => {
    const store = createStore();
    const payload = blotterPaginationPayload;
    const { dispatch, getState } = store;
    dispatch(setBlotterGridEvent(gridEventPayload));
    dispatch(setQuickSearchCriteria(quickSearchPayload));
    dispatch(setBlotterDatas(blotterDatasPayload));
    dispatch(setBlotterPagination(blotterPaginationPayload));
    const action = triggerSearch("next");
    await action(dispatch, getState);
    const groupBlotterState = getState().groupBlotter;
    expect(groupBlotterState.blotterPagination).toMatchObject(payload);
  });
});
