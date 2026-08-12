import { configureStore, createAction,createReducer } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { GROUP_BLOTTER_QUICK_SEARCH_CLEAR_BTN, GROUP_BLOTTER_QUICK_SEARCH_SEARCH_BTN } from "src/Root/analysis/const";
import { getBusinessFieldsFromCache } from "src/Root/import/ratanutils";

import QuickSearch from "./index";

describe("Quick Search", () => {
  it("should be in the document", () => {
    vi.useFakeTimers();
    const promise = Promise.resolve({
      cashflowFields: [],
      cashflowAndTradeFields: [
        {
          indexedTerm: "Cashflow.Cashflow_State",
          businessTerm: "",
          dataType: "String",
          subSelection: "Cashflow",
          context: "CASHFLOW_DATA",
          displayStyle: "multiSelectDropdown",
          valueList:
            "['PROJECTED','QUEUED','WAITING','READY','HOLD','RELEASED','SETTLED','CASHFLOW_SUPPRESSED','SWIFT_SUPPRESSED','CANCELLED','ERROR','DEAD','NETTED','FAILED','NOSTROMATCH']",
          operators: "EQ",
          operatorsSupp: "==,!=,<IN>",
          detailsFixed: false,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 4,
          blotterContext: ["CASHFLOW_DATA"],
        },
      ],
    });
    jest
      .mocked(getBusinessFieldsFromCache)
      .mockImplementation((workspace, customField) => {
        return promise;
      });
    const store = configureStore({
      reducer: {        
        groupBlotter: createReducer({}, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <QuickSearch />
      </Provider>
    );
    const searchBtn = getByTestId(GROUP_BLOTTER_QUICK_SEARCH_SEARCH_BTN);
    expect(searchBtn).toBeInTheDocument();
    const clearBtn = getByTestId(GROUP_BLOTTER_QUICK_SEARCH_CLEAR_BTN);
    expect(clearBtn).toBeInTheDocument();
  });
});
