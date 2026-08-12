import { fn } from "@Test/test-utils";
import { NetType } from "src/Cashflow_CN/Main/workflow/netCashflow/netCashflowRightMenu";
import { cashflowBeneBICNetting, cashflowBeneBICNettingPreview, cashflowCcilNetting, cashflowCcilNettingPreview, cashflowNetting, cashflowNettingPreview } from "src/Cashflow_CN/services";
import { Service } from "src/Root/import";
import { mockFormInstance } from "src/test/mockUtils/antd-form";

import { mockMessageApi } from "../BulkFixExceptions/test/mockUtils/antd";
import { mockRequestParams, mockResponseData } from "./NetCashflowDialog.test";
import { getNettingApi, getNettingPreviewApi, netCashflowHelper, netCashflowWithAffirmationHelper } from "./NetCashflowDialogUtils";

it("netCashflowHelper - happy case", async () => {
    const { service } = Service;
    vi.spyOn(service, "post").mockImplementation(() => {
      return Promise.resolve({ data: mockResponseData, status: 200 });
    });
    const handleCashflowNetted = () => Promise.resolve([]);
    const handleCashflowUpdate = () => Promise.resolve([]);
    const mockSetPreviewMetrix = fn();
    const mockSetErrorMessage = fn();
    const mockSetProceedNetting = fn();
    const mockSetNettingResult = fn();
    const netCashflow = netCashflowHelper({
        requestParams: mockRequestParams,
        netType: NetType.CCILNetting,
        messageApi: mockMessageApi,
        dispatch: fn(),
        onCashflowNetted: handleCashflowNetted,
        onCashflowUpdate: handleCashflowUpdate,
        setPreviewMetrix: mockSetPreviewMetrix,
        setErrorMessage: mockSetErrorMessage,
        setProceedNetting: mockSetProceedNetting,
        setNettingResult: mockSetNettingResult,
        startTrackingRTT: fn(() => ({ completeTracking: fn(), abortTracking: fn() })),
    });

    await netCashflow(null);

    expect(mockSetProceedNetting.mock.calls[0][0]).toBe(true);
    expect(mockSetProceedNetting.mock.calls[1][0]).toBe(false);
    expect(mockSetPreviewMetrix).toHaveBeenCalled();
    expect(mockSetNettingResult).toHaveBeenCalled();
});

it("netCashflowHelper - status not 200", async () => {
    const { service } = Service;
    vi.spyOn(service, "post").mockImplementation(() => {
      return Promise.resolve({ data: {}, status: 500 });
    });
    const handleCashflowNetted = () => Promise.resolve([]);
    const handleCashflowUpdate = () => Promise.resolve([]);
    const mockSetPreviewMetrix = fn();
    const mockSetErrorMessage = fn();
    const mockSetProceedNetting = fn();
    const mockSetNettingResult = fn();
    const netCashflow = netCashflowHelper({
        requestParams: mockRequestParams,
        netType: NetType.CCILNetting,
        messageApi: mockMessageApi,
        dispatch: fn(),
        onCashflowNetted: handleCashflowNetted,
        onCashflowUpdate: handleCashflowUpdate,
        setPreviewMetrix: mockSetPreviewMetrix,
        setErrorMessage: mockSetErrorMessage,
        setProceedNetting: mockSetProceedNetting,
        setNettingResult: mockSetNettingResult,
        startTrackingRTT: fn(() => ({ completeTracking: fn(), abortTracking: fn() })),
    });

    await netCashflow();

    expect(mockSetProceedNetting.mock.calls[0][0]).toBe(true);
    expect(mockSetProceedNetting.mock.calls[1][0]).toBe(false);
    expect(mockSetPreviewMetrix).not.toHaveBeenCalled();
    expect(mockSetNettingResult).not.toHaveBeenCalled();
    expect(mockSetErrorMessage).toHaveBeenCalled();
});

