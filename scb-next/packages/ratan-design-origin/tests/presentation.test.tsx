import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState, ErrorFallback, LoadingOverlay } from "../src/index";

describe("host-independent state presentation", () => {
  it("composes an empty state from explicit content, illustration and host action", () => {
    const open = vi.fn();
    render(<EmptyState data-testid="empty" title="No payments"
      description="No matching records" illustration={<img src="/payments.png" alt="Payments" />}
      action={<button onClick={open}>Create payment</button>}
      wrapperProps={{ className: "host-wrapper" }} contentProps={{ className: "host-content" }} />);
    expect(screen.getByTestId("empty").querySelector(".host-wrapper .host-content")).not.toBeNull();
    expect(screen.getByRole("img", { name: "Payments" })).toBeInTheDocument();
    expect(screen.getByText("No payments")).toBeInTheDocument();
    expect(screen.getByText("No matching records")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Create payment" }));
    expect(open).toHaveBeenCalledOnce();
  });

  it("allows minimal empty presentation without an action or illustration", () => {
    const { rerender } = render(<EmptyState title="No results" />);
    expect(screen.getByText("No results")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    rerender(<EmptyState title="No results" description={null} />);
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("shows error detail/action only when the host supplies them", () => {
    const { rerender } = render(<ErrorFallback title="Payment unavailable"
      description="Contact support" action={<a href="mailto:support@example.test">Contact</a>} />);
    expect(screen.getByText("Payment unavailable")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "mailto:support@example.test");
    rerender(<ErrorFallback title="Try again later" />);
    expect(screen.queryByText("Contact support")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    rerender(<ErrorFallback title="Try again later" description={null} action={null} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("blocks its region only while loading is open", () => {
    const { rerender } = render(<LoadingOverlay open data-testid="busy"><span>Processing payment</span></LoadingOverlay>);
    expect(screen.getByRole("status")).toHaveTextContent("Processing payment");
    expect(screen.getByTestId("busy").querySelector(".MuiBackdrop-root")).toHaveClass("MuiBackdrop-root");
    expect(screen.getByTestId("busy")).not.toHaveStyle({ pointerEvents: "none" });
    rerender(<LoadingOverlay open={false} data-testid="busy">Processing payment</LoadingOverlay>);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByTestId("busy")).toHaveStyle({ pointerEvents: "none" });
  });
});
