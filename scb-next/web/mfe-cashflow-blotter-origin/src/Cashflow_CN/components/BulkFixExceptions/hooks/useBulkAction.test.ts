import { configureStore, createReducer } from "@reduxjs/toolkit";
import { fn, ReduxProviderWrapper,renderHook } from "@Test/test-utils";

import { ExceptionBundleStatusTypes } from "../../CashflowDetails/MultiExceptions/common/interface";
import { mockCashflowDisplay } from "../test/mockData/cashflows";
import { BulkUserType } from "../type";
import { useBulkAction } from "./useBulkAction";

afterAll(() => {
    vi.clearAllMocks();
});

vi.mock("src/Cashflow_CN/services", () => {
    return {
        postBulkExceptionBundleAction: async () => [],
    }
});

describe('useBulkAction', () => {
    it("useBulkAction", async () => {
        const store = configureStore({
          reducer: {
            bulkFixExceptions: createReducer({
                isOpenDialog: true,
                cashflowsReadyToFix: [],
                userType: BulkUserType.Maker,
            }, () => {}),
          },
        });
        const wrapper = ReduxProviderWrapper(store);
        const mockSubmitExtraForm = fn(() => Promise.resolve({ comment: { comment: "" } }));
        const mockValidateExtraForm = fn(() => Promise.resolve(true));
        const mockClassifiedCashflows = {
            eligibleForBulk: {
                cashflows: [
                    mockCashflowDisplay
                ],
            },
            insufficientForBulk: {
                cashflows: [],
            },
        };
        const { result } = renderHook(() => useBulkAction({
            classifiedCashflows: mockClassifiedCashflows,
            submitExtraForm: mockSubmitExtraForm,
            cashflowIdsWithAfirmationException: [],
            cashflowIdsWithBackValueDateException: [],
            isClassifyLoading: false,
            validateExtraForm: mockValidateExtraForm,
        }), {
            wrapper,
        });
        const { 
            submit,
            precheckBeforeSubmit,
            selectedCashflowIds,
            showAffirmationForm,
            showBackValueDateForm,
        } = result.current;

        expect(await precheckBeforeSubmit()).toBe(true);

        expect(showAffirmationForm).toBe(false);
        expect(showBackValueDateForm).toBe(false);

        expect(selectedCashflowIds.length).toBe(1);

        const resp = await submit({ action: ExceptionBundleStatusTypes.Submit, onConfirmRebookException: fn(async () => true) });
        
        expect(resp.length).toBe(0);
    });
});