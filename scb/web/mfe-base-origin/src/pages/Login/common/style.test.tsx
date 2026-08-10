import { render } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import Root, { classes } from "./style";

describe("Login styles", () => {
  it("uses LoginPage theme tokens for rendered styles", () => {
    const theme = createTheme({
      theme: {
        LoginPage: {
          leftBackground: "rgb(1, 2, 3)",
          buttonHeight: "51px",
        },
      },
    });
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Root>
          <div className={classes.gridleft} data-testid="left" />
          <button className={classes.button} data-testid="button" />
        </Root>
      </ThemeProvider>,
    );

    expect(container.querySelector(`.${classes.gridleft}`)).toHaveStyle({
      background: "rgb(1, 2, 3)",
    });
    expect(container.querySelector(`.${classes.button}`)).toHaveStyle({
      height: "51px",
    });
  });
});
