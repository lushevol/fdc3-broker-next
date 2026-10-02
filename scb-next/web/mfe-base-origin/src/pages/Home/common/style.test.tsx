import { render, screen } from "@testing-library/react";
import React from "react";
import Provider from "../../../hooks/provider";
import ThemeProvider from "../../../theme";
import Root, { classes } from "./style";

function renderWorkspaceContent(children: React.ReactNode) {
  return render(
    <Provider data={{ theme: "dark" }}>
      <ThemeProvider>
        <Root>
          <div className={classes.tabpanel}>
            <div className="tabmain">{children}</div>
          </div>
        </Root>
      </ThemeProvider>
    </Provider>
  );
}

describe("workspace content height", () => {
  it.each(["section", "div"] as const)(
    "keeps the first %s content root at its natural height",
    (tag) => {
      const Content = tag;
      renderWorkspaceContent(
        <>
          <Content data-testid="content" />
          <Content data-testid="later" />
        </>
      );

      expect(getComputedStyle(screen.getByTestId("content")).height).toBe("auto");
      expect(getComputedStyle(screen.getByTestId("later")).height).toBe("");
    }
  );

  it("does not resize a later section or div when another element comes first", () => {
    renderWorkspaceContent(
      <>
        <article />
        <section data-testid="section" />
        <div data-testid="div" />
      </>
    );

    expect(getComputedStyle(screen.getByTestId("section")).height).toBe("");
    expect(getComputedStyle(screen.getByTestId("div")).height).toBe("");
  });

  it("ignores injected style nodes while retaining the first content root", () => {
    renderWorkspaceContent(
      <>
        <style data-emotion="server-rendered" />
        <div data-testid="first" />
        <section data-testid="second" />
      </>
    );

    expect(getComputedStyle(screen.getByTestId("first")).height).toBe("auto");
    expect(getComputedStyle(screen.getByTestId("second")).height).toBe("");
  });
});
