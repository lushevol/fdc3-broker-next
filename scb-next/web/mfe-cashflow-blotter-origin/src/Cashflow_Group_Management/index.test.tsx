import { render } from "@testing-library/react";

import CashflowGroupBlotter from "./index";

afterAll(() => {
  vi.clearAllMocks();
});

describe("Grouping Blotter Entry", () => {
  it("should be in the document", async () => {
    const filters = [
      {
        field: "Status",
        operator: "EQ",
        values: "PENDING",
      }
    ];
    const { container } = render(<CashflowGroupBlotter tile="cashflow-blotter" parameters={{ filters }} />);
    expect(container).toBeInTheDocument();
  });
});