import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";
import { DateRangePicker } from "../src/date-range";
import { LocalizationProvider, AdapterDayjs } from "../src/dates";

describe("public Pro date range integration", () => {
  it("keeps the single field, empty value, caller text props and hidden left layout", () => {
    const { rerender } = render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRangePicker
          label="Period"
          disabled
          slots={{ field: () => <input aria-label="Other field" /> }}
        />
      </LocalizationProvider>
    );
    expect(screen.queryByLabelText("Other field")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Period" })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "Period" })).toBeDisabled();
    rerender(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRangePicker
          label="Period"
          labelPosition="left"
          hidden
          className="host-range"
          slotProps={{ textField: { helperText: "Inclusive dates" } }}
          sx={{ width: 360 }}
        />
      </LocalizationProvider>
    );
    const field = screen.getByLabelText("Period");
    expect(field).not.toBeVisible();
    expect(field.closest(".host-range")).toHaveStyle({
      display: "none",
      width: "360px"
    });
    expect(screen.getByText("Inclusive dates")).toBeInTheDocument();
  });
  it("renders one range field and reports both dates on edits", () => {
    const change = vi.fn();
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRangePicker
          label="Period"
          value={[dayjs("2026-09-18"), dayjs("2026-09-21")]}
          format="YYYY-MM-DD"
          onChange={change}
        />
      </LocalizationProvider>
    );
    const field = screen.getByRole("textbox", { name: "Period" });
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(field).toHaveValue("2026-09-18 – 2026-09-21");
    fireEvent.change(field, { target: { value: "2026-09-19 – 2026-09-22" } });
    expect(
      change.mock.calls
        .at(-1)?.[0]
        .map((date: dayjs.Dayjs) => date.format("YYYY-MM-DD"))
    ).toEqual(["2026-09-19", "2026-09-22"]);
  });
});
