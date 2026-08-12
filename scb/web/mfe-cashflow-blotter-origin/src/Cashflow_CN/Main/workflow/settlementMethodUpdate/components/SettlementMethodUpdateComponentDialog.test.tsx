import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper, render } from "@Test/test-utils";
import { SETTLEMENT_METHOD_UPDATE_SUBMIT_BTN } from "src/Root/analysis/const";

import { SettlementMethodUpdateComponentDialog } from "./SettlementMethodUpdateComponentDialog";

describe("SettlementMethodUpdateComponentDialog", () => {
  it("BulkDialog should render in document", () => {
    const store = configureStore({
      reducer: {
        latestNotificationStack: createReducer(
          {
            id: "",
            pool: [],
          },
          () => {}
        ),
        settlementMethodUpdateWorkflow: createReducer(
          {
            isOpenDialog: true,
            cashflowData: [],
            cashflowDataByTrade: [],
          },
          () => {}
        ),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { queryByTestId } = render(
      <SettlementMethodUpdateComponentDialog />,
      { wrapper }
    );
    expect(
      queryByTestId(SETTLEMENT_METHOD_UPDATE_SUBMIT_BTN)
    ).toBeInTheDocument();
  });
});
