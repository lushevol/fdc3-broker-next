import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { TileProps } from "./common/interface";
import { PREFIX } from "./common/style";

const Comp = (props: TileProps) => {
  return (<Root {...props} />);
};

describe("Tile component", () => {
  it("disabled false should be in the document", () => {
    render(<Provider data={{ theme: "dark" }}>
      <ThemeProvider>
        <Comp
          title=""
          subtitle=""
          imageDarkTheme=""
          imageLightTheme=""
          onClick={(e) => { }}
          disabled={false}
        />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    id.click();
  });
  it("disabled true should be in the document", () => {
    render(<Provider data={{ theme: "light" }}>
      <ThemeProvider>
        <Comp
          title=""
          subtitle=""
          imageDarkTheme=""
          imageLightTheme=""
          onClick={(e) => { }}
          disabled={true}
        />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    id.click();
  });
  it("darkIcons should be in the document", () => {
    render(<Provider data={{ theme: "dark" }}>
      <ThemeProvider>
        <Comp
          title=""
          subtitle=""
          imageDarkTheme="darkIcons/icon1.svg"
          imageLightTheme="lightIcons/icon1.svg"
          onClick={(e) => { }}
        />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    id.click();
  });
  it("lightIcons should be in the document", () => {
    render(<Provider data={{ theme: "light" }}>
      <ThemeProvider>
        <Comp
          title=""
          subtitle=""
          imageDarkTheme="darkIcons/icon1.svg"
          imageLightTheme="lightIcons/icon1.svg"
          onClick={(e) => { }}
        />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    id.click();
  });
});
