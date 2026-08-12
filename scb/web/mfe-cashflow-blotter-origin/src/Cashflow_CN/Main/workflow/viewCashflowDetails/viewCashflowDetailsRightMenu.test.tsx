import { message, Modal } from "antd";

import { viewCashflowDetailsAction } from "../../store/actions";
import { openCashflowDetailDialog } from "./viewCashflowDetailsRightMenu";

afterAll(() => {
  jest.clearAllMocks();
});
beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("../../store/actions", () => ({
  viewCashflowDetailsAction: jest.fn(),
  updateCashflow: jest.fn(),
}));

describe("openCashflowDetailDialog", () => {
  const data = {
    Cashflow: {
      Cashflow_Id: "12345",
    },
  };
  const data2 = {
    Cashflow: {},
  };
  const defaultTabKey = "tab1";
  const options = {
    dispatch: jest.fn(),
    modalApi: Modal,
    messageApi: message
  };

  it("should dispatch viewCashflowDetailsAction and updateCashflow", () => {
    openCashflowDetailDialog(data, defaultTabKey, options);

    expect(options.dispatch).toHaveBeenCalledTimes(1);
    expect(viewCashflowDetailsAction).toHaveBeenCalledWith({
      isOpenCashflowDetails: true,
      defaultTabKey,
      data,
      refreshCashflow: expect.any(Function),
    });
  });
  it("should dispatch viewCashflowDetailsAction when cashflow id is null", () => {
    openCashflowDetailDialog(data2, defaultTabKey, options);
    expect(options.dispatch).toHaveBeenCalledTimes(1);
  });
  it("should dispatch viewCashflowDetailsAction when data has not cashflow", () => {
    openCashflowDetailDialog({}, defaultTabKey, options);
    expect(options.dispatch).toHaveBeenCalledTimes(1);
  });
});