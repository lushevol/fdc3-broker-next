import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper,renderHook } from "@Test/test-utils";

import { BulkUserType } from "../type";
import { useAffirmationAction, useBackValueDateAction, useBulkExtraForm } from "./useBulkExtraForm";

describe('useBulkExtraForm', () => {
    it("useBulkExtraForm", async () => {
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
        const { result } = renderHook(() => useBulkExtraForm(), {
            wrapper,
        });

        const {
            submitExtraForm,
            validateExtraForm,
        } = result.current;

        const res = await submitExtraForm();
        expect(res).toBeUndefined();

        expect(await validateExtraForm()).toBe(false);
    });
    it("useAffirmationAction", async () => {
        expect.assertions(2);
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
        const { result } = renderHook(() => useAffirmationAction(), {
            wrapper,
        });

        const {
            submitAffirmationForm,
            validateAffirmationForm,
        } = result.current;

        try {
            await validateAffirmationForm();
        } catch (error) {
            expect(error).toBeDefined();
        }

        try {
            await submitAffirmationForm();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
    it("useBackValueDateAction", async () => {
        expect.assertions(2);
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
        const { result } = renderHook(() => useBackValueDateAction(), {
            wrapper,
        });

        const {
            submitBackValueDateForm,
            validateBackValueDateForm,
        } = result.current;

        try {
            await validateBackValueDateForm();
        } catch (error) {
            expect(error).toBeDefined();
        }
        
        try {
            await submitBackValueDateForm();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});