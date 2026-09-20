import React from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  BuilderButton,
  BuilderTab,
  BuilderTabPanel,
  BuilderTabs,
  builderEmptyStyle,
  builderTabProps,
  RatanDesignProvider,
} from "../src";

function Builder() {
  const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);
  const [value, setValue] = React.useState(0);
  return (
    <BuilderButton label="Table" anchorEl={anchor}
      onClick={(event) => setAnchor(event.currentTarget)}>
      <BuilderTabs value={value} onChange={(_event, next: number) => setValue(next)}
        aria-label="Builder tabs">
        <BuilderTab label="Columns" {...builderTabProps(0)} />
        <BuilderTab label="Order" {...builderTabProps(1)} />
      </BuilderTabs>
      <BuilderTabPanel value={value} index={0}>Column settings</BuilderTabPanel>
      <BuilderTabPanel value={value} index={1}>Order settings</BuilderTabPanel>
      <button onClick={() => setAnchor(null)}>Apply settings</button>
    </BuilderButton>
  );
}

function NamespaceBuilder({
  label,
  initialAnchor = null,
}: {
  label: "Table" | "Filters";
  initialAnchor?: HTMLButtonElement | null;
}) {
  const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(initialAnchor);
  const [value, setValue] = React.useState(0);
  return (
    <BuilderButton label={label} anchorEl={anchor}
      onClick={(event) => setAnchor(event.currentTarget)}>
      <BuilderTabs value={value} onChange={(_event, next: number) => setValue(next)}
        aria-label={`${label} builder tabs`} selectionFollowsFocus>
        <BuilderTab label={`${label} columns`} {...builderTabProps(0)} />
        <BuilderTab label={`${label} order`} {...builderTabProps(1)} />
      </BuilderTabs>
      <BuilderTabPanel value={value} index={0}>
        <input aria-label={`${label} retained value`} defaultValue={`${label} value`} />
      </BuilderTabPanel>
      <BuilderTabPanel value={value} index={1}>{label} order settings</BuilderTabPanel>
      <button onClick={() => setAnchor(null)}>Close {label} builder</button>
    </BuilderButton>
  );
}

function DismissibleBuilder() {
  const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);
  return (
    <BuilderButton
      label="Table"
      anchorEl={anchor}
      onClick={(event) => setAnchor(event.currentTarget)}
      onClose={() => setAnchor(null)}
    >
      <input aria-label="Dismissible Builder value" defaultValue="preserved" />
    </BuilderButton>
  );
}

