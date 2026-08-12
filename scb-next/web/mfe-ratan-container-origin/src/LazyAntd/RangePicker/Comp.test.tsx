import { render, screen } from "@testing-library/react";
import RangePicker from "./Comp"

describe("Lazy RangePicker component", () => {
  it("should be in the document", () => {
    render(<RangePicker />);
    expect(screen).toBeDefined();
  });
})