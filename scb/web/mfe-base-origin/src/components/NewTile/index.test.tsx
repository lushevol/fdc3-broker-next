import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import { PREFIX } from "./common/style";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";

describe("NewTile component", () => {
  it("should be in the document", () => {
    render(<Provider data={{ user: { id: "123" }, token: "123", theme: "dark" }}>
      <ThemeProvider>
        <Root toggleDrawer={() => { }} />
      </ThemeProvider>
    </Provider>);
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    expect(screen.getByText(/new tile/i)).toBeInTheDocument();
  });
  it("should be in the document", () => {
    render(<Provider data={{ user: { id: "123" }, token: "123", theme: "light" }}>
      <ThemeProvider>
        <Root toggleDrawer={() => { }} />
      </ThemeProvider>
    </Provider>);
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    expect(screen.getByText(/new tile/i)).toBeInTheDocument();
  });
});
