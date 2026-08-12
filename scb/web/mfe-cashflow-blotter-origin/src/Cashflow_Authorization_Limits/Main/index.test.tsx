import { fireEvent, render } from "@testing-library/react";
import { AUTHORIZATION_LIMITS_BLOTTER_CREATE_BTN } from "src/Root/analysis/const";

import CashflowAuthorizationLimits from "./index";

afterAll(() => {
  jest.clearAllMocks();
});

jest.mock("../services", () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return {
        getLimitationList: jest.fn(async () => []),
        createLimitation: jest.fn(async () => ({})),
        updateLimitation: jest.fn(async () => ({})),
        deleteLimitation: jest.fn(async () => ({})),
        approveActionLimitation: jest.fn(async () => ({})),
        rejectActionLimitation: jest.fn(async () => ({})),
      };
    })
  }
})

describe("Authorization Limits Entry", () => {
  it("should be in the document", async () => {
    const { container, queryByTestId } = render(<CashflowAuthorizationLimits tile="currency-limitation" />);
    expect(container).toBeInTheDocument();
    const createBtn = queryByTestId(AUTHORIZATION_LIMITS_BLOTTER_CREATE_BTN);
    expect(createBtn).toBeInTheDocument();
    fireEvent.click(createBtn!);
    const detailsDialog = queryByTestId("mui-dialog");
    expect(detailsDialog).toBeInTheDocument();
  });
});