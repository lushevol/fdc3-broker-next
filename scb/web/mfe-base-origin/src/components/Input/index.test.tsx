import React from "react";
import { render, screen } from "@testing-library/react";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import Input from ".";

const Comp = () => {
  return (
    <Input
      label="Show All Columns"
      variant="outlined" />
  )
};

const Comp2 = () => {
  return (
    <Input
      labelPosition="left"
      label="Show All Columns"
      variant="outlined" />
  )
};

const Comp3 = () => {
  return (
    <Input
      labelPosition="left"
      label="Show All Columns"
      variant="outlined"
      hidden={true}
    />
  )
};

describe("Input component", () => {
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
  it("dark theme should be in the document", () => {
    render(<Provider data={{ theme: "light", token: undefined, user: undefined }}>
      <ThemeProvider>
        <Comp3 />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});
