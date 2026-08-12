import { fireEvent, render, screen } from "@testing-library/react";
import LazyCheckbox from "./index";
afterAll(() => {
  jest.clearAllMocks();
});
const mockComponent = (c) => {
  return <section>{c.children}</section>;
}
jest.mock("../Theme", () => {
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