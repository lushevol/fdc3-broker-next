import { configureStore, createReducer } from "@reduxjs/toolkit";
import { fn,ReduxProviderWrapper, renderHook } from "@Test/test-utils";
import { mockCashflow1 } from "src/Cashflow_CN/test/mockData/cashflow";

import { BulkUserType } from "../type";
import { useNotificationHandler } from "./useNotificationHandler";

describe('useNotificationHandler', () => {
    it("useNotificationHandler", async () => {
        const store = configureStore({
          reducer: {
            bulkFixExceptions: createReducer({
                isOpenDialog: true,
                cashflowsReadyToFix: [],
                userType: BulkUserType.Maker,
            }, () => {}),
            latestNotificationStack: createReducer({
                id: "test",
                pool: [
                    mockCashflow1,
                ]
            }, () => {}),
          },
        });
        const wrapper = ReduxProviderWrapper(store);
        const mockNotificationHandler = fn();
        renderHook(() => useNotificationHandler({ onNotificationComes: mockNotificationHandler }), {
            wrapper,
        });

        expect(mockNotificationHandler).toHaveBeenCalled();
    });
});