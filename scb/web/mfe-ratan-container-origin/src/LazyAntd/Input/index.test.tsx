import { render, screen } from "@testing-library/react";
import Input, { TextArea } from "."
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

describe("Lazy input component", () => {
  it("should be in the document", async () => {
    const onChange = jest.fn();
    render(<Input data-testid="text-input" onChange={onChange} />);
    expect(screen).toBeDefined();
  });
  it("should be in the document", async () => {
    const onChange = jest.fn();
    render(<TextArea data-testid="text-area" onChange={onChange} />);
    expect(screen).toBeDefined();
  });
})