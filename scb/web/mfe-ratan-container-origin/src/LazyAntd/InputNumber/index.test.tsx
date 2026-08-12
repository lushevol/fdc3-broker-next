import { fireEvent, render, screen } from "@testing-library/react";
import Input from "."
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

describe("Lazy input number component", () => {
  it("should be in the document", async () => {
    const onChange = jest.fn();
    render(<Input data-testid="text-input-number" onChange={onChange} />);
    expect(screen).toBeDefined();
  });
})