import { mockModalApi } from "src/Cashflow_CN/components/BulkFixExceptions/test/mockUtils/antd";
import { mockMultipleGraphqlDetails1 } from "src/Cashflow_CN/test/mockData/cashflowDetails";
import { IterableCollectNext } from "src/Root/analysis";
import { fn } from "src/test/test-utils";

import { Checker, MultiExceptionsNames } from "../common/interface";
import { hasExceptionsChecking,validationMain } from "./prevalidation";
import { submitHelper } from "./submit";

function createMockNextChain(depth: number): { next: ReturnType<typeof fn>; complete: ReturnType<typeof fn>; abort: ReturnType<typeof fn> } {
    if (depth <= 0) {
        return { next: fn(), complete: fn(), abort: fn() };
    }
    return {
        next: fn(() => createMockNextChain(depth - 1)),
        complete: fn(),
        abort: fn(),
    };
}

it("submitHelper - submit - happy case", async () => {
    const mockAllFormSubmit = fn(() => Promise.resolve({ data: {}, valid: true }));
    const mockClassifiedCommonExceptions = {};
    const mockStartTracking = fn(() => fn(() => createMockNextChain(2))) as unknown as (name: string) => IterableCollectNext;
    const mockStartTrackingRTT = fn(() => ({ completeTracking: fn(), abortTracking: fn() }));
    const mockMakerSubmittedData = {};
    const mockSetFormValidateStatus = fn();
    const mockShowFeedBack = fn();
    const mockHasRebookExceptions = false;
    const mockeHasHardBlockerExceptions = false;

    const mockAllAvailableCommonExceptionsData: RatanException[] = [];
    const mockClearFormValidateStatus = fn();
    const mockCloseDialog = fn();
    const mockRefreshCashflow = fn(async () => ({}));
    const submit = submitHelper({
        cashflowDetails: mockMultipleGraphqlDetails1[0],
        allFormsSubmit: mockAllFormSubmit,
        classifiedCommonExceptions: mockClassifiedCommonExceptions,
        isAdhocing: true,
        isFixingMissingNostro: true,
        startTracking: mockStartTracking,
        startTrackingRTT: mockStartTrackingRTT,
        userRole: "Maker",
        makerSubmittedData: mockMakerSubmittedData,
        setFormValidateStatus: mockSetFormValidateStatus,
        showFeedback: mockShowFeedBack,
        hasRebookExceptions: mockHasRebookExceptions,
        hasHardBlockerExceptions: mockeHasHardBlockerExceptions,
        modalApi: mockModalApi,
        allAvailableCommonExceptionsData: mockAllAvailableCommonExceptionsData,
        clearFormValidateStatus: mockClearFormValidateStatus,
        closeDialog: mockCloseDialog,
        refreshCashflow: mockRefreshCashflow,
        settlementMethod: "CASH",
    });

    // submit
    const res = await submit(true);

    expect(res).toBe(true);
});

it("submitHelper - approve - happy case", async () => {
    const mockAllFormSubmit = fn(() => Promise.resolve({ data: {}, valid: true }));
    const mockClassifiedCommonExceptions = {};
    const mockStartTracking = fn(() => fn(() => createMockNextChain(2))) as unknown as (name: string) => IterableCollectNext;
    const mockStartTrackingRTT = fn(() => ({ completeTracking: fn(), abortTracking: fn() }));
    const mockMakerSubmittedData = {};
    const mockSetFormValidateStatus = fn();
    const mockShowFeedBack = fn();
    const mockHasRebookExceptions = false;
    const mockeHasHardBlockerExceptions = false;

    const mockAllAvailableCommonExceptionsData: RatanException[] = [];
    const mockClearFormValidateStatus = fn();
    const mockCloseDialog = fn();
    const mockRefreshCashflow = fn(async () => ({}));
    const submit = submitHelper({
        cashflowDetails: mockMultipleGraphqlDetails1[0],
        allFormsSubmit: mockAllFormSubmit,
        classifiedCommonExceptions: mockClassifiedCommonExceptions,
        isAdhocing: true,
        isFixingMissingNostro: true,
        startTracking: mockStartTracking,
        startTrackingRTT: mockStartTrackingRTT,
        userRole: "Checker",
        makerSubmittedData: mockMakerSubmittedData,
        setFormValidateStatus: mockSetFormValidateStatus,
        showFeedback: mockShowFeedBack,
        hasRebookExceptions: mockHasRebookExceptions,
        hasHardBlockerExceptions: mockeHasHardBlockerExceptions,
        modalApi: mockModalApi,
        allAvailableCommonExceptionsData: mockAllAvailableCommonExceptionsData,
        clearFormValidateStatus: mockClearFormValidateStatus,
        closeDialog: mockCloseDialog,
        refreshCashflow: mockRefreshCashflow,
        settlementMethod: "CASH",
    });

    // approve
    const res = await submit(true);

    expect(res).toBe(true);
});

