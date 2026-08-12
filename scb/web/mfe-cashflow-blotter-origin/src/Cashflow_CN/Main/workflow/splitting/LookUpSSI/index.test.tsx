import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { mockCashflow1 } from "src/Cashflow_CN/test/mockData/cashflow";

import {
  SplitActionType,
} from "../common/interface";
import { SplitLookUpSSIComp } from "./index";

jest.mock("src/Cashflow_CN/services/graphql", () => {
  return {
    queryCashFlowDetails: jest.fn(async () => ({
      graphCashFlowDetails: {
        results: [],
      },
    })),
  };
});

describe("SplitLookUpSSIComp", () => {
  it("should render SplitLookUpSSIComp correctly and handle submit/reset", async () => {
    const initialState =
    {
      splitStatus: "INIT",
      isOpenSplittingDialog: true,
      isOpenLookUpSSIDialog: true,
      targetRowIndex: 1,
      isChildCashflowDialogVisible: true,
      sourceCashflow: mockCashflow1,
      targetCashflows: [mockCashflow1],
      initialTargetCashflows: [mockCashflow1],
      amountSetting: {
        precision: 2,
        type: 2,
      },
      splitAction: SplitActionType.AMEND_SPLIT
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer(initialState, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
      preloadedState: {
        splittingWorkflow: initialState,
      },
    });


    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <SplitLookUpSSIComp />
      </Provider>
    );

    expect(getByText("Vostro SI Information")).toBeInTheDocument();
    expect(getByText("Nostro SI Information")).toBeInTheDocument();


    jest.spyOn(require("./utils"), "validateSplitLookupSubmit").mockReturnValue({ valid: true, newTargetCashflows: mockCashflow1 })

    const submitBtn = getByText("Submit");
    expect(submitBtn).toBeInTheDocument();

    fireEvent.click(submitBtn);

    const resetBtn = getByTestId("look-up-ssi-reset-button");
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);
  });

  it("should render SplitLookUpSSIComp correctly and handle submit/reset", async () => {
    const initialState =
    {
      splitStatus: "INIT",
      isOpenSplittingDialog: true,
      isOpenLookUpSSIDialog: true,
      targetRowIndex: 1,
      isChildCashflowDialogVisible: true,
      sourceCashflow: mockCashflow1,
      targetCashflows: [mockCashflow1],
      initialTargetCashflows: [mockCashflow1],
      amountSetting: {
        precision: 2,
        type: 2,
      },
      splitAction: SplitActionType.AMEND_SPLIT
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer(initialState, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
      preloadedState: {
        splittingWorkflow: initialState,
      },
    });

    jest.mock("src/Cashflow_CN/components/CashflowDetails/MultiExceptions/hooks/useData", () => ({
      __esModule: true,
      default: () => ({
        vostroListData: [],
        vostroDetailsData: { data: "test" },
        handleSelectVostroRecord: jest.fn(),
        nostroListData: [],
        nostroDetailsData: { data: "test" },
        handleSelectNostroRecord: jest.fn(),
        classifiedCommonExceptions: "type",
      }),
    }));

    const mockForceRefreshValidation = jest.fn();
    jest.mock(
      "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/hooks/useForm",
      () => ({
        __esModule: true,
        default: () => ({
          vostroFormRef: { current: { forceRefreshValidation: mockForceRefreshValidation, clearValidateStatus: jest.fn(), getForm: jest.fn() } },
          nostroFormRef: { current: { forceRefreshValidation: jest.fn(), clearValidateStatus: jest.fn(), getForm: jest.fn() } },
          onResetFormValidationStatus: jest.fn(),
        }),
      })
    );

    act(() => {
      render(
        <Provider store={store}>
          <SplitLookUpSSIComp />
        </Provider>
      );
    });

    expect(screen).toBeDefined();

    expect(screen.getByText("Vostro SI Information")).toBeInTheDocument();
    expect(screen.getByText("Nostro SI Information")).toBeInTheDocument();

    const submitBtn = screen.getByText("Submit");
    expect(submitBtn).toBeInTheDocument();

    fireEvent.click(submitBtn);

    const resetBtn = screen.getByTestId("look-up-ssi-reset-button");
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);

    const closeBtn = screen.getByTestId("MuiDialog-close-btn");
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
  });
  it("should render SplitLookUpSSIComp correctly and handle submit/reset", async () => {
    const mockNostroDetails = {
      id: "",
      legalEntity: "",
      legalEntityFmid: "",
      settlementCurrency: "",
      settlementMeans: "NOS",
      settlementAccount: "USD MAIN",
      noticeToReceive: "N",
      nostroSettlementMessageType: "",
      ebbsNostroAccount: "800609500058636006",
      ebbsBridgeAccount: "",
      sendersCorrespondent53Swift: "SCBLUS33XXX",
      sendersCorrespondent53Fullname: "STANCHART NY",
      sendersCorrespondent53Address: "1095 AVENUE OF THE AMERICAS",
      sendersCorrespondent53City: "NEW YORK",
      sendersCorrespondent53PostCode: "",
      sendersCorrespondent53Account: "",
      createdAt: "",
      updatedAt: "",
      primaryFlag: "",
    };
    const mockVostroDetails = {
      ssiSource: "",
      ssiStatus: "",
      effectiveDate: "",
      fmid: "",
      counterpartName: "",
      swiftType: "MT103",
      country: "",
      security: "",
      debitCredit: "",
      settlementMethod: "",
      deliveryMethod: "",
      settlementMeans: "NOS",
      settlementType: "",
      systemCode: "",
      ssiId: "",
      entity: "",
      tradingCurrency: "",
      typology: "",
      ssiType: "Primary",
      settlementAccount: "USD MAIN",
      productGroup: "",
      productFamily: "",
      productType: "",
      coveredPayment: "Y",
      cmsAccount: "",
      charges: "OUR",
      isThirdpartyPayment: "",
      beneficiaryBic: "",
      beneficiaryName: "CITIC SECURITIES CO LTD",
      beneficiaryName2: "",
      beneficiaryAddress: "16F CITIC SECURITIES TWR NO48 BJG",
      beneficiaryCity: "China",
      beneficiaryPostcode: "",
      beneficiaryAccount: "861530053779",
      accountWithInstitutionBic: "UBHKHKHHXXX",
      accountWithInstitutionName: "",
      accountWithInstitutionAddress: "",
      accountWithInstitutionCity: "",
      accountWithInstitutionPostcode: "",
      accountWithInstitutionAccount: "36082191",
      receiversCorrespondentBic: "CITIUS33XXX",
      receiversCorrespondentName: "",
      receiversCorrespondentAddress: "",
      receiversCorrespondentCity: "",
      receiversCorrespondentPostcode: "",
      receiversCorrespondentAccount: "",
      intermediaryBic: "",
      intermediaryName: "",
      intermediaryAddress: "",
      intermediaryCity: "",
      intermediaryPostcode: "",
      intermediaryAccount: "",
      orderCustomerBic: "",
      orderCustomerName: "LNAME 494037",
      orderCustomerAddress: "ADDR1 595864 BJG",
      orderCustomerCity: "CN",
      orderCustomerPostcode: "",
      orderCustomerAccount: "400108557",
      remittanceInformation1: "",
      remittanceInformation2: "",
      remittanceInformation3: "",
      remittanceInformation4: "",
      senderToReceiver1: "",
      senderToReceiver2: "",
      senderToReceiver3: "",
      senderToReceiver4: "",
      senderToReceiver5: "",
      senderToReceiver6: "",
      eventRowKey: "",
      bookingEntity: "",
      cfiCode: "",
      isThirdPartyPayment: "N",
    };
    const initialState =
    {
      splitStatus: "INIT",
      isOpenSplittingDialog: true,
      isOpenLookUpSSIDialog: true,
      targetRowIndex: 1,
      isChildCashflowDialogVisible: true,
      sourceCashflow: mockCashflow1,
      targetCashflows: [mockCashflow1],
      initialTargetCashflows: [mockCashflow1],
      amountSetting: {
        precision: 2,
        type: 2,
      },
      splitAction: SplitActionType.AMEND_SPLIT
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer(initialState, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
      preloadedState: {
        splittingWorkflow: initialState,
      },
    });

    jest.doMock("src/Cashflow_CN/components/CashflowDetails/MultiExceptions/hooks/useData", () => ({
      __esModule: true,
      default: () => ({
        vostroListData: [mockVostroDetails],
        vostroDetailsData: mockVostroDetails,
        handleSelectVostroRecord: jest.fn(),
        nostroListData: [mockNostroDetails],
        nostroDetailsData: mockNostroDetails,
        handleSelectNostroRecord: jest.fn(),
        classifiedCommonExceptions: [],
      }),
    }));
    const mockForceRefreshValidation = jest.fn();
    jest.mock(
      "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/hooks/useForm",
      () => ({
        __esModule: true,
        default: () => ({
          vostroFormRef: { current: { forceRefreshValidation: mockForceRefreshValidation, clearValidateStatus: jest.fn(), getForm: jest.fn() } },
          nostroFormRef: { current: { forceRefreshValidation: jest.fn(), clearValidateStatus: jest.fn(), getForm: jest.fn() } },
          onResetFormValidationStatus: jest.fn(),
        }),
      })
    );
    act(() => {
      render(
        <Provider store={store}>
          <SplitLookUpSSIComp />
        </Provider>
      );
    });

    expect(screen).toBeDefined();

    expect(screen.getByText("Vostro SI Information")).toBeInTheDocument();
    expect(screen.getByText("Nostro SI Information")).toBeInTheDocument();

    const submitBtn = screen.getByText("Submit");
    expect(submitBtn).toBeInTheDocument();

    fireEvent.click(submitBtn);

    const resetBtn = screen.getByTestId("look-up-ssi-reset-button");
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);

    const closeBtn = screen.getByTestId("MuiDialog-close-btn");
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
  });
});