it("netCashflowHelper - request error", async () => {
    const { service } = Service;
    vi.spyOn(service, "post").mockImplementation(() => {
      return Promise.reject(new Error("error"));
    });
    const handleCashflowNetted = () => Promise.resolve([]);
    const handleCashflowUpdate = () => Promise.resolve([]);
    const mockSetPreviewMetrix = fn();
    const mockSetErrorMessage = fn();
    const mockSetProceedNetting = fn();
    const mockSetNettingResult = fn();
    const netCashflow = netCashflowHelper({
        requestParams: mockRequestParams,
        netType: NetType.CCILNetting,
        messageApi: mockMessageApi,
        dispatch: fn(),
        onCashflowNetted: handleCashflowNetted,
        onCashflowUpdate: handleCashflowUpdate,
        setPreviewMetrix: mockSetPreviewMetrix,
        setErrorMessage: mockSetErrorMessage,
        setProceedNetting: mockSetProceedNetting,
        setNettingResult: mockSetNettingResult,
        startTrackingRTT: fn(() => ({ completeTracking: fn(), abortTracking: fn() })),
    });

    await netCashflow(null);

    expect(mockSetProceedNetting.mock.calls[0][0]).toBe(true);
    expect(mockSetProceedNetting.mock.calls[1][0]).toBe(false);
    expect(mockSetPreviewMetrix).not.toHaveBeenCalled();
    expect(mockSetNettingResult).not.toHaveBeenCalled();
    expect(mockMessageApi.error).toHaveBeenCalled();
});

it("netCashflowHelper - valid is false", async () => {
    const mockResponseData2 = JSON.parse(JSON.stringify(mockResponseData));
    mockResponseData2.resultList[0].valid = false;
    const { service } = Service;
    vi.spyOn(service, "post").mockImplementation(() => {
      return Promise.resolve({ data: mockResponseData2, status: 200 });
    });
    const handleCashflowNetted = () => Promise.resolve([]);
    const handleCashflowUpdate = () => Promise.resolve([]);
    const mockSetPreviewMetrix = fn();
    const mockSetErrorMessage = fn();
    const mockSetProceedNetting = fn();
    const mockSetNettingResult = fn();
    const netCashflow = netCashflowHelper({
        requestParams: mockRequestParams,
        netType: NetType.CCILNetting,
        messageApi: mockMessageApi,
        dispatch: fn(),
        onCashflowNetted: handleCashflowNetted,
        onCashflowUpdate: handleCashflowUpdate,
        setPreviewMetrix: mockSetPreviewMetrix,
        setErrorMessage: mockSetErrorMessage,
        setProceedNetting: mockSetProceedNetting,
        setNettingResult: mockSetNettingResult,
        startTrackingRTT: fn(() => ({ completeTracking: fn(), abortTracking: fn() })),
    });

    await netCashflow(null);

    expect(mockSetProceedNetting.mock.calls[0][0]).toBe(true);
    expect(mockSetProceedNetting.mock.calls[1][0]).toBe(false);
    expect(mockSetPreviewMetrix).toHaveBeenCalled();
    expect(mockSetNettingResult).toHaveBeenCalled();
    expect(mockMessageApi.warning).toHaveBeenCalled();
});

it("netCashflowHelper - params invalid", async () => {
  const mockResponseData2 = JSON.parse(JSON.stringify(mockResponseData));
  mockResponseData2.resultList[0].valid = false;
  const { service } = Service;
  vi.spyOn(service, "post").mockImplementation(() => {
    return Promise.resolve({ data: mockResponseData2, status: 200 });
  });
  const handleCashflowNetted = () => Promise.resolve([]);
  const handleCashflowUpdate = () => Promise.resolve([]);
  const mockSetPreviewMetrix = fn();
  const mockSetErrorMessage = fn();
  const mockSetProceedNetting = fn();
  const mockSetNettingResult = fn();
  const netCashflow = netCashflowHelper({
      // @ts-ignore
      requestParams: "test",
      netType: NetType.CCILNetting,
      messageApi: mockMessageApi,
      dispatch: fn(),
      onCashflowNetted: handleCashflowNetted,
      onCashflowUpdate: handleCashflowUpdate,
      setPreviewMetrix: mockSetPreviewMetrix,
      setErrorMessage: mockSetErrorMessage,
      setProceedNetting: mockSetProceedNetting,
      setNettingResult: mockSetNettingResult,
      startTrackingRTT: fn(() => ({ completeTracking: fn(), abortTracking: fn() })),
  });

  await netCashflow(null);
});

