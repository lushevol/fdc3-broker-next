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
  SearchCondition,
  SearchConditionContainer,
  SearchGrid,
  SearchInput,
  type SearchInputProps,
  Select,
  ToggleButton,
  modeStyle,
  searchConditionContainerBorderStyle,
  searchConditionContainerModeStyle,
  searchConditionModeStyle,
  RatanDesignProvider,
} from "../src";
import MenuItem from "@mui/material/MenuItem";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { getWebkitActionStyle } from "../src/action-style";
import { ThemeProvider, createTheme } from "@mui/material/styles";

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

  it.each([
    ["legacy", "light"],
    ["legacy", "dark"],
    ["webkit", "light"],
    ["webkit", "dark"],
  ] as const)("keeps Input field, label and native state aligned in %s %s mode", (designGeneration, mode) => {
    const { rerender } = render(
      <RatanDesignProvider designGeneration={designGeneration} mode={mode}>
        <Input
          label="Payment reference"
          variant="outlined"
          disabled
          error
          required
          InputProps={{ disabled: false }}
          inputProps={{ required: false }}
          slotProps={{
            input: { disabled: true },
            htmlInput: { required: true },
          }}
        />
      </RatanDesignProvider>
    );
    const input = screen.getByRole("textbox", { name: /payment reference/i });
    const label = document.querySelector(`label[for="${input.id}"]`)!;
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(label).toHaveClass("Mui-disabled", "Mui-error", "Mui-required");

    rerender(
      <RatanDesignProvider designGeneration={designGeneration} mode={mode}>
        <Input
          label="Payment reference"
          variant="outlined"
          disabled
          InputProps={{ disabled: true }}
          slotProps={{ input: { disabled: false } }}
        />
      </RatanDesignProvider>
    );
    expect(screen.getByRole("textbox", { name: /payment reference/i })).not.toBeDisabled();
    expect(document.querySelector(`label[for="${input.id}"]`)).not.toHaveClass("Mui-disabled");
  });

  it.each([
    ["legacy", "light"],
    ["legacy", "dark"],
    ["webkit", "light"],
    ["webkit", "dark"],
  ] as const)("propagates Select state to its field, label and control in %s %s mode", (designGeneration, mode) => {
    const { rerender } = render(
      <RatanDesignProvider designGeneration={designGeneration} mode={mode}>
        <Select label="Settlement status" variant="outlined" disabled error required value="Pending">
          <MenuItem value="Pending">Pending</MenuItem>
        </Select>
      </RatanDesignProvider>
    );
    const select = screen.getByRole("combobox", { name: /settlement status/i });
    const formControl = select.closest(".MuiFormControl-root")!;
    const label = formControl.querySelector("label")!;
    const nativeInput = formControl.querySelector("input")!;
    expect(select).toHaveAttribute("aria-disabled", "true");
    expect(nativeInput).toBeDisabled();
    expect(nativeInput).toBeRequired();
    expect(nativeInput).toHaveAttribute("aria-invalid", "true");
    expect(label).toHaveClass("Mui-disabled", "Mui-error", "Mui-required");

    rerender(
      <RatanDesignProvider designGeneration={designGeneration} mode={mode}>
        <Select label="Settlement status" variant="outlined" value="Pending">
          <MenuItem value="Pending">Pending</MenuItem>
        </Select>
      </RatanDesignProvider>
    );
    expect(screen.getByRole("combobox", { name: /settlement status/i })).not.toHaveAttribute(
      "aria-disabled", "true"
    );
    expect(formControl.querySelector("label")).not.toHaveClass("Mui-disabled", "Mui-error", "Mui-required");
  });

  it("generates unique label relationships for custom and native selects", () => {
    render(
      <>
        <Select label="Desk" variant="outlined" value="Singapore">
          <MenuItem value="Singapore">Singapore</MenuItem>
        </Select>
        <Select native label="Settlement status" variant="outlined" defaultValue="Pending">
          <option value="Pending">Pending</option>
        </Select>
        <Select native label="Settlement status" variant="outlined" defaultValue="Confirmed">
          <option value="Confirmed">Confirmed</option>
        </Select>
        <Select
          native
          id="explicit-status"
          labelId="explicit-status-label"
          label="Explicit settlement status"
          variant="outlined"
          defaultValue="Settled"
        >
          <option value="Settled">Settled</option>
        </Select>
      </>
    );

    const custom = screen.getByRole("combobox", { name: "Desk" });
    const generatedNative = screen.getAllByRole("combobox", {
      name: "Settlement status",
    });
    const explicitNative = screen.getByRole("combobox", {
      name: "Explicit settlement status",
    });
    expect(custom.id).not.toBe("");
    expect(generatedNative[0].id).not.toBe("");
    expect(generatedNative[1].id).not.toBe("");
    expect(generatedNative[0].id).not.toBe(generatedNative[1].id);
    expect(explicitNative).toHaveAttribute("id", "explicit-status");
    expect(document.querySelector('label[for="explicit-status"]')).toHaveAttribute(
      "id",
      "explicit-status-label"
    );
  });

  it("keeps explicit disabled state and supports a custom loading indicator size", () => {
    const { rerender } = render(
      <LoadingButton loading loadingSize={20}>
        Save
      </LoadingButton>
    );
    const loadingButton = screen.getByRole("button", { name: "Save" });
    expect(screen.getByRole("progressbar", { hidden: true })).toHaveStyle({
      width: "20px",
      height: "20px",
    });
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveAttribute("aria-busy", "true");
    rerender(<LoadingButton disabled>Save</LoadingButton>);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save" })).not.toHaveAttribute(
      "aria-busy"
    );
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
    const loadingButton = screen.getByRole("button", { name: "Save" });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("progressbar", { hidden: true })).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    fireEvent.click(ref.current!);
    expect(onClick).not.toHaveBeenCalled();
    rerender(
      <LoadingButton ref={ref} onClick={onClick}>
        Save
      </LoadingButton>
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Save" })).not.toHaveAttribute(
      "aria-busy"
    );
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("names the search clear action and supports localized action text", () => {
    const clear = vi.fn();
    const { rerender } = render(
      <SearchInput
        label="Find trade"
        variant="outlined"
        handleClear={clear}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(clear).toHaveBeenCalledOnce();
    expect(screen.getByTestId("SearchIcon")).toBeVisible();
    rerender(
      <SearchInput
        label="Find trade"
        variant="outlined"
        clearButtonLabel="Clear trade search"
        handleClear={clear}
      />
    );
    expect(
      screen.getByRole("button", { name: "Clear trade search" })
    ).toBeEnabled();
  });

  it("composes SearchInput default padding with caller object, callback and array sx", () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <SearchInput
          label="Find trade"
          variant="outlined"
          handleClear={vi.fn()}
          sx={[
            { width: "120px" },
            false,
            (theme) => ({ width: theme.spacing(30) }),
          ]}
        />
      </ThemeProvider>
    );
    const input = screen.getByRole("textbox", { name: "Find trade" });
    expect(input.closest(".MuiFormControl-root")).toHaveStyle({ width: "240px" });
    expect(input.closest(".MuiInputBase-root")).toHaveStyle({ paddingRight: "8px" });
  });

  it.each<{
    name: string;
    props: Partial<SearchInputProps>;
    unavailable: boolean;
  }>([
    { name: "disabled", props: { disabled: true }, unavailable: true },
    {
      name: "legacy input read-only",
      props: { InputProps: { readOnly: true } },
      unavailable: true,
    },
    {
      name: "modern input read-only",
      props: { slotProps: { input: { readOnly: true } } },
      unavailable: true,
    },
    {
      name: "legacy native read-only",
      props: { inputProps: { readOnly: true } },
      unavailable: true,
    },
    {
      name: "modern native read-only",
      props: { slotProps: { htmlInput: { readOnly: true } } },
      unavailable: true,
    },
    {
      name: "modern input override",
      props: {
        InputProps: { readOnly: true },
        slotProps: { input: { readOnly: false } },
      },
      unavailable: false,
    },
    {
      name: "modern native override",
      props: {
        inputProps: { readOnly: true },
        slotProps: { htmlInput: { readOnly: false } },
      },
      unavailable: false,
    },
  ])(
    "keeps the clear action consistent with $name field state",
    ({ props, unavailable }) => {
      const clear = vi.fn();
      render(
        <SearchInput
          {...props}
          label="Find trade"
          variant="outlined"
          handleClear={clear}
        />
      );
      const button = screen.getByRole("button", { name: "Clear search" });
      expect(button).toHaveProperty("disabled", unavailable);
      fireEvent.click(button);
      expect(clear).toHaveBeenCalledTimes(unavailable ? 0 : 1);
    }
  );

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
    const search = screen.getByRole("button", { name: "Search" });
    expect(screen.getByRole("progressbar", { hidden: true })).toHaveStyle({
      width: "20px",
      height: "20px",
    });
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(search).toBeDisabled();
    expect(search).toHaveAttribute("aria-busy", "true");
    fireEvent.click(search);
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

  it("maps the complete WebKit primary and secondary action state vocabulary", () => {
    expect(getWebkitActionStyle("primary", true)).toMatchObject({
      "&.MuiButtonBase-root": {
        backgroundColor: "var(--sc-button-primary-background-color)",
        borderColor: "var(--sc-button-primary-border-color)",
        color: "var(--sc-button-primary-text-color)",
      },
      "&:hover": {
        backgroundColor: "var(--sc-button-primary-hover-background-color)",
      },
      "&:active": {
        backgroundColor: "var(--sc-button-primary-press-background-color)",
      },
      "&.Mui-focusVisible": {
        outlineColor: "var(--sc-focus-ring-color)",
      },
      "&.Mui-disabled": {
        backgroundColor: "var(--sc-button-primary-disabled-background-color)",
        color: "var(--sc-button-primary-disabled-text-color)",
      },
      "&.MuiButton-containedError, &.MuiButton-outlinedError, &.MuiButton-textError": {
        backgroundColor: "var(--sc-button-primary-error-background-color)",
        "&:hover": {
          backgroundColor: "var(--sc-button-primary-error-hover-background-color)",
        },
        "&:active": {
          backgroundColor: "var(--sc-button-primary-error-press-background-color)",
        },
      },
    });
    expect(getWebkitActionStyle("secondary", false)).toMatchObject({
      "&.MuiButtonBase-root": {
        backgroundColor: "var(--sc-button-secondary-background-color)",
      },
      "&:hover": {
        backgroundColor: "var(--sc-button-secondary-hover-background-color)",
      },
      "&:active": {
        backgroundColor: "var(--sc-button-secondary-press-background-color)",
      },
      "&.Mui-disabled": {
        backgroundColor: "var(--sc-button-secondary-disabled-background-color)",
      },
    });
  });

  it("keeps legacy Toggle styles and exposes semantic WebKit Toggle states", () => {
    const theme = {
      shape: { borderRadius: 5 },
      ratan: { designGeneration: "webkit" },
    } as never;
    expect(modeStyle(theme, "light", "webkit")).toMatchObject({
      "&.MuiButtonBase-root": {
        backgroundColor: "var(--sc-button-secondary-background-color)",
      },
      "&.Mui-selected": {
        backgroundColor: "var(--sc-button-secondary-select-background-color)",
        color: "var(--sc-button-secondary-select-text-color)",
      },
    });
    expect(modeStyle(theme, "light", "legacy")).toMatchObject({
      "&.MuiToggleButton-root": { backgroundColor: "rgba(237,237,237,1)" },
    });
  });

  it("renders the label selector and reports the selected label", () => {
    const changed = vi.fn();
    render(
      <Label label="Status" value="Status" onChange={changed}>
        <LabelMenuItem value="Confirmed">Confirmed</LabelMenuItem>
      </Label>
    );
    fireEvent.mouseDown(screen.getByRole("combobox", { name: "Status" }));
    fireEvent.click(screen.getByRole("option", { name: "Confirmed" }));
    expect(changed).toHaveBeenCalled();
  });

  it("lets callers override the label selector accessible name", () => {
    render(
      <>
        <Label label="Group by" value="Group by" aria-label="Group trades by">
          <LabelMenuItem value="Counterparty">Counterparty</LabelMenuItem>
        </Label>
        <span id="portfolio-group-label">Portfolio grouping</span>
        <Label
          label="Group by"
          value="Group by"
          aria-labelledby="portfolio-group-label"
        >
          <LabelMenuItem value="Status">Status</LabelMenuItem>
        </Label>
      </>
    );
    expect(
      screen.getByRole("combobox", { name: "Group trades by" })
    ).toBeVisible();
    expect(
      screen.getByRole("combobox", { name: "Portfolio grouping" })
    ).toBeVisible();
  });

  it("composes a search grid and removes a closed condition", () => {
    const closed = vi.fn();
    render(
      <RatanDesignProvider mode="light" designGeneration="legacy">
        <SearchGrid data-testid="search-grid">
          <SearchCondition
            label="Status"
            value="Confirmed"
            onClose={closed}
          />
        </SearchGrid>
      </RatanDesignProvider>
    );

    expect(screen.getByTestId("search-grid")).toHaveTextContent(
      "StatusConfirmed"
    );
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(closed).toHaveBeenCalledOnce();
    expect(screen.queryByText("Confirmed")).not.toBeInTheDocument();
    expect(searchConditionModeStyle("dark")).toBe("rgba(203, 203, 203, 1)");
    expect(searchConditionModeStyle("light")).toBe("rgba(34,34,34, 1)");
  });

  it("expands and collapses search conditions while enforcing layout defaults", () => {
    const { rerender } = render(
      <RatanDesignProvider mode="dark" designGeneration="legacy">
        <SearchConditionContainer
          data-testid="conditions"
          spacing={4}
          direction="column"
          useFlexGap={false}
          style={{ height: "900px" }}
        >
          <span>Condition</span>
        </SearchConditionContainer>
      </RatanDesignProvider>
    );

    const container = screen.getByTestId("conditions");
    const generatedId = container.id;
    expect(container).toHaveStyle({ height: "49px" });
    const expand = screen.getByRole("button", {
      name: "Expand search criteria",
    });
    expect(generatedId).not.toBe("");
    expect(expand).toHaveAttribute("aria-controls", generatedId);
    expect(expand).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(expand);
    expect(container).toHaveStyle({ height: "auto" });
    const collapse = screen.getByRole("button", {
      name: "Collapse search criteria",
    });
    expect(collapse).toHaveAttribute("aria-controls", generatedId);
    expect(collapse).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(collapse);
    expect(container).toHaveStyle({ height: "49px" });
    expect(searchConditionContainerModeStyle("dark")).toBe(
      "rgba(0, 0, 0, 1)"
    );
    expect(searchConditionContainerModeStyle("light")).toBe(
      "rgba(243, 243, 243, 1)"
    );
    expect(searchConditionContainerBorderStyle("dark")).toBe(
      "1px solid rgba(44, 63, 94, 1)"
    );
    expect(searchConditionContainerBorderStyle("light")).toBe(
      "1px solid rgba(208, 208, 208, 1)"
    );

    rerender(
      <RatanDesignProvider mode="light" designGeneration="webkit">
        <SearchConditionContainer data-testid="webkit-conditions">
          <SearchCondition label="Status" value="Open" onClose={vi.fn()} />
        </SearchConditionContainer>
      </RatanDesignProvider>
    );
    expect(screen.getByTestId("webkit-conditions")).toHaveTextContent(
      "StatusOpen"
    );
  });

  it("keeps the visible criteria interactive and removes clipped rows from navigation", () => {
    let secondTop = 57;
    const bounds = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        const testId = this.getAttribute("data-testid");
        const top = testId === "second-condition" ? secondTop : 8;
        const height = testId === "conditions" ? 49 : 32;
        return {
          x: 0,
          y: top,
          top,
          right: 300,
          bottom: top + height,
          left: 0,
          width: 300,
          height,
          toJSON: () => ({}),
        };
      });

    try {
      const firstClick = vi.fn();
      const secondClick = vi.fn();
      render(
        <SearchConditionContainer id="trade-criteria" data-testid="conditions">
          <button data-testid="first-condition" onClick={firstClick}>
            First criterion
          </button>
          <button data-testid="second-condition" onClick={secondClick}>
            Second criterion
          </button>
        </SearchConditionContainer>
      );

      const first = screen.getByTestId("first-condition");
      const second = screen.getByTestId("second-condition");
      const expand = screen.getByRole("button", {
        name: "Expand search criteria",
      });
      expect(expand).toHaveAttribute("aria-controls", "trade-criteria");
      expect(expand).toHaveAttribute("aria-expanded", "false");
      expect(first).not.toHaveAttribute("inert");
      expect(first).not.toHaveAttribute("aria-hidden");
      expect(second).toHaveAttribute("inert");
      expect(second).toHaveAttribute("aria-hidden", "true");
      fireEvent.click(first);
      expect(firstClick).toHaveBeenCalledOnce();

      fireEvent.click(expand);
      const collapse = screen.getByRole("button", {
        name: "Collapse search criteria",
      });
      expect(collapse).toHaveAttribute("aria-expanded", "true");
      expect(second).not.toHaveAttribute("inert");
      expect(second).not.toHaveAttribute("aria-hidden");
      fireEvent.click(second);
      expect(secondClick).toHaveBeenCalledOnce();

      fireEvent.click(collapse);
      expect(expand).toHaveFocus();
      secondTop = 8;
      fireEvent(window, new Event("resize"));
      expect(second).not.toHaveAttribute("inert");
      second.focus();
      secondTop = 57;
      fireEvent(window, new Event("resize"));
      expect(expand).toHaveFocus();
      expect(second).toHaveAttribute("inert");
    } finally {
      bounds.mockRestore();
    }
  });

  it("treats host themes without generation metadata as legacy", () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <SearchConditionContainer data-testid="host-conditions">
          <SearchCondition
            label="Status"
            value="Pending"
            onClose={vi.fn()}
          />
        </SearchConditionContainer>
      </ThemeProvider>
    );

    expect(screen.getByTestId("host-conditions")).toHaveTextContent(
      "StatusPending"
    );
  });
});
