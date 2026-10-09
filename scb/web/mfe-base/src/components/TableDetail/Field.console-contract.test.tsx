import React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Field from "./Field";
import type { FieldProps } from "./common/interface";

const autocompleteColumn: FieldProps["column"] = {
  field: "icon",
  headerName: "Icon",
  editorType: "autoComplete",
  valueOptions: ["first.svg", "second.svg"],
};

describe("admin field console and value contract", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it.each([undefined, null, ""])(
    "displays an empty autocomplete for %s while retaining the raw callback value",
    (value) => {
      const onChange = vi.fn();
      render(
        <Field
          column={autocompleteColumn}
          columnId={0}
          record={{ icon: value }}
          resetId={0}
          onChange={onChange}
        />
      );
      expect(screen.getByRole("combobox")).toHaveValue("");
      act(() => vi.advanceTimersByTime(299));
      expect(onChange).not.toHaveBeenCalled();
      act(() => vi.advanceTimersByTime(1));
      expect(onChange).toHaveBeenCalledExactlyOnceWith(value, "icon");
      expect(console.error).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
    }
  );

  it("resets a missing autocomplete to a selected value without switching control mode", () => {
    const onChange = vi.fn();
    const props = { column: autocompleteColumn, columnId: 0, onChange };
    const { rerender } = render(
      <Field {...props} record={{}} resetId={0} />
    );
    rerender(<Field {...props} record={{ icon: "second.svg" }} resetId={1} />);
    expect(screen.getByRole("combobox")).toHaveValue("second.svg");
    act(() => vi.advanceTimersByTime(300));
    expect(onChange.mock.calls).toEqual([
      [undefined, "icon"],
      ["second.svg", "icon"],
    ]);
    expect(console.error).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("retains option selection, images and explicit React keys", () => {
    const onChange = vi.fn();
    render(
      <Field
        column={autocompleteColumn}
        columnId={0}
        record={{ icon: "first.svg" }}
        resetId={0}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const option = screen.getByRole("option", { name: /^second\.svg\s*second\.svg$/ });
    expect(screen.getByRole("img", { name: "second.svg" })).toHaveAttribute(
      "src",
      "/image/second.svg"
    );
    fireEvent.click(option);
    expect(screen.getByRole("combobox")).toHaveValue("second.svg");
    act(() => vi.advanceTimersByTime(300));
    expect(onChange).toHaveBeenLastCalledWith("second.svg", "icon");
    expect(console.error).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it.each([undefined, null])(
    "displays an empty select for %s without replacing the raw callback value",
    (value) => {
      const onChange = vi.fn();
      render(
        <Field
          column={{
            field: "template",
            headerName: "Template",
            type: "singleSelect",
            valueOptions: ["true", "false"],
          }}
          columnId={0}
          record={{ template: value }}
          resetId={0}
          onChange={onChange}
        />
      );
      const select = screen.getByRole("combobox");
      expect(select.parentElement?.querySelector("input")).toHaveValue("");
      fireEvent.change(select.parentElement?.querySelector("input") as HTMLInputElement, {
        target: { value: "false" },
      });
      act(() => vi.advanceTimersByTime(300));
      expect(onChange.mock.calls).toEqual([
        [value, "template"],
        [false, "template"],
      ]);
      expect(console.error).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
    }
  );

  it("keeps an existing unmatched nonempty value without selecting a replacement", () => {
    const onChange = vi.fn();
    render(
      <Field
        column={autocompleteColumn}
        columnId={0}
        record={{ icon: "custom.svg" }}
        resetId={0}
        onChange={onChange}
      />
    );
    expect(screen.getByRole("combobox")).toHaveValue("custom.svg");
    act(() => vi.advanceTimersByTime(300));
    expect(onChange).toHaveBeenCalledExactlyOnceWith("custom.svg", "icon");
  });

  it("allows typing into a missing text field without changing its initial raw callback", () => {
    const onChange = vi.fn();
    render(
      <Field
        column={{ field: "title", headerName: "Title" }}
        columnId={0}
        record={{}}
        resetId={0}
        onChange={onChange}
      />
    );
    const input = screen.getByRole("textbox", { name: "Title" });
    expect(input).toHaveValue("");
    fireEvent.change(input, { target: { value: "New title" } });
    act(() => vi.advanceTimersByTime(300));
    expect(onChange.mock.calls).toEqual([
      [undefined, "title"],
      ["New title", "title"],
    ]);
    expect(console.error).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
