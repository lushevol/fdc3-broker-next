import { fireEvent, render } from "@testing-library/react";
import { AUTHORIZATION_LIMITS_BLOTTER_CREATE_BTN } from "src/Root/analysis/const";

import CashflowAuthorizationLimits from "./index";

afterAll(() => {
  vi.clearAllMocks();
});

vi.mock("../services", () => {
  return {
    __esModule: true,
    default: vi.fn(() => {
      return {
        getLimitationList: vi.fn(async () => []),
        createLimitation: vi.fn(async () => ({})),
        updateLimitation: vi.fn(async () => ({})),
        deleteLimitation: vi.fn(async () => ({})),
        approveActionLimitation: vi.fn(async () => ({})),
        rejectActionLimitation: vi.fn(async () => ({})),
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