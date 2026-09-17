import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
});
