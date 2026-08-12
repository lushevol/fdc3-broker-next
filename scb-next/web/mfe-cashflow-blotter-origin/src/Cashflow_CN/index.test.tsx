import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import CashflowBlotter from "./index";

describe("Cashflow Blotter Entry", () => {
  it("should be in the document", async () => {
    const { container } = render(<MemoryRouter><CashflowBlotter tile="cashflow-blotter" /></MemoryRouter>);
    expect(container).toBeInTheDocument();
  });
});