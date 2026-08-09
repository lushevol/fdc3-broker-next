import { render, screen } from "@testing-library/react";
import Status from ".";


describe("Admin Module Status component", () => {
  it("should be in the document", () => {
    render(<Status
      value={true}
    />);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(<Status
      value={false}
    />);
    expect(screen).toBeDefined();
  });
});
