import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper,renderHook } from "@Test/test-utils";

import { BulkUserType } from "../type";
import { useBulkDialogController } from "./useBulkDialogController";

describe('useBulkDialogController', () => {
    it("useBulkDialogController", async () => {
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
        const { result } = renderHook(() => useBulkDialogController(), {
            wrapper,
        });

        const {
            closeDialog,
            dialogTitle,
        } = result.current;

        expect(dialogTitle).toBe("Bulk Fix Exceptions");

        closeDialog();
    });
});