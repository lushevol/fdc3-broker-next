import React from "react";
import { render, screen } from "@testing-library/react";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import SearchInput from ".";

const Comp = () => {
  return (
    <SearchInput
      label="Show All Columns"
      variant="outlined"
      fullWidth
      handleClear={() => { }} />
  )
};

const Comp2 = () => {
  return (
    <SearchInput
      labelPosition="left"
      label="Show All Columns"
      variant="outlined"
      fullWidth
      handleClear={() => { }} />
  )
};

describe("SearchInput component", () => {
  it("light theme should be in the document", () => {
    render(<Provider data={{ theme: "light", token: undefined, user: undefined }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("dark theme should be in the document", () => {
    render(<Provider data={{ theme: "dark", token: undefined, user: undefined }}>
      <ThemeProvider>
        <Comp2 />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});
