import {
  configureStore,
  createAction,
  createReducer,
  Dispatch,
} from "@reduxjs/toolkit";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  getBusinessFieldsFromCache,
} from "Import/ratanutils";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import ratanConfig from "src/Cashflow_CN/Main/config/ratanConfig";
import { CASHFLOW_BLOTTER_QUICK_SEARCH_CLEAR_BTN, CASHFLOW_BLOTTER_QUICK_SEARCH_SEARCH_BTN } from "src/Root/analysis/const";

import QuickSearch from "./index";

beforeAll(() => {
  Object.defineProperty(window, "ratanConfig", {
    value: {
      cashflow: {
        quickSearchItemsCN: [
          {
            label: "Cashflow ID",
            field: "Cashflow.Cashflow_Id",
            component: "QuickSearchInput",
            placeholder: "Multiple searches separated by commas",
          },
          {
            component: "QuickSearchManyInOne",
            manyInOne: [
              {
                label: "Trade ID",
                field: "Trade_Id",
                component: "QuickSearchInput",
                disableLabel: true,
              },
              {
                label: "Original Trade ID",
                field: "BCS_Parent_Trade_Id",
                component: "QuickSearchInput",
              },
            ],
          },
        ],
      },
    },
    writable: true,
  });
  window.performance.mark = jest.fn();
});

jest.mock("../../Main/store/actions", () => {
  const queryCashflowList = jest
    .fn()
    .mockImplementation(
      (
        filters: any,
        searchName: string,
        isRefresh: boolean,
        callback: Function
      ) => {
        callback?.(true);
        return (dispatch: Dispatch, getState: Function) => {
          return () => { };
        };
      }
    );

  return {
    __esModule: true,
    queryCashflowList,
  };
});

jest.mock("Import/ratancomponents", () => {
  const DynamickFieldLabel = (props) => {
    const { children } = props;
    return <section>{children}</section>;
  };
  const ItemsComponent = (props) => {
    const { onChange, config, filter } = props;
    const fakeOnchange = (e) => {
      onChange(config.field, e.target.value);
    };
    return (
      <div>
        <span>{config.label}</span>
        <input
          title="test"
          placeholder="test"
          data-testid={config.field}
          onChange={fakeOnchange}
          value={filter[config.field]}
        />
      </div>
    );
  };
  return {
    DynamickFieldLabel,
    ItemsComponent,
  };
});

