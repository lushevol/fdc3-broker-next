import { renderHook } from "@testing-library/react";
import { GridReadyEvent } from "ag-grid-community";
import { mockAggridEvent } from "src/test/mockUtils/aggrid";
import { ReduxProviderWrapper } from "src/test/test-utils";

import { ActionType } from "../../state/types";
import store from "../../store";
import { mockUtilizationRules } from "../../test/mock/mockRules";
import { useDataGrid } from "./useDataGrid";

it("useDataGrid", () => {
  const wrapper = ReduxProviderWrapper(store());
  const { result } = renderHook(() => useDataGrid(), { wrapper });
  result.current.onGridReady(mockAggridEvent as GridReadyEvent);
  result.current.gridOptions.onRowDoubleClicked?.({
    data: undefined,
    node: undefined as any,
    rowIndex: null,
    rowPinned: undefined,
    api: undefined as any,
    context: undefined,
    type: "rowDoubleClicked",
  });
  result.current.handleRightMenuAction(ActionType.Update, mockUtilizationRules);
  result.current.handleRightMenuAction(
    ActionType.ApproveUpdate,
    mockUtilizationRules
  );
  expect(
    result.current.gridOptions.getRowId?.({
      data: mockUtilizationRules[0],
      level: 0,
      api: mockAggridEvent.api,
      context: undefined,
    })
  ).toBe("100");
});
