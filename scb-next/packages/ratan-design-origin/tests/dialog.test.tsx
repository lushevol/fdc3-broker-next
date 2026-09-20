import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Dialog, RatanDesignProvider } from "../src";
import { DialogTitle, DialogRoot, dialogClasses } from "../src/compatibility";

describe("public dialog presentation", () => {
  it("resolves mounted title IDs and explicit naming without dangling references", async () => {
    const { rerender } = render(
      <Dialog
        open
        disablePortal
        titleComponents="Settlement details"
        titleProps={{ id: "settlement-dialog-title" }}
      >
        Settlement content
      </Dialog>
    );
    let dialog = await screen.findByRole("dialog", {
      name: "Settlement details",
      hidden: true,
    });
    expect(dialog).toHaveAttribute("aria-labelledby", "settlement-dialog-title");
    expect(document.getElementById("settlement-dialog-title")).toHaveTextContent(
      "Settlement details"
    );

    rerender(
      <Dialog
        open
        disablePortal
        header={<h2 id="custom-position-title">Position details</h2>}
      >
        Position content
      </Dialog>
    );
    dialog = await screen.findByRole("dialog", {
      name: "Position details",
      hidden: true,
    });
    expect(dialog).toHaveAttribute("aria-labelledby", "custom-position-title");

    rerender(
      <Dialog open disablePortal header={<h2>Unidentified title</h2>}>
        Unidentified content
      </Dialog>
    );
    dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).not.toHaveAttribute("aria-labelledby");

    rerender(
      <Dialog
        open
        disablePortal
        header={null}
        titleComponents="Suppressed title"
        aria-label="Manually named dialog"
      >
        Manual content
      </Dialog>
    );
    dialog = await screen.findByRole("dialog", {
      name: "Manually named dialog",
      hidden: true,
    });
    expect(dialog).not.toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-label", "Manually named dialog");
    expect(document.getElementById("settlement-dialog-title")).toBeNull();

    rerender(
      <Dialog
        open
        disablePortal
        header={null}
        PaperProps={{ "aria-label": "Paper-named dialog" }}
      >
        Paper-named content
      </Dialog>
    );
    dialog = await screen.findByRole("dialog", {
      name: "Paper-named dialog",
      hidden: true,
    });
    expect(dialog).not.toHaveAttribute("aria-labelledby");

    rerender(
      <Dialog
        open
        disablePortal
        titleComponents="Generated title"
        aria-labelledby="caller-title"
      >
        <span id="caller-title">Caller title</span>
      </Dialog>
    );
    dialog = await screen.findByRole("dialog", {
      name: "Caller title",
      hidden: true,
    });
    expect(dialog).toHaveAttribute("aria-labelledby", "caller-title");
  });

  it("generates unique relationships for multiple mounted dialogs", () => {
    render(
      <>
        <Dialog open disablePortal titleComponents="First dialog">
          First content
        </Dialog>
        <Dialog open disablePortal titleComponents="Second dialog">
          Second content
        </Dialog>
      </>
    );
    const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
    const titleIds = dialogs.map((dialog) => dialog.getAttribute("aria-labelledby"));
    expect(titleIds).toHaveLength(2);
    expect(new Set(titleIds).size).toBe(2);
    for (const titleId of titleIds) {
      expect(titleId).not.toBeNull();
      expect(document.getElementById(titleId!)).not.toBeNull();
    }
  });

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