it("netCashflowHelper - originalCashflowList and previewCashflowList is null", async () => {
  const mockResponseData2 = JSON.parse(JSON.stringify(mockResponseData));
  mockResponseData2.resultList[0].originalCashflowList = null;
  mockResponseData2.resultList[0].previewCashflowList = null;
  const { service } = Service;
  vi.spyOn(service, "post").mockImplementation(() => {
    return Promise.resolve({ data: mockResponseData2, status: 200 });
  });
  const handleCashflowNetted = () => Promise.resolve([]);
  const handleCashflowUpdate = () => Promise.resolve([]);
  const mockSetPreviewMetrix = fn();
  const mockSetErrorMessage = fn();
  const mockSetProceedNetting = fn();
  const mockSetNettingResult = fn();
  const netCashflow = netCashflowHelper({
      // @ts-ignore
      requestParams: "test",
      netType: NetType.CCILNetting,
      messageApi: mockMessageApi,
      dispatch: fn(),
      onCashflowNetted: handleCashflowNetted,
      onCashflowUpdate: handleCashflowUpdate,
      setPreviewMetrix: mockSetPreviewMetrix,
      setErrorMessage: mockSetErrorMessage,
      setProceedNetting: mockSetProceedNetting,
      setNettingResult: mockSetNettingResult,
      startTrackingRTT: fn(() => ({ completeTracking: fn(), abortTracking: fn() })),
  });

  await netCashflow(null);
});

it("netCashflowWithAffirmationHelper", async () => {
    const mockForm = mockFormInstance();
    mockForm.validateFields = fn(async () => true);
    mockForm.getFieldsValue = fn(() => ({ affirmedAt: "test" }));
    const mockCloseAffirmation = fn();
    const mockNetCashflow = fn();
    const netCashflowWithAffirmation = netCashflowWithAffirmationHelper({
        form: mockForm,
        closeAffirmation: mockCloseAffirmation,
        netCashflow: mockNetCashflow,
    });

    await netCashflowWithAffirmation();

    expect(mockCloseAffirmation).toHaveBeenCalled();
    expect(mockNetCashflow).toHaveBeenCalled();
});

it("netCashflowWithAffirmationHelper - valid failed", async () => {
  const mockForm = mockFormInstance();
  mockForm.validateFields = fn(async () => false);
  mockForm.getFieldsValue = fn(() => ({ affirmedAt: "test" }));
  const mockCloseAffirmation = fn();
  const mockNetCashflow = fn();
  const netCashflowWithAffirmation = netCashflowWithAffirmationHelper({
      form: mockForm,
      closeAffirmation: mockCloseAffirmation,
      netCashflow: mockNetCashflow,
  });

  await netCashflowWithAffirmation();

  expect(mockCloseAffirmation).not.toHaveBeenCalled();
  expect(mockNetCashflow).not.toHaveBeenCalled();
});
it("getNettingPreviewApi - returns correct API for BilateralNetting", () => {
  const api = getNettingPreviewApi(NetType.BilateralNetting);
  expect(api).toBe(cashflowNettingPreview);
});

it("getNettingPreviewApi - returns correct API for CCILNetting", () => {
  const api = getNettingPreviewApi(NetType.CCILNetting);
  expect(api).toBe(cashflowCcilNettingPreview);
});

it("getNettingPreviewApi - returns correct API for BeneficiaryBICNetting", () => {
  const api = getNettingPreviewApi(NetType.BeneficiaryBICNetting);
  expect(api).toBe(cashflowBeneBICNettingPreview);
});

it("getNettingPreviewApi - returns default API for unknown NetType", () => {
  const api = getNettingPreviewApi("UnknownNetType" as unknown as NetType);
  expect(api).toBe(cashflowBeneBICNettingPreview);
});
it("getNettingApi - returns correct API for BeneficiaryBICNetting", () => {
  const api = getNettingApi(NetType.BeneficiaryBICNetting);
  expect(api).toBe(cashflowBeneBICNetting);
});

it("getNettingApi - returns correct API for BilateralNetting", () => {
  const api = getNettingApi(NetType.BilateralNetting);
  expect(api).toBe(cashflowNetting);
});

it("getNettingApi - returns correct API for CCILNetting", () => {
  const api = getNettingApi(NetType.CCILNetting);
  expect(api).toBe(cashflowCcilNetting);
});

it("getNettingApi - returns undefined for unknown NetType", () => {
  const api = getNettingApi("UnknownNetType" as unknown as NetType);
  expect(api).toBeUndefined();
});