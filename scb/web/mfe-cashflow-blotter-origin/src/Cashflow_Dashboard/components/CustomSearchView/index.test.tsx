import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "src/Cashflow_Dashboard/Main/store-redux";
import { AdvancedSearch } from "src/Root/import/ratancomponents";
import { getBusinessFieldsFromCache } from "src/Root/import/ratanutils";

import CustomSearchView from "./index";

afterAll(() => {
  jest.clearAllMocks();
});

jest.mock("src/Root/import/ratancomponents", () => {
  const AdvancedSearch = jest.fn();
  return {
    __esModule: true,
    AdvancedSearch,
    MuiDialog: jest.fn(),
    hydrate: jest.fn(() => {
      return {
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
      };
    }),
  };
});

describe("CustomSearchView component", () => {
  it("defalut render", async () => {
    jest.useFakeTimers();
    const promise = Promise.resolve({
      cashflowFields: [],
      cashflowAndTradeFields: [
        {
          indexedTerm: "Country",
          businessTerm: "",
          dataType: "String",
          subSelection: "Trade",
          context: "TRANSACTION_DATA",
          displayStyle: "dropdown",
          valueList: "['Undo','Update']",
          operators: "EQ",
          operatorsSupp: "==,!=,<IN>",
          detailsFixed: true,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 143,
          blotterContext: ["TRANSACTION_DATA"],
        },
        {
          indexedTerm: "Cashflow.Cashflow_Sub_State",
          businessTerm: "",
          dataType: "String",
          subSelection: "Trade",
          context: "TRANSACTION_DATA",
          displayStyle: "dropdown",
          valueList: "",
          operators: "EQ",
          operatorsSupp: "==,!=,<IN>",
          detailsFixed: true,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 143,
          blotterContext: ["TRANSACTION_DATA"],
        },
        {
          indexedTerm: "Action_Type",
          businessTerm: "",
          dataType: "String",
          subSelection: "Trade",
          context: "TRANSACTION_DATA",
          displayStyle: "dropdown",
          valueList: "['Undo','Update']",
          operators: "EQ",
          operatorsSupp: "==,!=,<IN>",
          detailsFixed: true,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 143,
          blotterContext: ["TRANSACTION_DATA"],
        },
      ],
    });
    jest
      .mocked(getBusinessFieldsFromCache)
      .mockImplementation((workspace, customField) => {
        return promise;
      });
    let SelectCalled = 0;
    jest.mocked(AdvancedSearch).mockImplementation((props) => {
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
        createFilter?.(filterRecord);
        saveFilter?.(filterRecord);
        deleteFilter?.(filterRecord);
      }
      return <section data-testid="advanced-search">{props.children}</section>;
    });
    const { getByTestId } = render(<Provider store={store}><CustomSearchView /></Provider>);
    const selectFilter = getByTestId("advanced-search");
    expect(selectFilter).toBeDefined();
  });
});
