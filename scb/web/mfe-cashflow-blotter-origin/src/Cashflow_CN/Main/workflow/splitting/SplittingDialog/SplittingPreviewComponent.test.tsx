import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper } from "@Test/test-utils";
import { render } from "@testing-library/react";
import { DataGrid } from "Import/ratancomponents";
import React, { useEffect } from "react";
import { mockCashflow1 } from "src/Cashflow_CN/test/mockData/cashflow";

import { RoundingType, SplitActionType } from "../common/interface";
import { SplittingPreviewComponent } from "./SplittingPreviewComponen";

jest.mock("../common/SplitCashflowDialogUtils", () => ({
  useQuerySplitting: () => ({
    querySplittingParallel: jest.fn(),
  }),
}));

jest.mock("../../../config/fieldsConfig", () => ({
  splittingCashflowPreviewGrid: jest.fn(() => [{ field: "child" }]),
  splittingCashflowSourceGrid: [{ field: "parent" }],
}));


describe("SplittingPreviewComponent", () => {
  const messageApi = { error: jest.fn(), success: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders parent and child DataGrid with correct split count", () => {
    jest.mocked(DataGrid).mockImplementation((props) => {
      const { onGridReady, gridOptions } = props;
      useEffect(() => {
        if (onGridReady) {
          const remove = onGridReady({
            api: {
              setRowData: () => { },
              forEachNode: (callback) =>
                callback({ key: "GENERAL", setExpanded: () => { } }),
              resetRowHeights: () => { },
              setGridOption: ()=>{},
            },
          });
          remove && remove();
        }
      }, []);
      return <section data-testid="mocked-datagrid"></section>;
    });
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: mockCashflow1,
          targetCashflows: [],
          initialTargetCashflows: [],
          amountSetting: {
            precision: 2,
            type: RoundingType.ROUNDING_OFF,
          },
          splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { getByText, getAllByTestId } = render(
      <SplittingPreviewComponent messageApi={messageApi as any} />, { wrapper }
    );
    expect(getByText("Parent Cashflow")).toBeInTheDocument();
    expect(getByText("Child Cashflows (Preview)")).toBeInTheDocument();
    expect(getAllByTestId("mocked-datagrid").length).toBeGreaterThan(0);
  });
});