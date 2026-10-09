import React from "react";
import { render, screen } from "@testing-library/react";
import { ToggleButtonGroup } from "@mui/material";
import ToggleButton, { modeStyle } from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";

export const Comp = () => {
  const [selectedValue, setSelectedValue] = React.useState<string | null>('Tracking');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    neValue: string | null,
  ) => {
    setSelectedValue(neValue);
  };

  return (
    <ToggleButtonGroup
      value={selectedValue}
      exclusive
      onChange={handleAlignment}
      aria-label="value"
    >
      <ToggleButton color="primary" value="Tracking" aria-label="Tracking">
        Tracking
      </ToggleButton>
      <ToggleButton color="primary" value="Archived" aria-label="Archived">
        Archived
      </ToggleButton>
    </ToggleButtonGroup>
  )
};

describe("ToggleButton component", () => {
  it("light theme should be in the document", () => {
    render(<Provider data={{ theme: "light", token: undefined, user: undefined }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    expect(modeStyle({ shape: { borderRadius: "5px" } }, "dark")).toBeDefined();
    expect(modeStyle({ shape: { borderRadius: "5px" } }, "light")).toBeDefined();
  });
  it("dark theme should be in the document", () => {
    render(<Provider data={{ theme: "dark", token: undefined, user: undefined }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});
