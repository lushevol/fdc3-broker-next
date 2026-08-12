import { render } from "@testing-library/react";

import RefreshAlert from "./RefreshAlert";

afterAll(() => {
  jest.clearAllMocks();
});

describe("Refresh Alert", () => {
  it("should be in the document", async () => {
    const { container } = render(<RefreshAlert />);
    expect(container).toBeInTheDocument();
  });
});