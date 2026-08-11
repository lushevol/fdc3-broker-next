import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { PREFIX } from "./common/style";

describe("Version component", () => {
  it("should be in the document", () => {
    render(<Provider data={{ theme: "dark" }}>
      <ThemeProvider>
        <Root version={"1234"}/>
      </ThemeProvider>
    </Provider>);
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    expect(screen.getByText(/version: 1234/i)).toBeInTheDocument();
  });
});
