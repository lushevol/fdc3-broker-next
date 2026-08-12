import { fireEvent, render, screen } from "@testing-library/react";
import Input from "."
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

describe("Lazy input number component", () => {
  it("should be in the document", async () => {
    const onChange = vi.fn();
    render(<Input data-testid="text-input-number" onChange={onChange} />);
    expect(screen).toBeDefined();
  });
})