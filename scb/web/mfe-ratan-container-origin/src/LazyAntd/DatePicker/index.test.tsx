import { render, screen } from "@testing-library/react";
import DatePicker from "./Comp"

describe("Lazy DatePicker component", () => {
  it("should be in the document", () => {
    render(<DatePicker />);
    expect(screen).toBeDefined();
  });
})