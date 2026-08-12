
import { renderHook } from "@testing-library/react";
import { GridReadyEvent } from "ag-grid-community";
import { StaticRuleRow } from "src/Cashflow_Splitting_Static/services/api.type";
import createStore from "src/Cashflow_Splitting_Static/store";
import { mockAggridEvent } from "src/test/mockUtils/aggrid";
import { ReduxProviderWrapper } from "src/test/test-utils";

import { ActionType, RuleStatusType } from "../../state/types";
import { useDataGrid } from "./useDataGrid";

export const mockStaticRule: StaticRuleRow[] = [
  {
    id: 100,
    ruleUniqueId: 123,
    dataStatus: RuleStatusType.AddPending,
    createdAt: "20251109",
    updatedAt: "20251109",
    makerId: "1243644",
    checkerId: "5555",
    updateRecordId: "100",
    entityFmCode: "testFmCode",
    entityFmId: "testFmId",
    family: "test",
    group: "test",
    type: "test",
    typology: "test",
    strategy: "test",
    beneficiaryBic: "test",
    amount: "amount",
    currency: "currency",
    limitation: "limitation",
    nostroAgent: "nostroAgent",
    threshold: "threshold",

  },
];

describe("useDataGrid", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('useDataGrid 1', () => {
    const store = createStore();
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() => useDataGrid(), { wrapper });
    result.current.onGridReady(mockAggridEvent as GridReadyEvent);
    result.current.gridOptions.onRowDoubleClicked?.({
      data: undefined,
      node: undefined as any,
      rowIndex: null,
      rowPinned: undefined,
      api: undefined as any,
      context: undefined,
      type: "rowDoubleClicked"
    });
    result.current.handleRightMenuAction(ActionType.Update, mockStaticRule);
    result.current.handleRightMenuAction(ActionType.ApproveUpdate, mockStaticRule);
    expect(result.current.gridOptions.getRowId?.({
      data: mockStaticRule[0],
      level: 0,
      api: mockAggridEvent.api,
      context: undefined
    })).toBe("100");
  });
});
