import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoadingButton } from "../src";

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
});
