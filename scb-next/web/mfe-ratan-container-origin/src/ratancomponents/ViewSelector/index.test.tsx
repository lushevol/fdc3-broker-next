import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ViewSelector } from ".";

vi.mock("./ViewSelectorComp", () => ({
  __esModule: true,
  default: vi.fn(() => <div>Mock Comp</div>),
}));

describe("ViewSelector", () => {
  it("should render Comp component", async () => {
    render(<ViewSelector />);
    await waitFor(() => expect(screen.getByText("Mock Comp")).toBeInTheDocument());
  });
});