it("submitHelper - reject - happy case", async () => {
    const mockAllFormSubmit = fn(() => Promise.resolve({ data: {}, valid: true }));
    const mockClassifiedCommonExceptions = {};
    const mockStartTracking = fn(() => fn(() => createMockNextChain(2))) as unknown as (name: string) => IterableCollectNext;
    const mockStartTrackingRTT = fn(() => ({ completeTracking: fn(), abortTracking: fn() }));
    const mockMakerSubmittedData = {};
    const mockSetFormValidateStatus = fn();
    const mockShowFeedBack = fn();
    const mockHasRebookExceptions = false;
    const mockeHasHardBlockerExceptions = false;

    const mockAllAvailableCommonExceptionsData: RatanException[] = [];
    const mockClearFormValidateStatus = fn();
    const mockCloseDialog = fn();
    const mockRefreshCashflow = fn(async () => ({}));
    const submit = submitHelper({
        cashflowDetails: mockMultipleGraphqlDetails1[0],
        allFormsSubmit: mockAllFormSubmit,
        classifiedCommonExceptions: mockClassifiedCommonExceptions,
        isAdhocing: true,
        isFixingMissingNostro: true,
        startTracking: mockStartTracking,
        startTrackingRTT: mockStartTrackingRTT,
        userRole: "Checker",
        makerSubmittedData: mockMakerSubmittedData,
        setFormValidateStatus: mockSetFormValidateStatus,
        showFeedback: mockShowFeedBack,
        hasRebookExceptions: mockHasRebookExceptions,
        hasHardBlockerExceptions: mockeHasHardBlockerExceptions,
        modalApi: mockModalApi,
        allAvailableCommonExceptionsData: mockAllAvailableCommonExceptionsData,
        clearFormValidateStatus: mockClearFormValidateStatus,
        closeDialog: mockCloseDialog,
        refreshCashflow: mockRefreshCashflow,
        settlementMethod: "CASH",
    });

    // reject
    const res = await submit(false);

    expect(res).toBe(true);
});

it("submitHelper - submit - form not validate", async () => {
    const mockAllFormSubmit = fn(() => Promise.resolve({ data: {}, valid: false }));
    const mockClassifiedCommonExceptions = {};
    const mockStartTracking = fn(() => fn(() => createMockNextChain(2))) as unknown as (name: string) => IterableCollectNext;
    const mockStartTrackingRTT = fn(() => ({ completeTracking: fn(), abortTracking: fn() }));
    const mockMakerSubmittedData = {};
    const mockSetFormValidateStatus = fn();
    const mockShowFeedBack = fn();
    const mockHasRebookExceptions = false;
    const mockeHasHardBlockerExceptions = false;

    const mockAllAvailableCommonExceptionsData: RatanException[] = [];
    const mockClearFormValidateStatus = fn();
    const mockCloseDialog = fn();
    const mockRefreshCashflow = fn(async () => ({}));
    const submit = submitHelper({
        cashflowDetails: mockMultipleGraphqlDetails1[0],
        allFormsSubmit: mockAllFormSubmit,
        classifiedCommonExceptions: mockClassifiedCommonExceptions,
        isAdhocing: true,
        isFixingMissingNostro: true,
        startTracking: mockStartTracking,
        startTrackingRTT: mockStartTrackingRTT,
        userRole: "Maker",
        makerSubmittedData: mockMakerSubmittedData,
        setFormValidateStatus: mockSetFormValidateStatus,
        showFeedback: mockShowFeedBack,
        hasRebookExceptions: mockHasRebookExceptions,
        hasHardBlockerExceptions: mockeHasHardBlockerExceptions,
        modalApi: mockModalApi,
        allAvailableCommonExceptionsData: mockAllAvailableCommonExceptionsData,
        clearFormValidateStatus: mockClearFormValidateStatus,
        closeDialog: mockCloseDialog,
        refreshCashflow: mockRefreshCashflow,
        settlementMethod: "CASH",
    });

    // submit
    const res = await submit(true);

    expect(res).toBe(false);
    expect(mockShowFeedBack).toHaveBeenCalled();
});

