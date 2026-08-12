import { MessageInstance } from "antd/es/message/interface";
import { mockCashflow1 } from "src/Cashflow_CN/test/mockData/cashflow";
import * as graphqlServices from "../../../../services/graphql";

import { NostroFormDetails } from "../../../../components/CashflowDetails/MultiExceptions/components/Nostro/interface";
import { VostroFormDetails } from "../../../../components/CashflowDetails/MultiExceptions/components/Vostro/interface";
import { fetchGraphCashflowDetails, getCurrentSplittingData,hasSplittingWorkflowData, validateSplitLookupSubmit } from "./utils";


const mockMessageApi: MessageInstance = {
  info: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  loading: vi.fn(),
  open: vi.fn(),
  destroy: vi.fn(),
};

const mockForm = (fields: Record<string, any>) => ({
  getForm: () => ({
    getFieldValue: (key: string) => fields[key],
  }),
});

const baseParams = {
  targetRowIndex: 0,
  targetCashflows: [mockCashflow1, mockCashflow1] as SplitTargetCashflow[],
  messageApi: mockMessageApi,
};

const vostroDetailsData = {
  settlementCode: "",
  ssiSource: "",
  ssiStatus: "",
  effectiveDate: "",
  fmid: "",
  counterpartName: "",
  swiftType: "",
  country: "",
  security: "",
  debitCredit: "",
  settlementMethod: "",
  deliveryMethod: "",
  settlementMeans: "",
  settlementType: "",
  systemCode: "",
  ssiId: "",
  entity: "",
  tradingCurrency: "",
  typology: "",
  ssiType: "",
  settlementAccount: "",
  productGroup: "",
  productFamily: "",
  productType: "",
  coveredPayment: "",
  cmsAccount: "",
  charges: "",
  isThirdpartyPayment: "",

  beneficiaryBic: "",
  beneficiaryName: "",
  beneficiaryName2: "",
  beneficiaryAddress: "",
  beneficiaryCity: "",
  beneficiaryPostcode: "",
  beneficiaryAccount: "",

  accountWithInstitutionBic: "",
  accountWithInstitutionName: "",
  accountWithInstitutionAddress: "",
  accountWithInstitutionCity: "",
  accountWithInstitutionPostcode: "",
  accountWithInstitutionAccount: "",

  receiversCorrespondentBic: "",
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
  orderCustomerName: "",
  orderCustomerAddress: "",
  orderCustomerCity: "",
  orderCustomerPostcode: "",
  orderCustomerAccount: "",

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
  popDubai: "",
} as VostroFormDetails;
const nostroDetailsData = {
  id: "",
  legalEntity: "",
  legalEntityFmid: "",
  settlementCurrency: "",
  settlementMeans: "",
  settlementAccount: "",
  noticeToReceive: "",
  nostroSettlementMessageType: "",

  ebbsNostroAccount: "",
  ebbsBridgeAccount: "",
  sendersCorrespondent53Swift: "",
  sendersCorrespondent53Fullname: "",
  sendersCorrespondent53Address: "",
  sendersCorrespondent53City: "",
  sendersCorrespondent53PostCode: "",
  sendersCorrespondent53Account: "",

  createdAt: "",
  updatedAt: "",

  primaryFlag: "",
} as NostroFormDetails;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("validateSplitLookupSubmit", () => {
  it("should warn if both settlementMeans are empty", () => {
    const result = validateSplitLookupSubmit({
      ...baseParams,
      vostroFormRef: { current: mockForm({ settlementMeans: undefined, settlementAccount: undefined }) } as any,
      nostroFormRef: { current: mockForm({ settlementMeans: undefined, settlementAccount: undefined }) } as any,
      vostroDetailsData,
      nostroDetailsData,
    });
    expect(mockMessageApi.warning).toHaveBeenCalledWith("You do not choose any ssi");
    expect(result.valid).toBe(true);
    expect(baseParams.targetCashflows[0]?.vostroAccount).toBeUndefined();
    expect(baseParams.targetCashflows[0]?.nostroAccount).toBeUndefined();
  });

  it("should error if vostroSettlementMeans is empty but nostroSettlementMeans is not", () => {
    const result = validateSplitLookupSubmit({
      ...baseParams,
      vostroFormRef: { current: mockForm({ settlementMeans: undefined }) } as any,
      nostroFormRef: { current: mockForm({ settlementMeans: "A" }) } as any,
      vostroDetailsData,
      nostroDetailsData,
    });
    expect(mockMessageApi.error).toHaveBeenCalledWith("Please select vostro ssi");
    expect(result.valid).toBe(false);
  });

  it("should error if nostroSettlementMeans is empty but vostroSettlementMeans is not", () => {
    const result = validateSplitLookupSubmit({
      ...baseParams,
      vostroFormRef: { current: mockForm({ settlementMeans: "A" }) } as any,
      nostroFormRef: { current: mockForm({ settlementMeans: undefined }) } as any,
      vostroDetailsData,
      nostroDetailsData,
    });
    expect(mockMessageApi.error).toHaveBeenCalledWith("Please select nostro ssi");
    expect(result.valid).toBe(false);
  });

  it("should error if settlementAccount or settlementMeans not match", () => {
    const result = validateSplitLookupSubmit({
      ...baseParams,
      vostroFormRef: { current: mockForm({ settlementMeans: "A", settlementAccount: "1" }) } as any,
      nostroFormRef: { current: mockForm({ settlementMeans: "A", settlementAccount: "2" }) } as any,
      vostroDetailsData,
      nostroDetailsData,
    });
    expect(mockMessageApi.error).toHaveBeenCalledWith("Vostro and Nostro SSI must be same");
    expect(result.valid).toBe(false);
  });

  it("should set details if all valid", () => {
    const result = validateSplitLookupSubmit({
      ...baseParams,
      vostroFormRef: { current: mockForm({ settlementMeans: "A", settlementAccount: "1" }) } as any,
      nostroFormRef: { current: mockForm({ settlementMeans: "A", settlementAccount: "1" }) } as any,
      vostroDetailsData,
      nostroDetailsData,
    });
    expect(result.valid).toBe(true);
    expect(result.newTargetCashflows?.[0].vostroAccount).toBe(vostroDetailsData);
    expect(result.newTargetCashflows?.[0].nostroAccount).toBe(nostroDetailsData);
  });

  it("should skip validation if targetRowIndex is empty", () => {
    const result = validateSplitLookupSubmit({
      ...baseParams,
      targetRowIndex: null,
      vostroFormRef: { current: mockForm({}) } as any,
      nostroFormRef: { current: mockForm({}) } as any,
      vostroDetailsData,
      nostroDetailsData,
    });
    expect(result.valid).toBe(true);
  });
});


