import {
  configureStore,
  createAction,
  createReducer,
  Dispatch,
} from "@reduxjs/toolkit";
import { act,fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getBusinessFieldsFromCache } from "Import/ratanutils";
import { RuleGroupType } from "react-querybuilder";
import { Provider } from "react-redux";
import { CASHFLOW_BLOTTER_QUICK_FILTER_CLEAR_ALL_BTN } from "src/Root/analysis/const";

import QuickFilters, { highlight, setFilterFields } from "./index";
import { classes } from "./style";

vi.mock("src/Cashflow_CN/services", () => {
  return {
    queryAllExceptionCodes: vi.fn(async () => []),
  }
});

const mockQueryCashflowListImpl = (callbackResult: boolean) =>
  (filters: any, searchName: string, isRefresh: boolean, callback: Function) => {
    callback?.(callbackResult);
    return (_dispatch: Dispatch, _getState: Function) => () => {};
  };

vi.mock("../../Main/store/actions", () => {
  const queryCashflowList = vi.fn().mockImplementation(
    (filters: any, searchName: string, isRefresh: boolean, callback: Function) => {
      callback?.(true);
      return (_dispatch: Dispatch, _getState: Function) => () => {};
    }
  );
  return {
    __esModule: true,
    queryCashflowList,
  };
});

vi.mock("../../Main/config/UIconfig", () => {
  const generate_STATIC_QUICK_FILTER_OPTIONS: () => MapType = () => ({
    dateHorizon: [
      { name: "Today", value: "today" },
      { name: "Tomorrow", value: "tomorrow" },
    ],
  });
  return {
    generate_STATIC_QUICK_FILTER_OPTIONS,
  };
});