describe("public builder pattern", () => {
  it("opens its controlled popover, switches tabs and closes through a caller action", async () => {
    render(<RatanDesignProvider><Builder /></RatanDesignProvider>);
    expect(screen.queryByText("Column settings")).not.toBeInTheDocument();
    const trigger = screen.getByRole("button", { name: "Table" });
    fireEvent.click(trigger);
    const panel = screen.getByRole("tabpanel", { name: "Columns" });
    expect(panel).toBeVisible();
    expect(screen.getByText("Order settings")).not.toBeVisible();
    expect(panel.closest(".ratan-design-root")).not.toBeNull();
    const popover = document.getElementById(trigger.getAttribute("aria-describedby")!);
    expect(popover).toContainElement(panel);
    fireEvent.click(screen.getByRole("tab", { name: "Order" }));
    expect(screen.getByRole("tabpanel", { name: "Order" })).toHaveTextContent("Order settings");
    expect(screen.getByText("Column settings")).not.toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Apply settings" }));
    await waitFor(() => expect(screen.queryByText("Order settings")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Table" })).not.toHaveAttribute("aria-describedby");
  });

  it.each(["legacy", "webkit"] as const)("preserves Filters props and dimensions in %s", (generation) => {
    const anchor = document.createElement("button");
    document.body.append(anchor);
    const { rerender, unmount } = render(
      <RatanDesignProvider mode="dark" designGeneration={generation}>
        <BuilderButton label="Filters" anchorEl={anchor} popOverWidth="540px"
          popOverHeight="612px" size="large" variant="contained" color="error"
          startIcon={<span>Ignored icon</span>} endIcon={<span>Custom end</span>}>
          <span>Filter options</span>
        </BuilderButton>
      </RatanDesignProvider>
    );
    const trigger = screen.getByTestId("BuilderButton");
    expect(trigger).toHaveClass("MuiButton-outlined", "MuiButton-colorPrimary");
    expect(trigger).toHaveTextContent("Custom end");
    expect(trigger).not.toHaveTextContent("Ignored icon");
    expect(screen.getByTestId("FilterAltOutlinedIcon")).toBeInTheDocument();
    const popover = document.getElementById(trigger.getAttribute("aria-describedby")!);
    expect(popover?.querySelector(".MuiPaper-root")).toHaveStyle({ width: "540px", height: "612px" });
    rerender(
      <RatanDesignProvider mode="light" designGeneration={generation}>
        <BuilderButton label="Table" anchorEl={anchor} size="medium">Table options</BuilderButton>
      </RatanDesignProvider>
    );
    expect(screen.getByTestId("DesignServicesOutlinedIcon")).toBeInTheDocument();
    unmount();
    anchor.remove();
  });

  it("generates separate popover relationships and retains mounted inactive panels", () => {
    const anchor = document.createElement("button");
    document.body.append(anchor);
    const { unmount } = render(<>
      <BuilderButton label="Table" anchorEl={anchor}>First options</BuilderButton>
      <BuilderButton label="Table" anchorEl={anchor}>Second options</BuilderButton>
      <BuilderTabPanel value={0} index={1}>Inactive content</BuilderTabPanel>
    </>);
    const triggers = screen.getAllByTestId("BuilderButton");
    const ids = triggers.map((trigger) => trigger.getAttribute("aria-describedby"));
    expect(new Set(ids).size).toBe(2);
    expect(ids.every((id) => id && document.getElementById(id))).toBe(true);
    expect(screen.getByText("Inactive content")).not.toBeVisible();
    expect(builderEmptyStyle()).toEqual({});
    unmount();
    anchor.remove();
  });

  it("namespaces tab relationships and keeps each Builder's keyboard state independent", async () => {
    render(<RatanDesignProvider>
      <NamespaceBuilder label="Table" />
      <NamespaceBuilder label="Filters" />
    </RatanDesignProvider>);

    fireEvent.click(screen.getByRole("button", { name: "Table" }));
    const tableColumns = screen.getByRole("tab", { name: "Table columns" });
    const tableOrder = screen.getByRole("tab", { name: "Table order" });
    const tablePanelId = tableColumns.getAttribute("aria-controls");
    expect(tableColumns.getAttribute("id")).not.toBe("Builder-tab-0");
    expect(document.getElementById(tablePanelId!)).toHaveAttribute(
      "aria-labelledby", tableColumns.getAttribute("id")
    );
    tableColumns.focus();
    fireEvent.keyDown(tableColumns, { key: "ArrowRight" });
    expect(tableOrder).toHaveAttribute("aria-selected", "true");
    expect(screen.getByLabelText("Table retained value")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close Table builder" }));
    await waitFor(() => expect(screen.queryByLabelText("Table retained value")).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    const filtersColumns = screen.getByRole("tab", { name: "Filters columns" });
    const filtersOrder = screen.getByRole("tab", { name: "Filters order" });
    expect(filtersColumns.getAttribute("id")).not.toBe(tableColumns.getAttribute("id"));
    expect(filtersColumns.getAttribute("aria-controls")).not.toBe(tablePanelId);
    expect(filtersColumns).toHaveAttribute("aria-selected", "true");
    filtersColumns.focus();
    fireEvent.keyDown(filtersColumns, { key: "ArrowRight" });
    expect(filtersOrder).toHaveAttribute("aria-selected", "true");

    fireEvent.click(screen.getByRole("button", { name: "Close Filters builder" }));
    await waitFor(() => expect(screen.queryByText("Filters order settings")).not.toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Table" }));
    expect(screen.getByRole("tab", { name: "Table order" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByLabelText("Table retained value")).toHaveValue("Table value");
  });

  it("preserves caller-defined tab and panel relationships", () => {
    const anchor = document.createElement("button");
    document.body.append(anchor);
    const { unmount } = render(<RatanDesignProvider>
      <BuilderButton label="Table" anchorEl={anchor}>
        <BuilderTabs value={0} aria-label="Caller relationship tabs">
          <BuilderTab label="Caller tab" {...builderTabProps(0)}
            id="caller-tab" aria-controls="caller-panel" />
        </BuilderTabs>
        <BuilderTabPanel value={0} index={0} id="caller-panel" aria-labelledby="caller-tab">
          Caller panel
        </BuilderTabPanel>
      </BuilderButton>
    </RatanDesignProvider>);
    const tab = screen.getByRole("tab", { name: "Caller tab", hidden: true });
    const panel = screen.getByRole("tabpanel", { name: "Caller tab", hidden: true });
    expect(tab).toHaveAttribute("id", "caller-tab");
    expect(tab).toHaveAttribute("aria-controls", "caller-panel");
    expect(panel).toHaveAttribute("id", "caller-panel");
    expect(panel).toHaveAttribute("aria-labelledby", "caller-tab");
    unmount();
    anchor.remove();
  });

  it("forwards controlled Builder close requests and leaves panel state with the caller", async () => {
    const anchor = document.createElement("button");
    document.body.append(anchor);
    const closeRequest = vi.fn();
    const { rerender, unmount } = render(
      <RatanDesignProvider>
        <BuilderButton label="Table" anchorEl={anchor} onClose={closeRequest}>
          <input aria-label="Retained Builder value" defaultValue="still here" />
        </BuilderButton>
      </RatanDesignProvider>
    );
    const trigger = screen.getByRole("button", { name: "Table", hidden: true });
    const popoverId = trigger.getAttribute("aria-describedby")!;
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", popoverId);
    fireEvent.keyDown(document.querySelector(".MuiPopover-root")!, { key: "Escape" });
    expect(closeRequest).toHaveBeenLastCalledWith(expect.anything(), "escapeKeyDown");
    expect(screen.getByLabelText("Retained Builder value")).toHaveValue("still here");
    fireEvent.click(document.querySelector(".MuiBackdrop-root")!);
    expect(closeRequest).toHaveBeenLastCalledWith(expect.anything(), "backdropClick");

    rerender(
      <RatanDesignProvider>
        <BuilderButton label="Table" anchorEl={anchor}>
          <input aria-label="Retained Builder value" defaultValue="still here" />
        </BuilderButton>
      </RatanDesignProvider>
    );
    fireEvent.keyDown(document.querySelector(".MuiPopover-root")!, { key: "Escape" });
    fireEvent.click(document.querySelector(".MuiBackdrop-root")!);
    expect(screen.getByLabelText("Retained Builder value")).toHaveValue("still here");

    rerender(
      <RatanDesignProvider>
        <BuilderButton label="Table" anchorEl={null} onClose={closeRequest}>
          <input aria-label="Retained Builder value" defaultValue="still here" />
        </BuilderButton>
      </RatanDesignProvider>
    );
    expect(screen.getByRole("button", { name: "Table", hidden: true })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Table", hidden: true })).not.toHaveAttribute("aria-controls");
    await waitFor(() => expect(screen.queryByLabelText("Retained Builder value")).not.toBeInTheDocument());
    unmount();
    anchor.remove();
  });

  it("restores trigger focus when a host fulfills an Escape close request", async () => {
    render(<RatanDesignProvider><DismissibleBuilder /></RatanDesignProvider>);
    const trigger = screen.getByRole("button", { name: "Table" });
    fireEvent.click(trigger);
    fireEvent.keyDown(document.querySelector(".MuiPopover-root")!, { key: "Escape" });
    await waitFor(() => expect(screen.queryByLabelText("Dismissible Builder value")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("keeps Builder tab relationships unique through server render and hydration", async () => {
    const tableAnchor = document.createElement("button");
    const filtersAnchor = document.createElement("button");
    const builders = (
      <RatanDesignProvider>
        <NamespaceBuilder label="Table" initialAnchor={tableAnchor} />
        <NamespaceBuilder label="Filters" initialAnchor={filtersAnchor} />
      </RatanDesignProvider>
    );
    const html = renderToString(builders);
    const serverPopoverIds = Array.from(html.matchAll(/aria-describedby="([^"]+)"/g))
      .map((match) => match[1]);
    expect(serverPopoverIds).toHaveLength(2);
    expect(new Set(serverPopoverIds).size).toBe(2);
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.append(container);
    const recoverableError = vi.fn();
    const root = hydrateRoot(container, builders, { onRecoverableError: recoverableError });
    await waitFor(() => expect(container.querySelectorAll('[data-testid="BuilderButton"]')).toHaveLength(2));
    const hydratedPopoverIds = Array.from(container.querySelectorAll('[data-testid="BuilderButton"]'))
      .map((button) => button.getAttribute("aria-describedby"));
    expect(hydratedPopoverIds).toEqual(serverPopoverIds);
    expect(recoverableError).not.toHaveBeenCalled();
    root.unmount();
    container.remove();
  });
});