describe("fetchGraphCashflowDetails", () => {
  const setGraphCashflowDetails = vi.fn();
  const setCounterPartyDetails = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should do nothing if cashflowId is undefined", async () => {
    await fetchGraphCashflowDetails(undefined, setGraphCashflowDetails);
    expect(setGraphCashflowDetails).not.toHaveBeenCalled();
  });

  it("should setGraphCashflowDetails if response contains data", async () => {
    const mockResp = { graphCashFlowDetails: [{ id: "1" }] };
    vi.spyOn(graphqlServices, "queryCashFlowDetails").mockResolvedValueOnce(mockResp);

    await fetchGraphCashflowDetails("123", setGraphCashflowDetails);
    expect(setGraphCashflowDetails).toHaveBeenCalledWith({ id: "1" });
  });
  it("should not setGraphCashflowDetails if response is empty", async () => {
    vi.spyOn(graphqlServices, "queryCashFlowDetails").mockResolvedValue({ graphCashFlowDetails: [] });
    await fetchGraphCashflowDetails("123", setGraphCashflowDetails);
    expect(setGraphCashflowDetails).not.toHaveBeenCalled();
  });

  it("should handle error gracefully", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
    vi.spyOn(graphqlServices, "queryCashFlowDetails").mockRejectedValue(new Error("fail"));
    await fetchGraphCashflowDetails("123", setGraphCashflowDetails);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe("hasSplittingWorkflowData", () => {
  it("should return true when all conditions are met", () => {
    expect(
      hasSplittingWorkflowData(true, 1, [mockCashflow1])
    ).toBe(true);
    expect(
      hasSplittingWorkflowData(true, "0", [mockCashflow1])
    ).toBe(true);
  });

  it("should return false if isOpenLookUpSSIDialog is false", () => {
    expect(
      hasSplittingWorkflowData(false, 1, [mockCashflow1])
    ).toBe(false);
  });
});

describe("getCurrentSplittingData", () => {
  it("should return the correct item when all conditions are met", () => {
    expect(
      getCurrentSplittingData(true, 1, [mockCashflow1])
    ).toEqual(undefined);
    expect(
      getCurrentSplittingData(true, 0, [mockCashflow1])
    ).toEqual(mockCashflow1);
  });

  it("should return undefined if isOpenLookUpSSIDialog is false", () => {
    expect(
      getCurrentSplittingData(false, 1, [mockCashflow1])
    ).toBeUndefined();
  });
});
