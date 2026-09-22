import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button, LoadingButton, Loader, Dialog, ThemeConfig, ThemeUtil, Time } from "@fm/base";
import {
  Button as SharedButton,
  Dialog as SharedDialog,
  Loader as SharedLoader,
  LoadingButton as SharedLoadingButton,
  Time as SharedTime,
} from "ratan-design-origin/base-compat";

describe("unchanged consumer control exports", () => {
  it("re-exports the shared presentation adapters without wrapping them", () => {
    expect(Button).toBe(SharedButton);
    expect(Dialog).toBe(SharedDialog);
    expect(Loader).toBe(SharedLoader);
    expect(LoadingButton).toBe(SharedLoadingButton);
    expect(Time).toBe(SharedTime);
  });

  it("retains Ratan's palette-only theme policy", () => {
    expect(ThemeConfig.default(ThemeUtil.getTheme("dark")).config.palette.mode).toBe("dark");
    expect(ThemeConfig.default(ThemeUtil.getTheme("gold")).config.palette.mode).toBe("light");
    expect(ThemeConfig.default({}).config.palette.mode).toBe("light");
  });
  it("preserves primary type, caller icons and the 16px start-icon loading pattern", () => {
    const click = vi.fn();
    const { rerender } = render(<>
      <Button.default type="primary" onClick={click}>Open trade</Button.default>
      <LoadingButton.default loading startIcon={<span>Host icon</span>}>Save trade</LoadingButton.default>
    </>);
    expect(screen.getByRole("button", { name: "Open trade" })).toHaveAttribute("type", "button");
    fireEvent.click(screen.getByRole("button", { name: "Open trade" }));
    expect(click).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Save trade" })).toBeDisabled();
    expect(screen.getByRole("progressbar", { hidden: true })).toHaveStyle({ width: "16px", height: "16px" });
    expect(screen.queryByText("Host icon")).not.toBeInTheDocument();
    rerender(<LoadingButton.default startIcon={<span>Host icon</span>}>Save trade</LoadingButton.default>);
    expect(screen.getByRole("button", { name: "Host icon Save trade" })).toBeEnabled();
    expect(screen.queryByRole("progressbar", { hidden: true })).not.toBeInTheDocument();
  });

  it("keeps the circular loading primitive and its accessible name", () => {
    render(<Loader.default />);
    expect(screen.getByRole("progressbar", { name: "Loading" })).toBeInTheDocument();
  });

  it("defaults dialogs open, forces a portal and retains close and Paper overrides", () => {
    const close = vi.fn();
    render(<div data-testid="consumer-root">
      <Dialog.default titleComponents="Trade details" onClose={close} disablePortal
        defaultWidth={720} defaultHeight="auto" className="consumer-dialog"
        PaperProps={{ style: { color: "red" } }} actionComponents={<button>Approve trade</button>}>
        Details ABC123
      </Dialog.default>
    </div>);
    const dialog = screen.getByRole("dialog");
    expect(screen.getByTestId("consumer-root")).not.toContainElement(dialog);
    expect(dialog).toHaveStyle({ color: "red", width: "min(720px, calc(100vw - 32px))", height: "auto" });
    expect(dialog.closest(".consumer-dialog")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Approve trade" })).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
    expect(close).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(close).toHaveBeenCalledTimes(2);
  });
});
