import { render, screen } from "@testing-library/react";
import Input, { TextArea } from "."
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

describe("Lazy input component", () => {
  it("should be in the document", async () => {
    const onChange = vi.fn();
    render(<Input data-testid="text-input" onChange={onChange} />);
    expect(screen).toBeDefined();
  });
  it("should be in the document", async () => {
    const onChange = vi.fn();
    render(<TextArea data-testid="text-area" onChange={onChange} />);
    expect(screen).toBeDefined();
  });
})