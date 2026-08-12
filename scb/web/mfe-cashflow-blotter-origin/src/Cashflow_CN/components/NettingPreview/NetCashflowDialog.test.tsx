import { fireEvent } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import defaultPreloadedState from "src/Cashflow_CN/Main/store/state";
import { NetType } from "src/Cashflow_CN/Main/workflow/netCashflow/netCashflowRightMenu";
import { CASHFLOW_BLOTTER_NET_WITH_AFFIRM_BTN,CASHFLOW_BLOTTER_NETTING_DIALOG_CLOSE_BTN, CASHFLOW_BLOTTER_NETTING_DIALOG_NET_SUBMIT_BTN } from "src/Root/analysis/const";
import { Service } from "src/Root/import";
import { renderWithProviders } from "src/test/test-utils";

import ThemeProvider from "../../../Root/common/component/MfeThemeProvider";
import NettingPreviewDialog, { netButtonText } from "./NetCashflowDialog";

export const mockRequestParams = [
  {
    Cashflow: {
      Cashflow_Id: "092023042702",
      Payment_Currency: "USD",
    },
  },
  {
    Cashflow: {
      Cashflow_Id: "092023042703",
      Payment_Currency: "USD",
    },
  },
];

export const mockResponseData = {
  resultList: [
    {
      originalCashflowList: [
        {
          dataSourceSystem: "Stella",
          cashflowId: "004360871531",
          cashflowState: "WAITING",
          eventType: "New",
          paymentDate: "2022-11-28",
          amount: 100000,
          currency: "EUR",
          payRec: "Pay",
          bookingEntityFmid: "401036553",
          counterpartyFmid: "10075222",
          allotment: "",
          businessVersion: "0",
          cashflowVersion: "0",
          minorVersion: "3",
          netId: null,
          bookingEntityFmCode: "SCB EGYPT*CAI",
          counterpartyFmCode: "SCB LONDON*LDN",
          taxonomy: "ForeignExchange:Forward",
          paymentType: "Cashflow",
          cashflowSubState: "Pending Operator",
          cashflowSubStateType: "Pending Exception",
          cfiCode: "JFXXXX",
          entryTime: "2024-06-18T04:10:05",
        },
        {
          dataSourceSystem: "Stella",
          cashflowId: "004360871430",
          cashflowState: "WAITING",
          eventType: "New",
          paymentDate: "2022-11-28",
          amount: 100000,
          currency: "EUR",
          payRec: "Pay",
          bookingEntityFmid: "401036553",
          counterpartyFmid: "10075222",
          allotment: "",
          businessVersion: "0",
          cashflowVersion: "0",
          minorVersion: "3",
          netId: null,
          bookingEntityFmCode: "SCB EGYPT*CAI",
          counterpartyFmCode: "SCB LONDON*LDN",
          taxonomy: "ForeignExchange:Forward",
          paymentType: "Cashflow",
          cashflowSubState: "Pending Operator",
          cashflowSubStateType: "Pending Exception",
          cfiCode: "JFXXXX",
          entryTime: "2024-06-18T03:40:05",
        },
      ],
      previewCashflowList: [
        {
          dataSourceSystem: "Ratan",
          cashflowId: null,
          cashflowState: "QUEUED",
          eventType: "New",
          paymentDate: "2022-11-28",
          amount: 200000,
          currency: "EUR",
          payRec: "Pay",
          bookingEntityFmid: "401036553",
          counterpartyFmid: "10075222",
          allotment: "",
          businessVersion: "0",
          cashflowVersion: "0",
          minorVersion: "0",
          netId: null,
          bookingEntityFmCode: "SCB EGYPT*CAI",
          counterpartyFmCode: "SCB LONDON*LDN",
          taxonomy: "ForeignExchange:Forward",
          paymentType: "Cashflow",
          cashflowSubState: "NA",
          cashflowSubStateType: "NA",
          cfiCode: "JFXXXX",
          entryTime: "2024-06-18T09:39:14.867704541",
        },
      ],
      errorMsg: null,
      valid: true,
    },
  ],
};

