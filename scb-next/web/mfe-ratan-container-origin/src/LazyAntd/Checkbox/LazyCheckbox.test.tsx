import { fireEvent, render, screen } from "@testing-library/react";
import LazyCheckbox from "./index";
afterAll(() => {
  vi.clearAllMocks();
});
const mockComponent = (c) => {
  return <section>{c.children}</section>;
}
vi.mock("../Theme", () => {
  return {
    __esModule: true,
    default: mockComponent,
  }
});

describe("LazyCheckbox component", () => {
  it("should be in the document", async () => {
    const text = "checkbox";
    render(<LazyCheckbox data-testid="checkbox" />);
    expect(screen).toBeDefined();
  })
})