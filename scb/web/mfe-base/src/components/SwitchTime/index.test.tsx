import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { PREFIX } from "./common/style";
import useController from "./common/useController";
afterAll(() => {
  jest.clearAllMocks();
});
const Comp = () => {
  const { store, toggleTimeType } = useController();
  React.useEffect(() => {
    toggleTimeType();
  }, []);
  return (<Root />);
};

describe("SwitchTime component", () => {
  it("should be in the document", () => {
    render(<Provider data={{ timeType: "utc" }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    const switchStyled = screen.getByTestId(`${PREFIX}_switchtime`);
    expect(switchStyled).toBeInTheDocument();
    switchStyled.click();
    expect(screen.getByText(/local/i)).toBeInTheDocument();
  });
  it("should be in the document", () => {
    render(<Provider data={{ timeType: "local" }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    const switchStyled = screen.getByTestId(`${PREFIX}_switchtime`);
    expect(switchStyled).toBeInTheDocument();
    switchStyled.click();
    expect(screen.getByText(/utc/i)).toBeInTheDocument();
  });
});
