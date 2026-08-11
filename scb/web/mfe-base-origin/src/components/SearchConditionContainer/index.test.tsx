import React from "react";
import { render, screen } from "@testing-library/react";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import SearchCondition from "../SearchCondition";
import SearchConditionContainer, { modeStyle, modeBorderStyle } from ".";

const Comp = () => {
  const handleClose = (event: React.SyntheticEvent<Element, Event>) => {
    //do whatever you need here
  }
  return (
    <SearchConditionContainer>
      <SearchCondition label={"Status"} value={"Affirmation Status"} onClose={handleClose} />
      <SearchCondition label={"Client FMID"} value={"CP28343"} onClose={handleClose} />
      <SearchCondition label={"Status"} value={"Affirmation Status"} onClose={handleClose} />
      <SearchCondition label={"Client FMID"} value={"CP28343"} onClose={handleClose} />
      <SearchCondition label={"Status"} value={"Affirmation Status"} onClose={handleClose} />
      <SearchCondition label={"Client FMID"} value={"CP28343"} onClose={handleClose} />
      <SearchCondition label={"Status"} value={"Affirmation Status"} onClose={handleClose} />
      <SearchCondition label={"Client FMID"} value={"CP28343"} onClose={handleClose} />
    </SearchConditionContainer>
  )
};

describe("SearchConditionContainer component", () => {
  it("light theme should be in the document", () => {
    render(<Provider data={{ theme: "light", token: undefined, user: undefined }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    expect(modeStyle("dark")).toEqual("rgba(0, 0, 0, 1)");
    expect(modeStyle("light")).toEqual("rgba(243, 243, 243, 1)");
    expect(modeBorderStyle("dark")).toEqual("1px solid rgba(44, 63, 94, 1)");
    expect(modeBorderStyle("light")).toEqual("1px solid rgba(208, 208, 208, 1)");
  });
  it("dark theme should be in the document", () => {
    render(<Provider data={{ theme: "dark", token: undefined, user: undefined }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const fab = screen.getByTestId("SearchConditionContainer-fab")
    expect(fab).toBeInTheDocument();
    fab.click();
  });
});
