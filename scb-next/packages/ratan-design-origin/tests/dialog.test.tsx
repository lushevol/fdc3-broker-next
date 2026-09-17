import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Dialog, RatanDesignProvider } from "../src";
import { DialogTitle, DialogRoot, dialogClasses } from "../src/compatibility";

describe("public dialog presentation", () => {
  it("honors header suppression, disabled close, explicit containers and slot props", () => {
    const close = vi.fn();
    const host = document.createElement("div");
    document.body.append(host);
    const { rerender, unmount } = render(<Dialog open container={host} disabledClose
      onCloseButton={close} titleComponents="Confirmation" dividers
      titleProps={{ sx: { p: 1 } }} contentProps={{ sx: { p: 0 } }}>
      Confirmation content
    </Dialog>);
    expect(host).toContainElement(screen.getByRole("dialog"));
    expect(screen.getByRole("button", { name: "Close dialog" })).toBeDisabled();
    rerender(<Dialog open container={host} header={null} actionComponents={null}
      surfaceChildren={<span>Host overlay</span>}>Unlabelled content</Dialog>);
    expect(screen.queryByRole("button", { name: "Close dialog" })).not.toBeInTheDocument();
    expect(screen.getByText("Host overlay")).toBeInTheDocument();
    unmount();
    host.remove();
  });

  it.each([
    ["legacy", "light"], ["legacy", "dark"], ["webkit", "light"], ["webkit", "dark"],
  ] as const)("preserves legacy title actions in %s %s", (designGeneration, mode) => {
    render(<RatanDesignProvider designGeneration={designGeneration} mode={mode}>
      <Dialog open RootComponent={DialogRoot} header={<DialogTitle onClose={() => undefined}
        isResizeble onResize={() => undefined}>Trade</DialogTitle>}>Trade ABC123</Dialog>
    </RatanDesignProvider>);
    expect(screen.getByRole("button", { name: "resize" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });
  it("supports host headers and controlled legacy maximize/resize actions", () => {
    const close = vi.fn();
    const maximize = vi.fn();
    const { rerender } = render(<RatanDesignProvider mode="dark">
      <Dialog open RootComponent={DialogRoot} className={dialogClasses.static} disablePortal
        header={<DialogTitle id="host-title" isDraggable isResizeble isMax
          onClose={close} onResize={maximize}>Position details</DialogTitle>}
        aria-labelledby="host-title" contentProps={{ "data-testid": "host-content" }}>
        Position ABC123
      </Dialog>
    </RatanDesignProvider>);
    expect(screen.getByRole("dialog", { name: /Position details/ })).toBeInTheDocument();
    expect(screen.getByTestId("host-content")).toHaveTextContent("Position ABC123");
    expect(screen.getByRole("button", { name: "resize" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "resize" }));
    expect(maximize).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(close).toHaveBeenCalledOnce();
    rerender(<RatanDesignProvider designGeneration="webkit" mode="light">
      <Dialog open RootComponent={DialogRoot} header={<DialogTitle onClose={close}
        disabledClose>Position details</DialogTitle>}>Position ABC123</Dialog>
    </RatanDesignProvider>);
    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute("aria-disabled", "true");
    expect(screen.queryByRole("button", { name: "resize" })).not.toBeInTheDocument();
  });
  it("renders controlled content and actions with accessible close and escape callbacks", async () => {
    const close = vi.fn();
    const escape = vi.fn();
    const content = React.createRef<HTMLDivElement>();
    const root = React.createRef<HTMLDivElement>();
    const { rerender } = render(<RatanDesignProvider>
      <Dialog ref={root} open titleComponents="Trade details" onClose={escape}
        onCloseButton={close} contentRef={content} actionComponents={<button>Confirm trade</button>}>
        Trade reference ABC123
      </Dialog>
    </RatanDesignProvider>);
    const dialog = screen.getByRole("dialog", { name: "Trade details" });
    expect(dialog.closest(".ratan-design-root")).not.toBeNull();
    expect(root.current).toContainElement(dialog);
    expect(content.current).toHaveTextContent("Trade reference ABC123");
    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(close).toHaveBeenCalledOnce();
    fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
    expect(escape.mock.calls[0]?.[1]).toBe("escapeKeyDown");
    expect(screen.getByRole("button", { name: "Confirm trade" })).toBeInTheDocument();
    rerender(<RatanDesignProvider><Dialog open={false}>Trade reference ABC123</Dialog></RatanDesignProvider>);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
