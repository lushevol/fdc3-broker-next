import { screen, render } from "@testing-library/react";
import RatanQueryBuilder from "./export";

afterAll(() => {
  vi.clearAllMocks();
});

describe("Export RatanQueryBuilder", () => {
  it("should be in the document", async () => {
    const props = {
      fields: [],
      query: {
        combinator: "and",
        rules: [],
      },
      onQueryChange: vi.fn(),
    };
    render(<RatanQueryBuilder {...props} />);
    expect(screen).toBeDefined();
  });
});
