import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { TabProps } from "./common/interface";
import { PREFIX } from "./common/style";
import { Workspace } from "../../hooks/model/workspaces";

const Comp = (props: TabProps) => {
  return (<Root {...props} />);
};

describe("TabItem component", () => {
  it("should be in the document", () => {
    const dummyFn = (_item) => (_event) => { };
    const dummyFn1 = (_item) => (_event) => true;
    const item = { id: "1" } as Workspace;
    render(<Provider data={{ theme: "dark" }}>
      <ThemeProvider>
        <Comp
          item={item}
          edit={dummyFn}
          remove={dummyFn1}
          refreshTab={dummyFn}
          showRemove={true}
          showRefresh={true}
        />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const edit = screen.getByTestId(`edit-${item.id}`);
    expect(edit).toBeInTheDocument();
    edit.click();
    const refreshWorkspace = screen.getByTestId(`refreshWorkspace-${item.id}`);
    expect(refreshWorkspace).toBeInTheDocument();
    refreshWorkspace.click();
    const deleteWorkspace = screen.getByTestId(`deleteWorkspace-${item.id}`);
    expect(deleteWorkspace).toBeInTheDocument();
    deleteWorkspace.click();
  });
  it("should be in the document", () => {
    const dummyFn = (_item) => (_event) => { };
    const dummyFn1 = (_item) => (_event) => true;
    const item = { id: "1" } as Workspace;
    render(<Provider data={{ theme: "dark" }}>
      <ThemeProvider>
        <Comp
          item={item}
          edit={dummyFn}
          remove={dummyFn1}
          refreshTab={dummyFn}
          showRemove={false}
          showRefresh={false}
        />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});
