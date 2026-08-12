import { fn } from "@Test/test-utils";
import { SelectionChangedEvent } from "ag-grid-community";
import { HookAPI } from "antd/es/modal/useModal";
import { PAGE_SIZE_FOR_CASHFLOW } from "src/Cashflow_CN/Main/config/UIconfig";

import { dataGridSelectionChangedHandler } from "./utils";

jest.mock("src/Root/common/utils/featureFlagController", () => {
    return {
        featureScopedEnabled: () => true,
    }
});

describe('AutoLoadButton', () => {
    it("dataGridSelectionChangedHandler", () => {
        const mockSelectionChangedEvent = {
            api: {
                getSelectedRows: fn(() => new Array(10)),
                getDisplayedRowCount: fn(() => 10),
            }
        } as unknown as SelectionChangedEvent;
        const mockDispatch = fn(() => ({ isClientSelectAllDataButNotLoadAll: true, totalHits: 20 }));
        const mockModalInstance = {
            error: fn(),
        } as unknown as HookAPI;
        dataGridSelectionChangedHandler(mockSelectionChangedEvent, mockDispatch, mockModalInstance, PAGE_SIZE_FOR_CASHFLOW);
        expect(mockModalInstance.error).toHaveBeenCalled();
    })
    it("dataGridSelectionChangedHandler when isClientSelectAllDataButNotLoadAll is false", () => {
        const mockSelectionChangedEvent = {
            api: {
                getSelectedRows: fn(() => new Array(10)),
                getDisplayedRowCount: fn(() => 10),
            }
        } as unknown as SelectionChangedEvent;
        const mockDispatch = fn(() => ({ isClientSelectAllDataButNotLoadAll: false, totalHits: 20 }));
        const mockModalInstance = {
            error: fn(),
        } as unknown as HookAPI;
        dataGridSelectionChangedHandler(mockSelectionChangedEvent, mockDispatch, mockModalInstance, PAGE_SIZE_FOR_CASHFLOW);
        expect(mockModalInstance.error).not.toHaveBeenCalled();
    })
});