describe("Net Cashflow Dialog", () => {
  beforeEach(() => {
      jest.clearAllMocks();
  });
  it("should be in the document", async () => {
    const tobeNettedRequest = {
      requestParams: mockRequestParams,
    };
    const handleCashflowNetted = () => Promise.resolve([]);
    const handleCashflowUpdate = () => Promise.resolve([]);
    const { queryByTestId, getByTestId } = renderWithProviders(
      <ThemeProvider>
        <NettingPreviewDialog
          onCashflowNetted={handleCashflowNetted}
          onCashflowUpdate={handleCashflowUpdate}
          tobeNettedRequest={tobeNettedRequest}
          onClose={() => {}}
        />
      </ThemeProvider>,
      {
        preloadedState: {
          ...defaultPreloadedState,
          netWorkflow: {
            nettingStatus: "",
            isCcilMethod: false,
          },
        },
      }
    );
    expect(queryByTestId("component-cashflow-dialog-body")).toBeInTheDocument();

    const showAffirm = queryByTestId(CASHFLOW_BLOTTER_NET_WITH_AFFIRM_BTN);
    expect(showAffirm).toBeInTheDocument();
    fireEvent.click(showAffirm as HTMLElement);

    expect(queryByTestId("affirmedName")).toBeInTheDocument();
    userEvent.type(getByTestId("affirmedName"), "GL");
    userEvent.type(getByTestId("affirmedEmail"), "123@com");
    userEvent.type(getByTestId("affirmedAt"), "2024-06-18");

    const netAll = queryByTestId(CASHFLOW_BLOTTER_NETTING_DIALOG_NET_SUBMIT_BTN);
    expect(netAll).toBeInTheDocument();
    fireEvent.click(netAll as HTMLElement);

    const closeBtn = queryByTestId(CASHFLOW_BLOTTER_NETTING_DIALOG_CLOSE_BTN);
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn as HTMLElement);
  });
  it("when net status is error", async () => {
    const { service } = Service;
    jest.spyOn(service, "post").mockImplementation(() => {
      return Promise.reject(new Error("error"));
    });
    const tobeNettedRequest = {
      requestParams: mockRequestParams,
    };
    const handleCashflowNetted = () => Promise.resolve([]);
    const handleCashflowUpdate = () => Promise.resolve([]);
    const { queryByTestId, queryByText } = renderWithProviders(
      <ThemeProvider>
        <NettingPreviewDialog
          onCashflowNetted={handleCashflowNetted}
          onCashflowUpdate={handleCashflowUpdate}
          tobeNettedRequest={tobeNettedRequest}
          onClose={() => {}}
        />
      </ThemeProvider>,
      {
        preloadedState: {
          ...defaultPreloadedState,
          netWorkflow: {
            nettingStatus: "ERROR",
            isCcilMethod: true,
          },
        },
      }
    );
    expect(queryByTestId("component-cashflow-dialog-body")).toBeInTheDocument();
    expect(queryByText("Can not Netting")).toBeInTheDocument();
  });
  it("when net status is finished", async () => {
    const tobeNettedRequest = {
      requestParams: mockRequestParams,
    };
    const handleCashflowNetted = () => Promise.resolve([]);
    const handleCashflowUpdate = () => Promise.resolve([]);
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <NettingPreviewDialog
          onCashflowNetted={handleCashflowNetted}
          onCashflowUpdate={handleCashflowUpdate}
          tobeNettedRequest={tobeNettedRequest}
          onClose={() => {}}
        />
      </ThemeProvider>,
      {
        preloadedState: {
          ...defaultPreloadedState,
          netWorkflow: {
            nettingStatus: "FINISHED",
            isCcilMethod: true,
          },
        },
      }
    );
    expect(queryByTestId("component-cashflow-dialog-body")).toBeInTheDocument();
  });
});

describe("netButtonText", () => {
  it("should return 'Netting Done' when nettingStatus is 'FINISHED'", () => {
    const result = netButtonText({
      nettingStatus: "FINISHED",
      proceedNetting: false,
      netType: NetType.BeneficiaryBICNetting,
    });
    expect(result).toBe("Netting Done");
  });

  it("should return 'Proceed Netting' when proceedNetting is true", () => {
    const result = netButtonText({
      nettingStatus: "PENDING",
      proceedNetting: true,
      netType: NetType.BeneficiaryBICNetting,
    });
    expect(result).toBe("Proceed Netting");
  });

  it("should return 'Net All Cashflows' when netType is BeneficiaryBICNetting and proceedNetting is false", () => {
    const result = netButtonText({
      nettingStatus: "PENDING",
      proceedNetting: false,
      netType: NetType.BeneficiaryBICNetting,
    });
    expect(result).toBe("Net All Cashflows");
  });

  it("should return 'Net All Cashflows with Affirmation' when netType is not BeneficiaryBICNetting and proceedNetting is false", () => {
    const result = netButtonText({
      nettingStatus: "PENDING",
      proceedNetting: false,
      netType: "OtherType" as unknown as NetType,
    });
    expect(result).toBe("Net All Cashflows with Affirmation");
  });

  it("should handle edge case where nettingStatus is an unexpected value", () => {
    const result = netButtonText({
      nettingStatus: "UNKNOWN",
      proceedNetting: false,
      netType: NetType.BeneficiaryBICNetting,
    });
    expect(result).toBe("Net All Cashflows");
  });

  it("should handle edge case where proceedNetting is undefined", () => {
    const result = netButtonText({
      nettingStatus: "PENDING",
      proceedNetting: undefined as unknown as boolean,
      netType: NetType.BeneficiaryBICNetting,
    });
    expect(result).toBe("Net All Cashflows");
  });

  it("should handle edge case where netType is undefined", () => {
    const result = netButtonText({
      nettingStatus: "PENDING",
      proceedNetting: false,
      netType: undefined as unknown as NetType,
    });
    expect(result).toBe("Net All Cashflows with Affirmation");
  });
});
