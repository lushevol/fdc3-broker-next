import React from "react";
import { render, screen } from "@testing-library/react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";

describe("SearchGrid component", () => {
  it("should be in the document", () => {
    render(<Provider data={{ theme: "dark" }}>
      <ThemeProvider>
        <Root>Search</Root>
      </ThemeProvider>
    </Provider>);
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
  });
  it("should be in the document", () => {
    render(<Provider data={{ theme: "light" }}>
      <ThemeProvider>
        <Root>Search</Root>
      </ThemeProvider>
    </Provider>);
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
  });
});