it("submitHelper - approve - double blind validation failed", async () => {
    const mockAllFormSubmit = fn(() => Promise.resolve({
        data: {
            [MultiExceptionsNames.Vostro]: {
                settlementAccount: "USD MAIN",
            },
        }, valid: true
    }));
    const mockClassifiedCommonExceptions = {};
    const mockStartTracking = fn(() => fn(() => createMockNextChain(2))) as unknown as (name: string) => IterableCollectNext;
    const mockStartTrackingRTT = fn(() => ({ completeTracking: fn(), abortTracking: fn() }));
    const mockMakerSubmittedData = {
        [MultiExceptionsNames.Vostro]: {
            settlementAccount: "CNO MAIN",
        }
    };
    const mockSetFormValidateStatus = fn();
    const mockShowFeedBack = fn();
    const mockHasRebookExceptions = false;
    const mockeHasHardBlockerExceptions = false;

    const mockAllAvailableCommonExceptionsData: RatanException[] = [];
    const mockClearFormValidateStatus = fn();
    const mockCloseDialog = fn();
    const mockRefreshCashflow = fn(async () => ({}));
    const submit = submitHelper({
        cashflowDetails: mockMultipleGraphqlDetails1[0],
        allFormsSubmit: mockAllFormSubmit,
        classifiedCommonExceptions: mockClassifiedCommonExceptions,
        isAdhocing: true,
        isFixingMissingNostro: true,
        startTracking: mockStartTracking,
        startTrackingRTT: mockStartTrackingRTT,
        userRole: "Checker",
        makerSubmittedData: mockMakerSubmittedData,
        setFormValidateStatus: mockSetFormValidateStatus,
        showFeedback: mockShowFeedBack,
        hasRebookExceptions: mockHasRebookExceptions,
        hasHardBlockerExceptions: mockeHasHardBlockerExceptions,
        modalApi: mockModalApi,
        allAvailableCommonExceptionsData: mockAllAvailableCommonExceptionsData,
        clearFormValidateStatus: mockClearFormValidateStatus,
        closeDialog: mockCloseDialog,
        refreshCashflow: mockRefreshCashflow,
        settlementMethod: "CASH",
    });

    // approve
    const res = await submit(true);

    expect(res).toBe(false);
});
it("submitHelper - approve - Visitor validation failed", async () => {
    const mockAllFormSubmit = fn(() => Promise.resolve({
        data: {
            [MultiExceptionsNames.Vostro]: {
                settlementAccount: "USD MAIN",
            },
        }, valid: true
    }));
    const mockClassifiedCommonExceptions = {};
    const mockStartTracking = fn(() => fn(() => createMockNextChain(2))) as unknown as (name: string) => IterableCollectNext;
    const mockStartTrackingRTT = fn(() => ({ completeTracking: fn(), abortTracking: fn() }));
    const mockMakerSubmittedData = {
        [MultiExceptionsNames.Vostro]: {
            settlementAccount: "CNO MAIN",
        }
    };
    const mockSetFormValidateStatus = fn();
    const mockShowFeedBack = fn();
    const mockHasRebookExceptions = false;
    const mockeHasHardBlockerExceptions = false;
    const mockAllAvailableCommonExceptionsData: RatanException[] = [];
    const mockClearFormValidateStatus = fn();
    const mockCloseDialog = fn();
    const mockRefreshCashflow = fn(async () => ({}));
    const submit = submitHelper({
        cashflowDetails: mockMultipleGraphqlDetails1[0],
        allFormsSubmit: mockAllFormSubmit,
        classifiedCommonExceptions: mockClassifiedCommonExceptions,
        isAdhocing: true,
        isFixingMissingNostro: true,
        startTracking: mockStartTracking,
        startTrackingRTT: mockStartTrackingRTT,
        userRole: "Visitor",
        makerSubmittedData: mockMakerSubmittedData,
        setFormValidateStatus: mockSetFormValidateStatus,
        showFeedback: mockShowFeedBack,
        hasRebookExceptions: mockHasRebookExceptions,
        hasHardBlockerExceptions: mockeHasHardBlockerExceptions,
        modalApi: mockModalApi,
        allAvailableCommonExceptionsData: mockAllAvailableCommonExceptionsData,
        clearFormValidateStatus: mockClearFormValidateStatus,
        closeDialog: mockCloseDialog,
        refreshCashflow: mockRefreshCashflow,
        settlementMethod: "CASH",
    });

    // approve
    const res = await submit(true);

    expect(res).toBe(false);
});
it("submitHelper - submit - hasHardBlockerExceptions should block submit", async () => {
    const mockAllFormSubmit = fn(() => Promise.resolve({ data: {}, valid: true }));
    const mockClassifiedCommonExceptions = {};
    const mockStartTracking = fn(() => ({
        abort: fn(),
        complete: fn(),
        next: fn(() => ({ abort: fn(), complete: fn() })),
    })) as unknown as (name: string) => IterableCollectNext;
    const mockStartTrackingRTT = fn(() => ({ completeTracking: fn(), abortTracking: fn() }));
    const mockMakerSubmittedData = {};
    const mockSetFormValidateStatus = fn();
    const mockShowFeedBack = fn();
    const mockHasRebookExceptions = false;
    const mockHasHardBlockerExceptions = true;

    const mockAllAvailableCommonExceptionsData: RatanException[] = [];
    const mockClearFormValidateStatus = fn();
    const mockCloseDialog = fn();
    const mockRefreshCashflow = fn(async () => ({}));
    const submit = submitHelper({
        cashflowDetails: mockMultipleGraphqlDetails1[0],
        allFormsSubmit: mockAllFormSubmit,
        classifiedCommonExceptions: mockClassifiedCommonExceptions,
        isAdhocing: true,
        isFixingMissingNostro: true,
        startTracking: mockStartTracking,
        startTrackingRTT: mockStartTrackingRTT,
        userRole: "Maker",
        makerSubmittedData: mockMakerSubmittedData,
        setFormValidateStatus: mockSetFormValidateStatus,
        showFeedback: mockShowFeedBack,
        hasRebookExceptions: mockHasRebookExceptions,
        hasHardBlockerExceptions: mockHasHardBlockerExceptions,
        modalApi: mockModalApi,
        allAvailableCommonExceptionsData: mockAllAvailableCommonExceptionsData,
        clearFormValidateStatus: mockClearFormValidateStatus,
        closeDialog: mockCloseDialog,
        refreshCashflow: mockRefreshCashflow,
        settlementMethod: "CASH",
    });

    const res = await submit(true);

    expect(res).toBe(false);
    expect(mockShowFeedBack).toHaveBeenCalledWith({
        type: "error",
        content:
            "This is a Swap Agent Coupon or Interim MTM cashflow, can't be released from Ratan.",
    });
});
it("should return false when hasHardBlockerExceptions is true", async () => {
    const mockShowFeedback = vi.fn();
    const mockAbort = vi.fn();
    const mockNext = vi.fn(() => ({ abort: mockAbort }));

    const result = await validationMain(
        {/* targetData */ },
        {
            isSubmit: true,
            userRole: Checker,
            makerSubmittedData: {},
            startTracking: () => mockNext,
            setFormValidateStatus: vi.fn(),
            showFeedback: mockShowFeedback,
            hasHardBlockerExceptions: true,
            hasRebookExceptions: false,
            modalApi: { confirm: vi.fn() },
            startTrackingRTT: vi.fn(() => ({ completeTracking: vi.fn(), abortTracking: vi.fn() })),
            cashflowDetails: { cashflow: {} },
            allAvailableCommonExceptionsData: [],
            clearFormValidateStatus: vi.fn(),
            closeDialog: vi.fn(),
            refreshCashflow: vi.fn(),
            payload: {},
        }
    );
    expect(result).toBe(false);
    expect(mockShowFeedback).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
    expect(mockAbort).toHaveBeenCalled();
});
it("should return false and call abort when isReject is false and hasHardBlockerExceptions is true", async () => {
    const mockShowFeedback = vi.fn();
    const mockAbort = vi.fn();
    const mockNext = vi.fn(() => ({ abort: mockAbort }));

    const result = await hasExceptionsChecking({
        isReject: false,
        hasHardBlockerExceptions: true,
        hasRebookExceptions: false,
        showFeedback: mockShowFeedback,
        next: mockNext,
        modalApi: { confirm: vi.fn() },
    });

    expect(result).toBe(false);
    expect(mockShowFeedback).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith("");
    expect(mockAbort).toHaveBeenCalled();
});
it("should return true when isReject is true even if hasHardBlockerExceptions is true", async () => {
    const mockShowFeedback = vi.fn();
    const mockAbort = vi.fn();
    const mockNext = vi.fn(() => ({ abort: mockAbort }));

    const result = await hasExceptionsChecking({
        isReject: true,
        hasHardBlockerExceptions: true,
        hasRebookExceptions: false,
        showFeedback: mockShowFeedback,
        next: mockNext,
        modalApi: { confirm: vi.fn() },
    });

    expect(result).toBe(true);
    expect(mockShowFeedback).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
});