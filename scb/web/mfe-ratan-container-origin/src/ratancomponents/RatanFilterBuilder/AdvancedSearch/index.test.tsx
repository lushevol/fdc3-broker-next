import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, createReducer, createAction } from "@reduxjs/toolkit";
import AdvancedSearch from "./index";
import  StrategicCashflowBlotter from "../RatanOne/mocks/StrategicCashflowBlotter.json"
import { ADVANCED_SEARCH_ENTRY_CLEAR_BTN, ADVANCED_SEARCH_ENTRY_SETTING_BTN } from "../../../packages/Analysis/const";

afterAll(() => {
  jest.clearAllMocks();
});

describe("AdvancedSearch component", () => {
  it("should be in the document", async () => {
    const store = configureStore({
      reducer: {
        initParams: createReducer({}, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
    });
    const props = {
      type: "STRATEGIC_CASHFLOW_FILTER_BUILDER",
      fields: StrategicCashflowBlotter,
      appliedFilter: {
        rowKey: "07dfebfc-ca31-4fd9-9b32-ec63c8ff7a02",
        name: "Lu Shuai's Filter 1",
        body: '{"rules":[{"field":"Cashflow.Cashflow_State","value":"PROJECTED","operator":"="}],"combinator":"and"}',
        owner: "1639796",
        type: "STRATEGIC_CASHFLOW_FILTER_BUILDER",
        isPublic: false,
        creator: "1639796",
        assignee: "",
        assigneeList: "",
      },
      setAppliedFilter: jest.fn(async ()=> undefined),
      queryFilterList: jest.fn(),
      queryFilterDetails: jest.fn(),
      createFilter: jest.fn(),
      saveFilter: jest.fn(),
      deleteFilter: jest.fn(),
      getOperators: jest.fn(),
    };
    const {getByTestId} = render(
      <Provider store={store}>
        <AdvancedSearch {...props} />
      </Provider>
    );
    expect(screen).toBeDefined();

    const clearBtn = getByTestId(ADVANCED_SEARCH_ENTRY_CLEAR_BTN);
    expect(clearBtn).toBeDefined();
    const settingBtn = getByTestId(ADVANCED_SEARCH_ENTRY_SETTING_BTN);
    expect(settingBtn).toBeDefined();
  });
});
