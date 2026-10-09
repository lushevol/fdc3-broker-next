import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { PREFIX } from "./common/style";

const Comp = (props) => {
  return (<Root {...props}/>);
};


describe("SurveyButton component", () => {
  it("should be in the document", () => {
    const onClick = jest.fn();
    render(<Provider data={{ user: { id: "123" }, token: "123", theme: "dark" }}>
      <ThemeProvider>
        <Comp openPopUp={onClick}/>
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    const Button = screen.getByTestId(`${PREFIX}_IconButton`);
    expect(Button).toBeInTheDocument();
    Button.click();
    expect(onClick).toBeCalled();
  });
});
