import { render, screen } from "@testing-library/react";
import Select, { Option, OptGroup } from "."

const mockComponent = (c) => {
  return <section>{c.children}</section>;
}
jest.mock("../Theme", () => {
  return {
    __esModule: true,
    default: mockComponent,
  }
});

describe("Lazy Select component", () => {
  it("should be in the document", async () => {
    render(<Select data-testid="Select"><OptGroup><Option>test</Option></OptGroup></Select>);
    expect(screen).toBeDefined();
  });
})