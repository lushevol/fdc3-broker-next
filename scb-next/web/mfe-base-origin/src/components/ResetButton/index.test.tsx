import { render, screen } from "@testing-library/react";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import ResetButton from ".";

describe("ResetButton component", () => {
  it("should be in the document", () => {
    render(
      <Provider data={{ theme: "dark" }}>
        <ThemeProvider>
          <ResetButton>Reset</ResetButton>
        </ThemeProvider>
      </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(
      <Provider data={{ theme: "light" }}>
        <ThemeProvider>
          <ResetButton>Reset</ResetButton>
        </ThemeProvider>
      </Provider>);
    expect(screen).toBeDefined();
  });
});
