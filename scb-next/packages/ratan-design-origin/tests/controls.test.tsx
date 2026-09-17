import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  Button,
  Label,
  LabelMenuItem,
  LoadingButton,
  Input,
  ResetButton,
  SearchButton,
  SearchInput,
  Select,
  ToggleButton,
  modeStyle,
  RatanDesignProvider,
} from "../src";
import MenuItem from "@mui/material/MenuItem";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

describe("standalone controls", () => {
  it("preserves left labels, hidden state and modern slot precedence", () => {
    const { rerender } = render(
      <Input
        label="Account"
        variant="outlined"
        labelPosition="left"
        hidden
        inputProps={{ maxLength: 5 }}
        InputProps={{ disabled: false }}
        disabled
        InputLabelProps={{ shrink: false }}
        helperText="Required"
        error
        slotProps={{
          htmlInput: { maxLength: 10 },
          input: { disabled: true },
          inputLabel: { shrink: true },
          formHelperText: { role: "alert" },
        }}
      />
    );
    const input = screen.getByRole("textbox", {
      name: "Account",
      hidden: true,
    });
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("maxlength", "10");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert", { hidden: true })).toHaveTextContent(
      "Required"
    );
    expect(input.closest(".ratan-design-input-left")).not.toBeVisible();
    rerender(
      <Input
        label="Account"
        variant="outlined"
        style={{ display: "block" }}
        hidden
      />
    );
    expect(screen.getByRole("textbox", { name: "Account" })).toBeVisible();
  });

  it("retains an explicit select label id, root ref and disabled state", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Select
        ref={ref}
        label="Currency"
        labelId="currency-label"
        id="currency"
        labelPosition="left"
        formControlClassName="existing-selector"
        size="medium"
        variant="filled"
        disabled
        value="USD"
        IconComponent={() => <span aria-hidden="true">v</span>}
      >
        <MenuItem value="USD">USD</MenuItem>
      </Select>
    );
    const select = screen.getByRole("combobox", { name: "Currency" });
    expect(select).toHaveAttribute(
      "aria-labelledby",
      "currency-label currency"
    );
    expect(select).toHaveAttribute("aria-disabled", "true");
    expect(ref.current).toContainElement(select);
    expect(select.closest(".existing-selector")).toHaveClass(
      "ratan-design-select-left"
    );
  });

  it("keeps explicit disabled state and supports a custom loading indicator size", () => {
    const { rerender } = render(
      <LoadingButton loading loadingSize={20}>
        Save
      </LoadingButton>
    );
    expect(screen.getByRole("progressbar")).toHaveStyle({
      width: "20px",
      height: "20px",
    });
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    rerender(<LoadingButton disabled>Save</LoadingButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
  it("labels an input, forwards both refs, and preserves the change event", () => {
    const ref = React.createRef<HTMLDivElement>();
    const inputRef = React.createRef<HTMLInputElement>();
    const changed = vi.fn();
    render(
      <Input
        ref={ref}
        inputRef={inputRef}
        label="Reference"
        variant="outlined"
        onChange={(event) => changed(event.target.value)}
      />
    );
    const input = screen.getByRole("textbox", { name: "Reference" });
    expect(inputRef.current).toBe(input);
    expect(ref.current).toContainElement(input);
    fireEvent.change(input, { target: { value: "REF-123" } });
    expect(changed).toHaveBeenCalledWith("REF-123");
  });

  it("associates a selector label and retains the selected-value callback", () => {
    const changed = vi.fn();
    render(
      <Select
        label="Currency"
        variant="outlined"
        value="USD"
        onChange={(event) => changed(event.target.value)}
      >
        <MenuItem value="USD">USD</MenuItem>
        <MenuItem value="SGD">SGD</MenuItem>
      </Select>
    );
    fireEvent.mouseDown(screen.getByRole("combobox", { name: "Currency" }));
    fireEvent.click(screen.getByRole("option", { name: "SGD" }));
    expect(changed).toHaveBeenCalledWith("SGD");
  });
  it("forwards a button ref and invokes the public click callback", () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    render(
      <Button ref={ref} onClick={onClick}>
        Search
      </Button>
    );
    const button = screen.getByRole("button", { name: "Search" });
    expect(ref.current).toBe(button);
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("keeps the action label and prevents clicks while loading", () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    const { rerender } = render(
      <LoadingButton ref={ref} loading onClick={onClick}>
        Save
      </LoadingButton>
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.getByRole("progressbar")).toBeVisible();
    fireEvent.click(ref.current!);
    expect(onClick).not.toHaveBeenCalled();
    rerender(
      <LoadingButton ref={ref} onClick={onClick}>
        Save
      </LoadingButton>
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("provides search input adornments and invokes the clear callback", () => {
    const clear = vi.fn();
    render(
      <SearchInput
        label="Find trade"
        variant="outlined"
        handleClear={clear}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(clear).toHaveBeenCalledOnce();
    expect(screen.getByTestId("SearchIcon")).toBeVisible();
  });

  it("preserves search and reset button behavior in both modes", () => {
    const click = vi.fn();
    const { rerender } = render(
      <RatanDesignProvider mode="light">
        <SearchButton onClick={click}>Search</SearchButton>
        <ResetButton onClick={click}>Reset</ResetButton>
      </RatanDesignProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(click).toHaveBeenCalledTimes(2);

    rerender(
      <RatanDesignProvider mode="dark">
        <SearchButton loading loadingSize={20} onClick={click}>
          Search
        </SearchButton>
        <ResetButton disabled>Reset</ResetButton>
      </RatanDesignProvider>
    );
    expect(screen.getByRole("progressbar")).toHaveStyle({
      width: "20px",
      height: "20px",
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(click).toHaveBeenCalledTimes(2);
  });

  it("supports toggle selection and exposes both appearance calculations", () => {
    const changed = vi.fn();
    render(
      <ToggleButtonGroup exclusive onChange={changed} value="open">
        <ToggleButton value="open">Open</ToggleButton>
        <ToggleButton value="closed">Closed</ToggleButton>
      </ToggleButtonGroup>
    );
    fireEvent.click(screen.getByRole("button", { name: "Closed" }));
    expect(changed).toHaveBeenCalled();
    expect(modeStyle({ shape: { borderRadius: 5 } } as never, "light")).toBeDefined();
    expect(modeStyle({ shape: { borderRadius: 5 } } as never, "dark")).toBeDefined();
  });

  it("renders the label selector and reports the selected label", () => {
    const changed = vi.fn();
    render(
      <Label label="Status" value="Status" onChange={changed}>
        <LabelMenuItem value="Confirmed">Confirmed</LabelMenuItem>
      </Label>
    );
    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Confirmed" }));
    expect(changed).toHaveBeenCalled();
  });
});
