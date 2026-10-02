import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Home from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import type { Workspace } from "../../hooks/model/workspaces";

const workspaces: Workspace[] = [
  { id: "first", label: "Workspace 1", isActive: true, containers: [] },
  { id: "second", label: "Workspace 2", isActive: false, containers: [] },
];
const remove = vi.fn((event: React.MouseEvent) => {
  event.stopPropagation();
  return false;
});
const handleChange = vi.fn();

vi.mock("./common/useController", () => ({
  default: () => ({
    store: { workspaces, currentWorkspace: workspaces[0] },
    value: 1,
    handleChange,
    add: vi.fn(),
    edit: () => vi.fn(),
    remove: () => remove,
    refreshTab: () => vi.fn(),
    focus: () => vi.fn(),
    ready: true,
    showTimeout: false,
    setShowTimeout: vi.fn(),
    mouseMove: vi.fn(),
    validateWorkspaceReady: true,
  }),
}));
vi.mock("./common/useOpenfin", () => ({
  default: () => ({ channelMessage: undefined, clearMessage: vi.fn() }),
}));
vi.mock("../../components/AppBar", () => ({ default: () => null }));
vi.mock("../../components/Empty", () => ({ default: () => null }));

it("keeps workspace controls valid without leaking tab props into DOM elements", () => {
  const errors = vi.spyOn(console, "error");
  render(
    <Provider data={{ theme: "dark" }}>
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    </Provider>
  );

  expect(screen.getAllByRole("tab")).toHaveLength(2);
  expect(screen.getAllByRole("textbox", { name: "Workspace Name" })[0]).toHaveValue(
    "Workspace 1"
  );
  const deleteButton = screen.getAllByRole("button", { name: "delete" })[0];
  expect(deleteButton.parentElement?.closest("button")).toBeNull();
  fireEvent.click(deleteButton);
  expect(remove).toHaveBeenCalledTimes(1);
  expect(handleChange).not.toHaveBeenCalled();
  const messages = errors.mock.calls.map((args) => args.join(" ")).join("\n");
  expect(messages).not.toMatch(
    /fullWidth|selectionFollowsFocus|textColor|tabId|non-boolean attribute|validateDOMNesting|potentially unsafe|server-side rendering/
  );
  errors.mockRestore();
});
