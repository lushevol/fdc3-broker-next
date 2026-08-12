import { render, screen } from "@testing-library/react";
import TimePicker from "."

describe("Lazy TimePicker component", () => {
  it("should be in the document", () => {
    render(<TimePicker />);
    expect(screen).toBeDefined();
  });
})