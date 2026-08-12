import { render } from "@testing-library/react";

import SplittingStaticBlotter from "./index";

describe("Cashflow Splitting Static Blotter Entry", () => {
  it("should be in the document", async () => {
    const { container } = render(<SplittingStaticBlotter tile="cashflow-splitting-static-blotter" />);
    expect(container).toBeInTheDocument();
  });
});