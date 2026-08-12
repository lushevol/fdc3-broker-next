import { configureStore, createReducer } from "@reduxjs/toolkit";
import { fn, ReduxProviderWrapper,renderHook } from "@Test/test-utils";

import { ExceptionBundleStatusTypes } from "../../CashflowDetails/MultiExceptions/common/interface";
import { mockMessageApi, mockModalApi } from "../test/mockUtils/antd";
import { BulkUserType } from "../type";
import { useBulkActionController } from "./useBulkActionController";

describe('useBulkActionController', () => {
    it("useBulkActionController", async () => {
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
        const { result } = renderHook(() => useBulkActionController({
            messageApi: mockMessageApi,
            modalApi: mockModalApi,
            selectedCashflowIds: [],
            submit: fn(async () => []),
            precheckBeforeSubmit: fn(async () => true),
            onActionResultHandler: fn(async () => []),
            closeDialog: fn(),
        }), {
            wrapper,
        });

        const {
            availableActions,
            onClickAction,
        } = result.current;

        expect(availableActions.length).toBe(1);

        onClickAction(ExceptionBundleStatusTypes.Submit);
    });
});