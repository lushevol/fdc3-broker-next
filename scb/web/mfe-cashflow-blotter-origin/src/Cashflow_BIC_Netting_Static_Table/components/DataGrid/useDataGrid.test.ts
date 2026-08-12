import { renderHook } from "@testing-library/react";
import { GridReadyEvent, IRowNode } from "ag-grid-community";
import { ActionType } from "src/Cashflow_BIC_Netting_Static_Table/state/types";
import { store } from "src/Cashflow_BIC_Netting_Static_Table/store";
import { mockBicNettingRules } from "src/Cashflow_BIC_Netting_Static_Table/test/mock/mockRules";
import { mockAggridEvent } from "src/test/mockUtils/aggrid";
import { fn,ReduxProviderWrapper } from "src/test/test-utils";

import { useDataGrid } from "./useDataGrid";

it('useDataGrid', () => {
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() => useDataGrid(), { wrapper });
    result.current.onGridReady(mockAggridEvent as GridReadyEvent);
    result.current.onPaginationChange({ ...mockAggridEvent, newPage: false, type: "paginationChanged" });
    result.current.gridOptions.onRowDoubleClicked?.({
        data: undefined,
        node: undefined as any,
        rowIndex: null,
        rowPinned: undefined,
        api: undefined as any,
        context: undefined,
        type: "rowDoubleClicked"
    });
    result.current.handleRightMenuAction(ActionType.Update, mockBicNettingRules);
    result.current.handleRightMenuAction(ActionType.ApproveUpdate, mockBicNettingRules);
    result.current.serverSideDatasource?.getRows({
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
    expect(result.current.gridOptions.getRowId?.({
        data: mockBicNettingRules[0],
        level: 0,
        api: mockAggridEvent.api,
        context: undefined
    })).toBe("100");
});