import { render } from "@testing-library/react";

import CashflowDashboard from "./index";

afterAll(() => {
  vi.clearAllMocks();
});

describe("Dashboard Entry", () => {
  it("should be in the document", async () => {
    const { container } = render(<CashflowDashboard tile="cashflow-dashboard" />);
    expect(container).toBeInTheDocument();
  });
});