describe("QuickFilters Component", () => {
  it("defalut render", async () => {
    const promise = Promise.resolve({
      cashflowFields: [],
      cashflowAndTradeFields: [
        {
          indexedTerm: "Entity.Booking_Entity_SCI_FMID",
          businessTerm: "Booking Entity FMID",
          dataType: "String",
          subSelection: "Entity",
          context:
            "CASHFLOW_DATA,CONFIRMATION_DATA,PRETRADE_DATA,TRANSACTION_DATA",
          displayStyle: "freeText",
          valueList: "",
          operators: "EQ",
          operatorsSupp: "==,!=,<IN>",
          detailsFixed: true,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 188,
          blotterContext: [
            "CONFIRMATION_DATA",
            "TRANSACTION_DATA",
            "CASHFLOW_DATA",
            "PRETRADE_DATA",
          ],
          index: 22,
          colDefs: {
            width: 100,
            hide: false,
          },
        },
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
          index: 2,
          colDefs: {
            width: 110,
            hide: false,
          },
        },
        {
          indexedTerm: "Cashflow.Is_STP_RATAN",
          businessTerm: "",
          dataType: "Boolean",
          subSelection: "Cashflow",
          context: "CASHFLOW_DATA,RATAN_DATA",
          displayStyle: "dropdown",
          valueList: "['true','false']",
          operators: "EQ",
          operatorsSupp: "==,!=",
          detailsFixed: false,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 360,
          blotterContext: ["RATAN_DATA", "CASHFLOW_DATA"],
          index: 25,
          colDefs: {
            width: 70,
          },
        },
        {
          indexedTerm: "Instrument_Common.ISDA_Taxonomy",
          businessTerm: "",
          dataType: "String",
          subSelection: "Instrument_Common",
          context: "CASHFLOW_DATA,CONFIRMATION_DATA,TRANSACTION_DATA",
          displayStyle: "dropdown",
          valueList:
            "['ForeignExchange:Forward','ForeignExchange:Spot','ForeignExchange:Swap','ForeignExchange:VanillaOption','ForeignExchange:SimpleExotic:Digital','ForeignExchange:NDF','IRD|IRS|Structured Swap|FX_QUANTO_RA_DI','IRD|IRS|Vanilla IR Swap','IRD|IRS','CURR|FXD|FXD','IRD|LN_BR','IRD|CS','CURR|FXD|XSW','CRD|RTRS','COM|SWAP','IRD|BOND','SCF|SCF|SCF','CURR|OPT|SMP','CURR|OPT|ASN','Simple Cashflow (SCF)','InterestRate:IRSwap:FixedFloat','InterestRate:IRSwap:OIS','InterestRate:IRSwap:FloatFloat','InterestRate:IRSwap:Basis','InterestRate:CrossCurrency:FixedFloat','InterestRate:CrossCurrency:Basis','InterestRate:CrossCurrency:FloatFloat','InterestRate:CrossCurrency:FixedFixed','InterestRate:LoanDeposit','Credit:Loans:TermLoan','Credit:Loans:RevolvingTermLoan']",
          operators: "EQ",
          operatorsSupp: "==,!=,<IN>",
          detailsFixed: true,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 94,
          blotterContext: [
            "CONFIRMATION_DATA",
            "TRANSACTION_DATA",
            "CASHFLOW_DATA",
          ],
          colDefs: {
            width: 110,
          },
        },
        {
          indexedTerm: "Entity.Counterparty_SCI_BIC_Net_Flag",
          businessTerm: "",
          dataType: "String",
          subSelection: "Cashflow",
          context: "CASHFLOW_DATA",
          displayStyle: "textbox",
          valueList: "",
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
          index: 2,
          colDefs: {
            width: 110,
            hide: false,
          },
        },
      ],
    });
    const field = "Instrument_Common.ISDA_Taxonomy";
    const label = "";
    const quickFilters = {
      "combinator": "and",
      "rules": [
          {
            "field": "Cashflow_Cashflow_Id",
            "operator": "=",
            "value": "M00101913653"
          },
          {
            "field": "Cashflow_Cashflow_Version",
            "operator": "==",
            "value": "0"
          },
      ]
  }
    jest
      .mocked(getBusinessFieldsFromCache)
      .mockImplementation((workspace, customField) => {
        return promise;
      });
    const store = configureStore({
      reducer: {
        quickFilters: createReducer(quickFilters, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <QuickFilters />
      </Provider>
    );
    await act(async () => {
      await promise;
    });
    expect(getByTestId("quickFilterDays")).toBeInTheDocument();
    expect(getByTestId("quickFilterCashflowStatus")).toBeInTheDocument();
    expect(getByTestId("quickFilterBookingEntity")).toBeInTheDocument();
    expect(getByTestId("quickFilterSubStatus")).toBeInTheDocument();
    expect(getByTestId("quickFilterSubStatusType")).toBeInTheDocument();
    expect(getByTestId("quickFilterTaxonomy")).toBeInTheDocument();

    //Value Date Horizon
    const dateAutocomplete = screen.getByTestId("quickFilterDays");
    const dateInput = within(dateAutocomplete).getByRole('combobox');
    userEvent.click(dateInput);
    const option = await screen.findByText("Today");
    userEvent.click(option);
    expect(dateInput).toHaveValue('Today');

    //Cashflow State
    const stateAutocomplete = screen.getByTestId("quickFilterCashflowStatus");
    const stateInput = within(stateAutocomplete).getByRole('combobox');
    userEvent.click(stateInput);
    const option2 = await screen.findByText("PROJECTED");
    userEvent.click(option2);
    expect(stateInput).toBeInTheDocument();

    //Product Taxonomy
    const taxonomyAutocomplete = screen.getByTestId("quickFilterTaxonomy");
    const taxonomyInput = within(taxonomyAutocomplete).getByRole('combobox');
    userEvent.click(taxonomyInput);
    const option3 = await screen.findByText("ForeignExchange:Forward");
    userEvent.click(option3);
    expect(taxonomyInput).toHaveValue("ForeignExchange:Forward");

    //Booking Entity
    const bookingEntityAutocomplete = screen.getByTestId("quickFilterBookingEntity");
    const bookingEntityInput = within(bookingEntityAutocomplete).getByRole('combobox');
    userEvent.click(bookingEntityInput);
    const option4 = await screen.findByText("SCB SHANGH*SHA");
    userEvent.click(option4);
    expect(bookingEntityInput).toHaveValue('SCB SHANGH*SHA');

    //Bic Net Flag
    const bicNetAutocomplete = screen.getByTestId("quickFilterBicNet");
    const bicNetInput = within(bicNetAutocomplete).getByRole('combobox');
    userEvent.click(bicNetInput);
    const option6 = await screen.findByText("Y");
    userEvent.click(option6);
    expect(bicNetInput).toHaveValue("Y");

    const quickFilters1 = [
      { field: "Cashflow_Cashflow_Id", operator: "==", values: "M00101913653" },
      {
        field: "Cashflow_Cashflow_Version",
        operator: "==",
        values: "0",
      },
    ]; 
    //value is ""
    const newFields = setFilterFields(
      { field, value: "", label },
      quickFilters1
    );
    expect(newFields).toHaveLength(2);
    //Value is Array
    const newFields1 = setFilterFields(
      { field, value: ["InterestRate:IRSwap"], label },
      quickFilters1
    );
    expect(newFields1).toHaveLength(3);

    //filterFields is not taxnoxomy
    const field1 = "Cashflow.Cashflow_Sub_State";
    //value is ""
    const newFields2 = setFilterFields(
      { field1, value: "", label },
      quickFilters1
    );
    expect(newFields2).toHaveLength(2);
    //Value is Array
    const newFields3 = setFilterFields(
      { field1, value: ["today"], label },
      quickFilters1
    );
    expect(newFields3).toHaveLength(3);
  });
  
  it("clear All", async () => {
    const promise = Promise.resolve({
      cashflowFields: [],
      cashflowAndTradeFields: [
        {
          indexedTerm: "Entity.Booking_Entity_SCI_FMID",
          businessTerm: "Booking Entity FMID",
          dataType: "String",
          subSelection: "Entity",
          context:
            "CASHFLOW_DATA,CONFIRMATION_DATA,PRETRADE_DATA,TRANSACTION_DATA",
          displayStyle: "freeText",
          valueList: "",
          operators: "EQ",
          operatorsSupp: "==,!=,<IN>",
          detailsFixed: true,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 188,
          blotterContext: [
            "CONFIRMATION_DATA",
            "TRANSACTION_DATA",
            "CASHFLOW_DATA",
            "PRETRADE_DATA",
          ],
          index: 22,
          colDefs: {
            width: 100,
            hide: false,
          },
        },
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
          index: 2,
          colDefs: {
            width: 110,
            hide: false,
          },
        },
        {
          indexedTerm: "Cashflow.Is_STP_RATAN",
          businessTerm: "",
          dataType: "Boolean",
          subSelection: "Cashflow",
          context: "CASHFLOW_DATA,RATAN_DATA",
          displayStyle: "dropdown",
          valueList: "['true','false']",
          operators: "EQ",
          operatorsSupp: "==,!=",
          detailsFixed: false,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 360,
          blotterContext: ["RATAN_DATA", "CASHFLOW_DATA"],
          index: 25,
          colDefs: {
            width: 70,
          },
        },
        {
          indexedTerm: "Instrument_Common.ISDA_Taxonomy",
          businessTerm: "",
          dataType: "String",
          subSelection: "Instrument_Common",
          context: "CASHFLOW_DATA,CONFIRMATION_DATA,TRANSACTION_DATA",
          displayStyle: "dropdown",
          valueList:
            "['ForeignExchange:Forward','ForeignExchange:Spot','ForeignExchange:Swap','ForeignExchange:VanillaOption','ForeignExchange:SimpleExotic:Digital','ForeignExchange:NDF','IRD|IRS|Structured Swap|FX_QUANTO_RA_DI','IRD|IRS|Vanilla IR Swap','IRD|IRS','CURR|FXD|FXD','IRD|LN_BR','IRD|CS','CURR|FXD|XSW','CRD|RTRS','COM|SWAP','IRD|BOND','SCF|SCF|SCF','CURR|OPT|SMP','CURR|OPT|ASN','Simple Cashflow (SCF)','InterestRate:IRSwap:FixedFloat','InterestRate:IRSwap:OIS','InterestRate:IRSwap:FloatFloat','InterestRate:IRSwap:Basis','InterestRate:CrossCurrency:FixedFloat','InterestRate:CrossCurrency:Basis','InterestRate:CrossCurrency:FloatFloat','InterestRate:CrossCurrency:FixedFixed','InterestRate:LoanDeposit','Credit:Loans:TermLoan','Credit:Loans:RevolvingTermLoan']",
          operators: "EQ",
          operatorsSupp: "==,!=,<IN>",
          detailsFixed: true,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 94,
          blotterContext: [
            "CONFIRMATION_DATA",
            "TRANSACTION_DATA",
            "CASHFLOW_DATA",
          ],
          colDefs: {
            width: 110,
          },
        },
      ],
    });
    const quickFilters: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Cashflow_Cashflow_Id", operator: "=", value: "M00101913653" },
        {
          field: "Cashflow_Cashflow_Version",
          operator: "=",
          value: "0",
        },
        {
          field: "Cashflow.Payment_Date",
          operator: "=",
          value: "2025-06-12",
        },
      ]
    };
    jest
      .mocked(getBusinessFieldsFromCache)
      .mockImplementation((workspace, customField) => {
        return promise;
      });
    const store = configureStore({
      reducer: {
        quickFilters: createReducer(quickFilters, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <QuickFilters />
      </Provider>
    );
    await act(async () => {
      await promise;
    });
    //clearAll button
    const clearAllBtn = getByTestId(CASHFLOW_BLOTTER_QUICK_FILTER_CLEAR_ALL_BTN);
    expect(clearAllBtn).toBeInTheDocument();
    fireEvent.click(clearAllBtn);
  });
  
  it("clear All - case 2", async () => {
    const { queryCashflowList } = vi.requireMock("../../Main/store/actions");
    (queryCashflowList as vi.Mock).mockImplementation(mockQueryCashflowListImpl(false));
    const promise = Promise.resolve({
      cashflowFields: [],
      cashflowAndTradeFields: [
        {
          indexedTerm: "Entity.Booking_Entity_SCI_FMID",
          businessTerm: "Booking Entity FMID",
          dataType: "String",
          subSelection: "Entity",
          context:
            "CASHFLOW_DATA,CONFIRMATION_DATA,PRETRADE_DATA,TRANSACTION_DATA",
          displayStyle: "freeText",
          valueList: "",
          operators: "EQ",
          operatorsSupp: "==,!=,<IN>",
          detailsFixed: true,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 188,
          blotterContext: [
            "CONFIRMATION_DATA",
            "TRANSACTION_DATA",
            "CASHFLOW_DATA",
            "PRETRADE_DATA",
          ],
          index: 22,
          colDefs: {
            width: 100,
            hide: false,
          },
        },
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
          index: 2,
          colDefs: {
            width: 110,
            hide: false,
          },
        },
        {
          indexedTerm: "Cashflow.Is_STP_RATAN",
          businessTerm: "",
          dataType: "Boolean",
          subSelection: "Cashflow",
          context: "CASHFLOW_DATA,RATAN_DATA",
          displayStyle: "dropdown",
          valueList: "['true','false']",
          operators: "EQ",
          operatorsSupp: "==,!=",
          detailsFixed: false,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 360,
          blotterContext: ["RATAN_DATA", "CASHFLOW_DATA"],
          index: 25,
          colDefs: {
            width: 70,
          },
        },
        {
          indexedTerm: "Instrument_Common.ISDA_Taxonomy",
          businessTerm: "",
          dataType: "String",
          subSelection: "Instrument_Common",
          context: "CASHFLOW_DATA,CONFIRMATION_DATA,TRANSACTION_DATA",
          displayStyle: "dropdown",
          valueList:
            "['ForeignExchange:Forward','ForeignExchange:Spot','ForeignExchange:Swap','ForeignExchange:VanillaOption','ForeignExchange:SimpleExotic:Digital','ForeignExchange:NDF','IRD|IRS|Structured Swap|FX_QUANTO_RA_DI','IRD|IRS|Vanilla IR Swap','IRD|IRS','CURR|FXD|FXD','IRD|LN_BR','IRD|CS','CURR|FXD|XSW','CRD|RTRS','COM|SWAP','IRD|BOND','SCF|SCF|SCF','CURR|OPT|SMP','CURR|OPT|ASN','Simple Cashflow (SCF)','InterestRate:IRSwap:FixedFloat','InterestRate:IRSwap:OIS','InterestRate:IRSwap:FloatFloat','InterestRate:IRSwap:Basis','InterestRate:CrossCurrency:FixedFloat','InterestRate:CrossCurrency:Basis','InterestRate:CrossCurrency:FloatFloat','InterestRate:CrossCurrency:FixedFixed','InterestRate:LoanDeposit','Credit:Loans:TermLoan','Credit:Loans:RevolvingTermLoan']",
          operators: "EQ",
          operatorsSupp: "==,!=,<IN>",
          detailsFixed: true,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 94,
          blotterContext: [
            "CONFIRMATION_DATA",
            "TRANSACTION_DATA",
            "CASHFLOW_DATA",
          ],
          colDefs: {
            width: 110,
          },
        },
      ],
    });
    const quickFilters: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Cashflow_Cashflow_Id", operator: "=", value: "M00101913653" },
        {
          field: "Cashflow_Cashflow_Version",
          operator: "=",
          value: "0",
        },
      ]
    };
    jest
      .mocked(getBusinessFieldsFromCache)
      .mockImplementation((workspace, customField) => {
        return promise;
      });
    const store = configureStore({
      reducer: {
        quickFilters: createReducer(quickFilters, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <QuickFilters />
      </Provider>
    );
    await act(async () => {
      await promise;
    });
    //clearAll button
    const clearAllBtn = getByTestId(CASHFLOW_BLOTTER_QUICK_FILTER_CLEAR_ALL_BTN);
    expect(clearAllBtn).toBeInTheDocument();
    fireEvent.click(clearAllBtn);
  });
});

it("highlight", () => {
  expect(highlight(1)).toBe(classes.highlight);
});