import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Input from ".";

describe("existing Input consumer contract", () => {
  it("keeps labels shrunk and forwards user input through the existing callback", () => {
    const changedValue = vi.fn();
    const onChange = vi.fn((event: React.ChangeEvent<HTMLInputElement>) =>
      changedValue(event.target.value)
    );
    render(
      <Input
        label="Reference"
        variant="outlined"
        value=""
        onChange={onChange}
      />
    );
    const input = screen.getByRole("textbox", { name: "Reference" });
    expect(
      screen.getByText("Reference", { selector: "label" })
    ).toHaveAttribute("data-shrink", "true");
    fireEvent.change(input, { target: { value: "REF-123" } });
    expect(onChange).toHaveBeenCalledOnce();
    expect(changedValue).toHaveBeenCalledWith("REF-123");
  });

  it("preserves MUI 5 InputProps and inputRef without requiring consumer changes", () => {
    const inputRef = React.createRef<HTMLInputElement>();
    render(
      <Input
        label="Reference"
        variant="outlined"
        inputRef={inputRef}
        InputProps={{ readOnly: true }}
      />
    );
    expect(inputRef.current).toBe(
      screen.getByRole("textbox", { name: "Reference" })
    );
    expect(inputRef.current).toHaveAttribute("readonly");
  });

  it("disables the underlying input when disabled", () => {
    render(<Input label="Reference" variant="outlined" disabled />);
    expect(screen.getByRole("textbox", { name: "Reference" })).toBeDisabled();
  });

  it("translates existing Base slots while retaining original MUI 5 input props", () => {
    render(
      <Input
        label="Reference"
        variant="outlined"
        helperText="Required reference"
        InputProps={{ readOnly: true }}
        inputProps={{ maxLength: 12 }}
        slotProps={{
          input: { startAdornment: <span>REF</span> },
          htmlInput: { "aria-describedby": "reference-help" },
          formHelperText: { id: "reference-help" },
        }}
      />
    );
    const input = screen.getByRole("textbox", { name: "Reference" });
    expect(input).toHaveAttribute("readonly");
    expect(input).toHaveAttribute("maxlength", "12");
    expect(input).toHaveAccessibleDescription("Required reference");
    expect(screen.getByText("REF")).toBeVisible();
  });

  it("preserves label shrink overrides and the hidden state", () => {
    render(
      <Input
        label="Reference"
        variant="outlined"
        hidden
        InputLabelProps={{ shrink: false }}
      />
    );
    expect(
      screen.getByText("Reference", { selector: "label" })
    ).toHaveAttribute("data-shrink", "false");
    expect(screen.getByRole("textbox", { hidden: true })).not.toBeVisible();
  });
});
