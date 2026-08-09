import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { PREFIX } from "./common/style";
import useController from "./common/useController";

const Comp = () => {
  const { toggleColorMode } = useController();
  React.useEffect(() => {
    toggleColorMode();
  }, []);
  return (<Root />);
};

describe("Switch component", () => {
  it("should be in the document", () => {
    render(<Provider data={{ theme: "dark" }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    expect(screen.getByText(/light/i)).toBeInTheDocument();
    const switchStyled = screen.getByTestId(`${PREFIX}_SwitchStyled`);
    expect(switchStyled).toBeInTheDocument();
    switchStyled.click();
  });
  it("should be in the document", () => {
    render(<Provider data={{ theme: "light" }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    expect(screen.getByText(/dark/i)).toBeInTheDocument();
    const switchStyled = screen.getByTestId(`${PREFIX}_SwitchStyled`);
    expect(switchStyled).toBeInTheDocument();
    switchStyled.click();
  });
});
