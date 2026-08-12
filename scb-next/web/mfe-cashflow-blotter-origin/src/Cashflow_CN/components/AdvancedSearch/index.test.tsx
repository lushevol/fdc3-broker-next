import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { advancedSearchAction } from "src/Cashflow_CN/Main/store/actions";
import { AdvancedSearch, hydrate } from "src/Root/import/ratancomponents";

import { NewFilterBuilder } from "./index";

vi.mock("src/Root/import/ratancomponents", () => {
  const AdvancedSearch = vi.fn();
  const hydrate = vi.fn();
  return {
    __esModule: true,
    AdvancedSearch,
    MuiDialog: (props) => {
      const {
        children,
        destoryWhenHidden,
        open,
        onClose,
        testId = "mui-dialog",
        ...rest
      } = props;
      return (
        <section
          {...rest}
          open={true}
          data-testid={testId}
        >
          <button data-testid="MuiDialog-close-btn" onClick={onClose} />
          {children}
          {props.actions && <div>{props.actions}</div>}
        </section>
      );
    },
    hydrate
  };
});

vi.mock("src/Cashflow_CN/Main/store/actions", () => {
  const mockAction = () => {
    return {
      type: "MOCK_ACTION",
      payload: null,
    };
  };
  return {
    advancedSearchAction: vi.fn(mockAction),
  };
});
describe("CashflowDataGrid component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("default render", async () => {
    const advancedSearch = {
      appliedFilter: null,
    };
    const store = configureStore({
      reducer: {
        advancedSearch: createReducer(advancedSearch, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
      preloadedState: {
        advancedSearch: advancedSearch,
      },
    });
    let SelectCalled = 0;
    vi.mocked(AdvancedSearch).mockImplementation((props) => {
      const {
        setAppliedFilter,
        queryFilterList,
        queryFilterDetails,
        createFilter,
        saveFilter,
        deleteFilter,
      } = props;
      const filterRecord = {
        rowKey: "e5afa913-5188-4402-8085-602d3f60a043",
        name: "LS",
        body: '{"rules":[{"field":"Cashflow.Payment_Amount","value":"100","operator":"="},{"field":"Cashflow.Is_Adhoc_Net","value":"true","operator":"="},{"field":"Cashflow.Payment_Currency","value":"EUR","operator":"="},{"field":"Cashflow.Booking_System_Event","value":"7","operator":"="}],"combinator":"and"}',
        owner: "1639796",
        type: "STRATEGIC_CASHFLOW_FILTER_BUILDER",
        isPublic: false,
      };
      if (SelectCalled == 0) {
        SelectCalled++;
        setAppliedFilter?.(filterRecord);
        queryFilterList?.();
        queryFilterDetails?.(filterRecord);
        createFilter?.(filterRecord)?.catch(() => { });
        saveFilter?.(filterRecord)?.catch(() => { });
        deleteFilter?.(filterRecord);
      }
      return <section data-testid="advanced-search">{props.children}</section>;
    });

            vi.spyOn(require("src/Root/import/ratancomponents"), "hydrate").mockReturnValue({
        rules: [
          {
            field: "Country",
            value: "CHINA",
            operator: "=",
          },
          {
            field: "Entity.Counterparty_Client_Type",
            value: "BANK",
            operator: "=",
          },
          {
            field: "Cashflow.Cashflow_State",
            value: "PROJECTED",
            operator: "=",
          },
        ],
        combinator: "and",
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <NewFilterBuilder />
      </Provider>
    );
    const selectFilter = getByTestId("advanced-search");
    expect(selectFilter).toBeDefined();
    const mockedAdvancedSearchAction = advancedSearchAction as vi.Mock;

    expect(mockedAdvancedSearchAction).not.toBeCalled();

    expect(advancedSearchAction).not.toBeCalled();
  });

  it("contains all mandatory fields", async () => {
    const advancedSearch = {
      appliedFilter: null,
    };
    const store = configureStore({
      reducer: {
        advancedSearch: createReducer(advancedSearch, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
      preloadedState: {
        advancedSearch: advancedSearch,
      },
    });
    let SelectCalled = 0;

        vi.spyOn(require("src/Root/import/ratancomponents"), "hydrate").mockReturnValue({
      rules: [
        { field: "Cashflow.Payment_Date", value: "20250202", operator: "=" },
        { field: "Entity.Booking_Entity_SCI_FMID", value: "test2", operator: "=" },
        { field: "Cashflow.Cashflow_State", value: "WAITING", operator: "=" }
      ],
      combinator: "and"
    });

    vi.mocked(AdvancedSearch).mockImplementation((props) => {
      const {
        setAppliedFilter,
        queryFilterList,
        queryFilterDetails,
        createFilter,
        saveFilter,
        deleteFilter,
      } = props;
      const filterRecord = {
        rowKey: "e5afa913-5188-4402-8085-602d3f60a043",
        name: "LS",
        body: '{"rules":[{"field":"Cashflow.Payment_Date","value":"2026-02-02","operator":"="},{"field":"Entity.Booking_Entity_SCI_FMID","value":"test123","operator":"="},{"field":"Cashflow.Cashflow_State","value":"WAITING","operator":"="}],"combinator":"and"}',
        owner: "1639796",
        type: "STRATEGIC_CASHFLOW_FILTER_BUILDER",
        isPublic: false,
      };
      if (SelectCalled == 0) {
        SelectCalled++;
        setAppliedFilter?.(filterRecord);
        queryFilterList?.();
        queryFilterDetails?.(filterRecord);
        createFilter?.(filterRecord)?.catch(() => { });
        saveFilter?.(filterRecord)?.catch(() => { });
        deleteFilter?.(filterRecord);
      }
      return <section data-testid="advanced-search">{props.children}</section>;
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <NewFilterBuilder />
      </Provider>
    );
    const selectFilter = getByTestId("advanced-search");
    expect(selectFilter).toBeDefined();
    expect(advancedSearchAction).toHaveBeenCalled();
  });
});
