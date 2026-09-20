import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoadingButton, SearchButton } from "../src";

describe("start-icon loading presentation", () => {
  it("replaces and restores the caller icon without changing the action label", () => {
    const click = vi.fn();
    const { rerender } = render(<LoadingButton loading loadingPosition="startIcon"
      loadingSize={16} startIcon={<span>Caller icon</span>} onClick={click}>Save trade</LoadingButton>);
    const loadingButton = screen.getByRole("button", { name: "Save trade" });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("progressbar", { hidden: true })).toHaveStyle({ width: "16px", height: "16px" });
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByText("Caller icon")).not.toBeInTheDocument();
    rerender(<LoadingButton loading={false} loadingPosition="startIcon"
      startIcon={<span>Caller icon</span>} onClick={click}>Save trade</LoadingButton>);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    const idleButton = screen.getByRole("button", { name: "Caller icon Save trade" });
    expect(idleButton).not.toHaveAttribute("aria-busy");
    fireEvent.click(idleButton);
    expect(click).toHaveBeenCalledOnce();
  });

  it.each(["inline", "startIcon"] as const)(
    "honors SearchButton's %s loading position without leaking it to the DOM",
    (loadingPosition) => {
      const click = vi.fn();
      const { rerender } = render(
        <SearchButton
          loading
          loadingPosition={loadingPosition}
          loadingSize={16}
          startIcon={<span>Caller icon</span>}
          onClick={click}
        >
          Search trades
        </SearchButton>
      );
      const loadingButton = screen.getByRole("button", { name: /search trades/i });
      expect(loadingButton).toBeDisabled();
      expect(loadingButton).toHaveAttribute("aria-busy", "true");
      expect(loadingButton).not.toHaveAttribute("loadingposition");
      expect(screen.getByRole("progressbar", { hidden: true })).toHaveStyle({
        width: "16px",
        height: "16px",
      });
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      if (loadingPosition === "inline") {
        expect(screen.getByText("Caller icon")).toBeInTheDocument();
      } else {
        expect(screen.queryByText("Caller icon")).not.toBeInTheDocument();
      }

      rerender(
        <SearchButton
          loading={false}
          loadingPosition={loadingPosition}
          loadingSize={16}
          startIcon={<span>Caller icon</span>}
          onClick={click}
        >
          Search trades
        </SearchButton>
      );
      const idleButton = screen.getByRole("button", { name: /search trades/i });
      expect(idleButton).not.toHaveAttribute("aria-busy");
      expect(idleButton).not.toHaveAttribute("loadingposition");
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.getByText("Caller icon")).toBeInTheDocument();
      fireEvent.click(idleButton);
      expect(click).toHaveBeenCalledOnce();
    }
  );
});
