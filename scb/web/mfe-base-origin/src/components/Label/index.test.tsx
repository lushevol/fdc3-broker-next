import React from "react";
import { render, screen } from "@testing-library/react";
import LabelComp, { MenuItem } from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";

export const Comp = () => {
  const [selectedLabel, setLabel] = React.useState<string>();

  const handleChange = (event) => {
    setLabel(event.target.value as string);
  };
  return (
    <LabelComp onChange={handleChange} label="Label" value={selectedLabel} >
      <MenuItem value='Affirmation Status'>Affirmation Status</MenuItem>
      <MenuItem value='Confirmation Status'>Confirmation Status</MenuItem>
      <MenuItem value='POU Status'>POU Status</MenuItem>
    </LabelComp>
  )
};

export const Comp2 = () => {
  const [selectedLabel, setLabel] = React.useState<string>();

  const handleChange = (event) => {
    setLabel(event.target.value as string);
  };
  return (
    <LabelComp onChange={handleChange} label="Another Label" value={selectedLabel} >
      <MenuItem value='Affirmation Status'>Affirmation Status</MenuItem>
      <MenuItem value='Confirmation Status'>Confirmation Status</MenuItem>
      <MenuItem value='POU Status'>POU Status</MenuItem>
    </LabelComp>
  )
};

describe("Label component", () => {
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
