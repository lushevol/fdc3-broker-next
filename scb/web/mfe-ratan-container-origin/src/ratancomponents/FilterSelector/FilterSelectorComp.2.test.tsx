import { render } from "@testing-library/react";
import FilterSelectorComp from "./filterSelectorComp";
import useController from "./useController";
import Select from "../../LazyAntd/Select";
import { getUser } from "../../ratanutils/authenticator";

jest.mock("./FilterBuilderNext", ()=> {
    return {
        FilterBuilderNext: jest.fn(() => <div>FilterBuilderNext</div>)
    }
})

jest.mock("../../ratanutils/componentEnabling", () => ({
  getEnable: jest.fn(() => {
    return true
  }),
}));
jest.mock("./useController");
jest.mock("../../LazyAntd/Select");
jest.mock("../../ratanutils/authenticator", ()=> {
  return {
    getUser: jest.fn()
  }
})
const props = {
    filterFieldType: "TRADE_FILTER_BUILDER",
    variableConfig: {
      date: ["DATE_VAR"]
    },
    bodyDefaultValue: [
        {
            "field": [
                "Entity",
                "Person",
                "Coverage_Marketer_PSID"
            ],
            "operator": "EQ",
            "values": "",
            "name": "TextInput"
        },
        {
            "field": [
                "Instrument_Common",
                "Contract_Code"
            ],
            "operator": "EQ",
            "values": "",
            "name": "TextInput"
        }
    ],
    CASCADER_OPTIONS: [
        {
            "label": "-- Add Filter --",
            "value": ""
        },
        {
            "label": "Data Flow",
            "value": "Data_Flow",
            "children": [
                {
                    "label": "Data Publication Date Time",
                    "value": "Data_Publication_Date_Time",
                    "context": "CASHBALANCE_DATA,CASHFLOW_DATA,COLLATERAL_DATA,CONFIRMATION_DATA,FIXING_DATA,INSTRUMENT_DATA,LEGAL_AGREEMENT_DATA,MARKET_DATA,PORTFOLIO_DATA,PRETRADE_DATA,SETTLEMENT_INSTRUCTION_DATA,TRANSACTION_DATA,VALUATION_DATA",
                    "blotterContext": [
                        "CONFIRMATION_DATA",
                        "INSTRUMENT_DATA",
                        "COLLATERAL_DATA",
                        "CASHFLOW_DATA",
                    ],
                    "type": "datePicker",
                    "operatorsSupp": "==,!=",
                    "valueList": "",
                    "indexedTerm": "Data_Flow.Data_Publication_Date_Time"
                },
                {
                    "label": "Data Publication Id",
                    "value": "Data_Publication_Id",
                    "context": "CASHBALANCE_DATA,CASHFLOW_DATA,CONFIRMATION_DATA,FIXING_DATA,TRANSACTION_DATA",
                    "blotterContext": [
                        "CONFIRMATION_DATA",
                        "TRANSACTION_DATA",
                        "CASHFLOW_DATA"
                    ],
                    "type": "freeText",
                    "operatorsSupp": "==,!=",
                    "valueList": "",
                    "indexedTerm": "Data_Flow.Data_Publication_Id"
                },
            ]
        }
    ],
    FILTER_FIELDS: [
        {
            "indexedTerm": "Data_Flow.Data_Publication_Id",
            "businessTerm": "",
            "dataType": "String",
            "subSelection": "Trade",
            "context": "CONFIRMATION_DATA,TRANSACTION_DATA",
            "displayStyle": "freeText",
            "valueList": "",
            "operators": "EQ",
            "operatorsSupp": "==,!=",
            "detailsFixed": true,
            "dynamicList": false,
            "disabledView": false,
            "disabledFilter": false,
            "scope": "{\"disabledBlotter\":[],\"enabledQueryResult\":[],\"version\":\"v1.0.0\"}",
            "detailsGroup": "",
            "seq": 1,
            "blotterContext": [
                "CONFIRMATION_DATA",
                "TRANSACTION_DATA"
            ],
            "colDefs": {
                "hide": false,
                "pinned": "right",
                "lockPinned": true
            }
        }
    ],
    switchSearch: "",
    searchFunction: jest.fn(),
    onSavedFilter: jest.fn(),
    onClosedFilter:jest.fn(),
};
describe("FilterBuilder component", () => {
  it("option logic", () => {
    const returnValue = {
        openBuilder: [],
        setOpenBuilder: jest.fn(),
        isLoading: false,
        messageApi: jest.fn(),
        messageContextHolder: jest.fn(),
        state: {},
        dispatch: jest.fn(),
        filterList: {
            "TRADE_FILTER_BUILDER": [
                {
                    "type": "TRADE_FILTER_BUILDER",
                    "name": "myROleOption",
                    "assigneeList": "TEST",
                    "moduleOwner": "TEST",
                    "rowKey": "myROleOption"
                },
                {
                  "type": "TRADE_FILTER_BUILDER",
                  "name": "assignToOption",
                  "assigneeList": "TEST",
                  "moduleOwner": "TEST_ROLE",
                  "rowKey": "assignToOption"
              }
            ]
        },
        currentFilter: [],
        clear: jest.fn(),
        changeFilter: jest.fn(),
        close: jest.fn(),
    };
    (Select as jest.Mock).mockImplementation((props)=>{
      return <div>Mocked Select{props.children}
        <div data-testid='select-option'>{JSON.stringify(props.options)}</div>

        <button type='button' data-testid='search-button'>Search</button>
      </div>;
    });
    (getUser as jest.Mock).mockImplementation(()=>{
      return {
        role: "TEST_ROLE",
        userId: "TEST_USER"
      }
    });

    (useController as jest.Mock).mockReturnValue(returnValue);
    const {debug, getAllByTestId} = render(<FilterSelectorComp {...props}/>);
    const exceptValue = [
      {"label":"My Role","options":[{"label":"myROleOption","value":"myROleOption"}]},
      {"label":"Assigned To","options":[{"label":"assignToOption - TEST","value":"assignToOption"}]}
    ]
    
    expect(getAllByTestId("select-option")[0].innerHTML).toEqual(JSON.stringify(exceptValue));
  })
});
