import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper, render } from "@Test/test-utils";
import { BULK_FIX_SUBMIT_BTN } from "src/Root/analysis/const";

import { BulkUserType } from "../type";
import { BulkDialog } from "./BulkDialog";

describe('BulkDialog', () => {
  it("BulkDialog should render in document", () => {
    const store = configureStore({
      reducer: {
        latestNotificationStack: createReducer(
          {
            id: "",
            pool: [],
          }, () => {}
        ),
        bulkFixExceptions: createReducer({
            isOpenDialog: true,
            cashflowsReadyToFix: [],
            userType: BulkUserType.Maker,
        }, () => {}),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { queryByTestId } = render(<BulkDialog />, { wrapper });
    expect(queryByTestId(BULK_FIX_SUBMIT_BTN)).toBeInTheDocument();
  });
});
