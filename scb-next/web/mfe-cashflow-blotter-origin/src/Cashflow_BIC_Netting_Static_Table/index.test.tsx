import { render } from "@testing-library/react";

import CashflowBicNettingStaticBlotter from "./index";

describe("Cashflow BIC Netting Static Blotter Entry", () => {
  it("should be in the document", async () => {
    const { container } = render(<CashflowBicNettingStaticBlotter tile="cashflow-bic-netting-static-blotter" />);
    expect(container).toBeInTheDocument();
  });
});