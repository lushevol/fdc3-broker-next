import { render } from "@testing-library/react";

import CashflowUtilizationStaticBlotter from "./index";

describe("Cashflow Utilization Static Blotter Entry", () => {
  it("should be in the document", async () => {
    const { container } = render(
      <CashflowUtilizationStaticBlotter tile="cashflow-utilization-static-blotter" />
    );
    expect(container).toBeInTheDocument();
  });
});
