import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Tile from ".";
import useController from "./common/useController";

vi.mock("./common/useController", () => ({ default: vi.fn() }));
vi.mock("../common/Main", () => ({ default: () => null }));

const tileProps = {
  module: "/tile",
  tile: "/tile",
  panelId: "tile-panel",
  tabId: "tile-tab",
};

function controller(
  category: { id?: number; label: string } | undefined,
  categories: { id?: number; label: string }[],
  onCategoryChange = vi.fn()
) {
  vi.mocked(useController).mockReturnValue({
    category,
    categories,
    inputValue: category?.label ?? "",
    onInputChange: vi.fn(),
    onCategoryChange,
    refresh: vi.fn(),
  } as ReturnType<typeof useController>);
  return onCategoryChange;
}

describe("tile category selection console contract", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("keeps a missing category controlled without selecting one or emitting changes", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const category = { id: 101, label: "Settlement" };
    const changed = controller(undefined, [category]);
    const { rerender } = render(<Tile {...tileProps} parameters={{}} />);
    expect(screen.getByRole("combobox")).toHaveValue("");
    expect(changed).not.toHaveBeenCalled();
    controller(category, [category], changed);
    rerender(<Tile {...tileProps} parameters={{}} />);
    expect(screen.getByRole("combobox")).toHaveValue("Settlement");
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("option", { name: "Settlement" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(changed).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  it("keeps the selected category after options are refreshed with new object instances", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const selected = { id: 101, label: "Settlement" };
    const changed = controller(selected, [selected]);
    const { rerender } = render(<Tile {...tileProps} parameters={{}} />);
    controller(selected, [{ id: 101, label: "Settlement" }], changed);
    rerender(<Tile {...tileProps} parameters={{}} />);
    expect(screen.getByRole("combobox")).toHaveValue("Settlement");
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("option", { name: "Settlement" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(changed).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  it("does not match unrelated options that have no category IDs", () => {
    const selected = { label: "Settlement" };
    controller(selected, [selected, { label: "Other" }]);
    render(<Tile {...tileProps} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("option", { name: "Settlement" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("option", { name: "Other" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });
});
