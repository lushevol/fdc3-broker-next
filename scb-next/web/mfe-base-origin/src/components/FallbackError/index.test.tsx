import { render, screen } from "@testing-library/react";
import React from "react";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import Root from ".";

describe("FallbackError component", () => {
  it("should be in the document", () => {
    render(
      <Root
        hasError={true}
        error={{ name: "", message: "test FallbackError", stack: "test" }}
      />
    );
    const id = screen.getByTestId("FallbackError__page-id");
    expect(id).toBeInTheDocument();
    expect(screen.getByText(/There is a problem in this Tile./i)).toBeInTheDocument();
  });
  it("should be in the document", () => {
    render(
      <Root
        hasError={true}
        error={{ name: "", message: "test FallbackError", stack: "test" }}
        emailSupport="khairul.anshar1@sc.com"
      />
    );
    const id = screen.getByTestId("FallbackError__page-id");
    expect(id).toBeInTheDocument();
    expect(screen.getByText(/There is a problem in this Tile./i)).toBeInTheDocument();
  });
  it("should be in the document", () => {
    render(<Provider data={{
      theme: "light",
      currentWorkspace: {
        id: "",
        label: "",
        isActive: true,
        containers: [{
          emailSupport: "khairul.anshar1@sc.com",
          id: "id",
          container: "",
          module: "",
          tile: "",
          title: "",
          panelId: "",
          tabId: ""
        }]
      }
    }}>
      <ThemeProvider>
        <Root
          hasError={true}
          error={{ name: "", message: "test FallbackError", stack: "test" }}
        />
      </ThemeProvider>
    </Provider>);
    const id = screen.getByTestId("FallbackError__page-id");
    expect(id).toBeInTheDocument();
    expect(screen.getByText(/There is a problem in this Tile./i)).toBeInTheDocument();
  });
});
