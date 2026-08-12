import { renderHook } from "@testing-library/react";
import { IRowNode } from "ag-grid-community";
import { store } from "src/Cashflow_BIC_Netting_Static_Table/store";
import { mockAggridEvent } from "src/test/mockUtils/aggrid";
import { fn,ReduxProviderWrapper } from "src/test/test-utils";

import { useAuditDataGrid } from "./useAuditDataGrid";

it('useAuditDataGrid', () => {
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() => useAuditDataGrid(), { wrapper });
    result.current.onPaginationChange({ ...mockAggridEvent, newPage: false, type: "paginationChanged" });
    result.current.serverSideDatasource.getRows({
        api: mockAggridEvent.api,
        success: fn(),
        fail: fn(),
        request: {
            startRow: 0,
            endRow: 0,
            rowGroupCols: [],
            valueCols: [],
            pivotCols: [],
            pivotMode: false,
            groupKeys: [],
            filterModel: null,
            sortModel: [],
        },
        parentNode: undefined as unknown as IRowNode<any>,
        context: undefined
    });
});