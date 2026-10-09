import React from "react";
import { render, screen } from "@testing-library/react";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import SearchCondition, { modeStyle } from ".";

const Comp = () => {
  return (
    <SearchCondition label={"Status"} value={"Affirmation Status"} onClose={() => { }} />
  )
};

describe("SearchCondition component", () => {
  it("light theme should be in the document", () => {
    render(<Provider data={{ theme: "light", token: undefined, user: undefined }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const Close = screen.getByTitle("Close")
    expect(Close).toBeInTheDocument();
    Close.click();
    expect(modeStyle("dark")).toEqual("rgba(203, 203, 203, 1)");
    expect(modeStyle("light")).toEqual("rgba(34,34,34, 1)");
  });
  it("dark theme should be in the document", () => {
    render(<Provider data={{ theme: "dark", token: undefined, user: undefined }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const Close = screen.getByTitle("Close")
    expect(Close).toBeInTheDocument();
    Close.click();
  });
});
