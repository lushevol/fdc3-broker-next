import { fireEvent, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "src/Cashflow_Dashboard/Main/store-redux";
import { DASHBOARD_QUICK_SEARCH_CLEAR_BTN, DASHBOARD_QUICK_SEARCH_SEARCH_BTN } from "src/Root/analysis/const";
import { getBusinessFieldsFromCache } from "src/Root/import/ratanutils";

import QuickSearch from "./index";

vi.mock("./const", async () => {
  return {
    countryOptions: [],
  }
});

vi.mock("antd", async () => {
  return {
    ...(await vi.importActual("antd")),
    Select: (props) => (
      <div>
        <button data-testid="test-change" onClick={props.onChange("test")}></button>
        {props.children}
      </div>
    )
  };
});

describe("Quick Search", () => {
  it("should be in the document", async () => {
    vi.useFakeTimers();
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
          valueList: "['CHINA']",
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
          indexedTerm: "Entity.Booking_Entity_SCI_FMID",
          businessTerm: "",
          dataType: "String",
          subSelection: "Cashflow",
          context: "TRANSACTION_DATA",
          displayStyle: "dropdown",
          valueList: "['FM1','FM2']",
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
          indexedTerm: "Other",
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
      ],
    });
    jest
      .mocked(getBusinessFieldsFromCache)
      .mockImplementation((workspace, customField) => {
        return promise;
      });

    const { queryByTestId, queryAllByTestId } = render(<Provider store={store}><QuickSearch /></Provider>);
    const searchBtn = queryByTestId(DASHBOARD_QUICK_SEARCH_SEARCH_BTN);
    expect(searchBtn).toBeInTheDocument();
    fireEvent.click(searchBtn!);
    const clearBtn = queryByTestId(DASHBOARD_QUICK_SEARCH_CLEAR_BTN);
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn!);

    const selects = queryAllByTestId("test-change");
    selects.forEach(s => fireEvent.click(s));
  });
});