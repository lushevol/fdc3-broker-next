import React from "react";
import { render, screen } from "@testing-library/react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";

describe("Button component", () => {
  it("should be in the document", () => {
    const onClick = jest.fn();
    render(<Provider data={{ theme: "dark" }}>
      <ThemeProvider>
        <Root data-testid="button" onClick={onClick}>Login</Root>
      </ThemeProvider>
    </Provider>);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    const Button = screen.getByTestId("button");
    expect(Button).toBeInTheDocument();
    Button.click();
    expect(onClick).toBeCalled();
  });
});
