import { screen, render } from "@testing-library/react";
import RatanQueryBuilder from "./export";

afterAll(() => {
  jest.clearAllMocks();
});

describe("Export RatanQueryBuilder", () => {
  it("should be in the document", async () => {
    const props = {
      fields: [],
      query: {
        combinator: "and",
        rules: [],
      },
      onQueryChange: jest.fn(),
    };
    render(<RatanQueryBuilder {...props} />);
    expect(screen).toBeDefined();
  });
});
