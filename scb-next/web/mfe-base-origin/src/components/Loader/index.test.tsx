import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { PREFIX } from "./common/style";

describe("Loader component", () => {
  it("should be in the document", () => {
    render(
      <Provider data={{ theme: "dark" }}>
        <ThemeProvider>
          <Root
            text="Loading 345"
            size="20px"
          />
        </ThemeProvider>
      </Provider>
    );
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    expect(screen.getByText(/loading 345/i)).toBeInTheDocument();
  });
  it("should be in the document", () => {
    render(
      <Provider data={{ theme: "light" }}>
        <ThemeProvider>
          <Root />
        </ThemeProvider>
      </Provider>
    );
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
  });
});