describe("QuickSearch component", () => {
  it("should be in the document", async () => {
    //@ts-ignore
    jest.replaceProperty(ratanConfig, "cashflow", {
      quickSearchItemsCN: [
        {
          label: "Cashflow ID",
          field: "Cashflow.Cashflow_Id",
          component: "QuickSearchInput",
          placeholder: "Multiple searches separated by commas",
        },
        {
          component: "QuickSearchManyInOne",
          manyInOne: [
            {
              label: "Trade ID",
              field: "Trade_Id",
              component: "QuickSearchInput",
              disableLabel: true,
            },
            {
              label: "Original Trade ID",
              field: "BCS_Parent_Trade_Id",
              component: "QuickSearchInput",
            },
          ],
          disabled: true,
        },
        {
          label: "Product Taxonomy",
          field: "PRODUCT_TAXONOMY",
          component: "QuickSearchSelect",
          selectMode: "tags",
          valueList: [
            {
              label: "ForeignExchange:Forward",
              value: "Instrument_Common.ISDA_Taxonomy/_/ForeignExchange:Forward",
            },
            {
              label: "NO_PREFIX",
              value: "NO_PREFIX",
            },
          ]
        }
      ],
    });
    const store = configureStore({
      reducer: {
        initParams: createReducer({}, (builder) => {
          builder.addCase(
            createAction<Record<string, string>>("SET_INIT_PARAMS"),
            (state, action) => action.payload
          );
        }),
        switchSearch: createReducer("", (builder) => {
          builder.addCase(
            createAction<string>("ACTION_TYPE_SWITCH_SEARCH"),
            (state, action) => action.payload
          );
        }),
      },
      middleware: [thunk],
      preloadedState: {
        switchSearch: "",
        initParams: { cashflowId: "1234" },
      },
    });
    const promise = Promise.resolve(
      (dispatch: Dispatch, getState: Function) => {
        return () => { };
      }
    );
    const { getByTestId } = render(
      <Provider store={store}>
        <QuickSearch />
      </Provider>
    );
    const cashflowIdInput = getByTestId("Cashflow.Cashflow_Id");
    const searchBtn = getByTestId(CASHFLOW_BLOTTER_QUICK_SEARCH_SEARCH_BTN);
    const clearBtn = getByTestId(CASHFLOW_BLOTTER_QUICK_SEARCH_CLEAR_BTN);
    expect(cashflowIdInput).toBeInTheDocument();
    expect(clearBtn).toBeDisabled();
    expect(searchBtn).toBeDisabled();

    userEvent.type(cashflowIdInput, "1");
    expect(searchBtn).toBeVisible();
    fireEvent.click(searchBtn);
    await act(async () => {
      await promise;
    });

    expect(screen.findByText("Search success")).toBeInTheDocument;

    expect(clearBtn).toBeVisible();
    fireEvent.click(clearBtn);
  });


  it("without initParams", async () => {
    //@ts-ignore
    jest.replaceProperty(ratanConfig, "cashflow", {
      quickSearchItemsCN: [
        {
          label: "Cashflow ID",
          field: "Cashflow.Cashflow_Id",
          component: "QuickSearchInput",
          placeholder: "Multiple searches separated by commas",
        },
        {
          component: "QuickSearchManyInOne",
          manyInOne: [
            {
              label: "Trade ID",
              field: "Trade_Id",
              component: "QuickSearchInput",
              disableLabel: true,
            },
            {
              label: "Original Trade ID",
              field: "BCS_Parent_Trade_Id",
              component: "QuickSearchInput",
            },
          ],
          disabled: true,
        },
      ],
    });
    const store = configureStore({
      reducer: {
        initParams: createReducer({}, (builder) => {
          builder.addCase(
            createAction<Record<string, string>>("SET_INIT_PARAMS"),
            (state, action) => action.payload
          );
        }),
        switchSearch: createReducer("searchSection", (builder) => {
          builder.addCase(
            createAction<string>("ACTION_TYPE_SWITCH_SEARCH"),
            (state, action) => action.payload
          );
        }),
      },
      middleware: [thunk],
      preloadedState: {
        switchSearch: "searchSection",
        initParams: {},
      },
    });
    const promise = Promise.resolve(
      (dispatch: Dispatch, getState: Function) => {
        return () => { };
      }
    );
    const { getByTestId } = render(
      <Provider store={store}>
        <QuickSearch />
      </Provider>
    );
    const cashflowIdInput = getByTestId("Cashflow.Cashflow_Id");
    const searchBtn = getByTestId(CASHFLOW_BLOTTER_QUICK_SEARCH_SEARCH_BTN);
    const clearBtn = getByTestId(CASHFLOW_BLOTTER_QUICK_SEARCH_CLEAR_BTN);


    userEvent.type(cashflowIdInput, "1");
    expect(searchBtn).toBeVisible();
    fireEvent.click(searchBtn);
    await act(async () => {
      await promise;
    });

    expect(screen.findByText("Search success")).toBeInTheDocument;

    expect(clearBtn).toBeVisible();
    fireEvent.click(clearBtn);
  });

  it("should show error when VD_Default_Query enabled and date range > 1 month", async () => {
    //@ts-ignore
    jest.replaceProperty(ratanConfig, "cashflow", {
      quickSearchItemsCN: [
        {
          label: "Cashflow ID",
          field: "Cashflow.Cashflow_Id",
          component: "QuickSearchInput",
          placeholder: "Multiple searches separated by commas",
        },
        {
          component: "QuickSearchManyInOne",
          manyInOne: [
            {
              label: "Trade ID",
              field: "Trade_Id",
              component: "QuickSearchInput",
              disableLabel: true,
            },
            {
              label: "Original Trade ID",
              field: "BCS_Parent_Trade_Id",
              component: "QuickSearchInput",
            },
          ],
          disabled: true,
        },
      ],
    });
    const store = configureStore({
      reducer: {
        initParams: createReducer({}, (builder) => {
          builder.addCase(
            createAction<Record<string, string>>("SET_INIT_PARAMS"),
            (state, action) => action.payload
          );
        }),
        switchSearch: createReducer("searchSection", (builder) => {
          builder.addCase(
            createAction<string>("ACTION_TYPE_SWITCH_SEARCH"),
            (state, action) => action.payload
          );
        }),
      },
      middleware: [thunk],
      preloadedState: {
        switchSearch: "searchSection",
        initParams: {},
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <QuickSearch />
      </Provider>
    );

    userEvent.type(getByTestId("Cashflow.Cashflow_Id"), "1");
    const searchBtn = getByTestId(CASHFLOW_BLOTTER_QUICK_SEARCH_SEARCH_BTN);

    fireEvent.click(searchBtn);

    expect(screen).toBeDefined();
  });

  it("should update Cashflow State valueList in config when getBusinessFieldsFromCache returns string array", async () => {
        //@ts-ignore
    jest.replaceProperty(ratanConfig, "cashflow", {
      quickSearchItemsCN: [
        {
          label: "Cashflow ID",
          field: "Cashflow.Cashflow_Id",
          component: "QuickSearchInput",
          placeholder: "Multiple searches separated by commas",
        },
        {
          label: "Cashflow State",
          field: "Cashflow.Cashflow_State",
          component: "QuickSearchSelect",
          valueList: [],
        },
      ],
    });
    const store = configureStore({
      reducer: {
        initParams: createReducer({}, (builder) => {
          builder.addCase(
            createAction<Record<string, string>>("SET_INIT_PARAMS"),
            (state, action) => action.payload
          );
        }),
        switchSearch: createReducer("", (builder) => {
          builder.addCase(
            createAction<string>("ACTION_TYPE_SWITCH_SEARCH"),
            (state, action) => action.payload
          );
        }),
      },
      middleware: [thunk],
      preloadedState: {
        switchSearch: "",
        initParams: { cashflowId: "1234" },
      },
    });
    const promise = Promise.resolve({
      cashflowFields: [],
      cashflowAndTradeFields: [{indexedTerm: "Cashflow.Cashflow_State",valueList:"['WAITING']" }],
    });
    jest
      .mocked(getBusinessFieldsFromCache)
      .mockImplementation((workspace, customField) => {
        return promise;
      });


    const { getByTestId, getByText } = render(<Provider store={store}>
      <QuickSearch />
    </Provider>);

    await act(async () => {
      await promise;
    });

    const cashflowState = getByText("Cashflow State");
    expect(cashflowState).toBeInTheDocument();
  });

});
