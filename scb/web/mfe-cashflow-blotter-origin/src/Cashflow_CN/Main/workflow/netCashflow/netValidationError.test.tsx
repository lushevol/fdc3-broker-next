import { render } from "@testing-library/react";

import netValidationError from "./netValidationError";

afterAll(() => {
  jest.clearAllMocks();
});

describe("Net Validation Error", () => {
  it("should be in the document", async () => {
    const { title, content } = netValidationError("test1", ["test2"]);
    const { getByText } = render(content);
    expect(title).toBe("test1");
    expect(getByText("test2")).toBeDefined();
  });
});
