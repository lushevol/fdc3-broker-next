import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { PREFIX } from "./common/style";

describe("Splash component", () => {
  it("should be in the document", () => {
    render(<Provider data={{ theme: "dark" }}>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </Provider>);
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    expect(screen.getByText(/please wait.../i)).toBeInTheDocument();
  });
});
