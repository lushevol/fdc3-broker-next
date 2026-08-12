import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper,renderHook } from "@Test/test-utils";
import { mockCashflow1 } from "src/Cashflow_CN/test/mockData/cashflow";

import { BulkUserType } from "../type";
import { classifyCashflows, useBulkDialogData } from "./useBulkDialogData";

vi.mock("src/Cashflow_CN/services/graphql", () => {
    return {
        queryCashFlowDetailsForBulkFixExceptions: vi.fn(async () => ({
        graphCashFlowDetails: {
          results: [],
        },
      })),
    };
  });

describe('useBulkDialogData', () => {
    it("useBulkDialogData", async () => {
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
        const { result } = renderHook(() => useBulkDialogData(), {
            wrapper,
        });

        const {
            isClassifyLoading,
            onActionResultHandler,
            onNotificationCashflowUpdateHandler,
        } = result.current;

        expect(isClassifyLoading).toBe(true);
        await onActionResultHandler(["test_id"], Promise.resolve([]));
        onNotificationCashflowUpdateHandler([mockCashflow1]);
    });
    it("classifyCashflows", async () => {
        const { cashflowIdsWithAfirmationException, cashflowIdsWithBackValueDateException } = await classifyCashflows([mockCashflow1], BulkUserType.Maker,false);
        expect(cashflowIdsWithAfirmationException).toEqual([]);
        expect(cashflowIdsWithBackValueDateException).toEqual([]);
    });
});
