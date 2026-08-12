import { GetContextMenuItemsParams } from "ag-grid-community";
import { message, Modal } from "antd";
import _merge from "lodash/merge";

import { mockCashflow1 } from "../../../test/mockData/cashflow";
import { WorkflowActionExtraOptions } from "../../common/interface";
import { openTradeDetailsDialog } from "./viewTradeDetailsRightMenu";

afterAll(() => {
  jest.clearAllMocks();
});


test("openTradeDetailsDialog", () => {
  const details = {
    Trade_Id: "123",
    Data_Flow: {
      Data_Source_System: "Murex"
    }
  };
  const dispatch = jest.fn();
  const options = { dispatch };

  openTradeDetailsDialog(details, options);

  expect(dispatch).toBeCalledTimes(1);
});