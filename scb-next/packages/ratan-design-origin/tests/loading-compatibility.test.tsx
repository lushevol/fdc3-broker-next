import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoadingButton } from "../src";

describe("start-icon loading presentation", () => {
  it("replaces and restores the caller icon without changing the action label", () => {
    const click = vi.fn();
    const { rerender } = render(<LoadingButton loading loadingPosition="startIcon"
      loadingSize={16} startIcon={<span>Caller icon</span>} onClick={click}>Save trade</LoadingButton>);
    expect(screen.getByRole("button", { name: "Save trade" })).toBeDisabled();
    expect(screen.getByRole("progressbar")).toHaveStyle({ width: "16px", height: "16px" });
    expect(screen.queryByText("Caller icon")).not.toBeInTheDocument();
    rerender(<LoadingButton loading={false} loadingPosition="startIcon"
      startIcon={<span>Caller icon</span>} onClick={click}>Save trade</LoadingButton>);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Caller icon Save trade" }));
    expect(click).toHaveBeenCalledOnce();
  });
});
