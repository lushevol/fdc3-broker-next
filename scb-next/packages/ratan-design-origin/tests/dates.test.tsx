import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import { describe, expect, it, vi } from "vitest";
import { RatanDesignProvider } from "../src";
import {
  DatePicker,
  DateTimePicker,
  TimePicker,
  LocalizationProvider,
  AdapterDayjs
} from "../src/dates";

describe("public date integration", () => {
  it.each([DatePicker, DateTimePicker, TimePicker])(
    "supports empty, disabled, hidden and left-label fields",
    (Picker) => {
      const { rerender } = render(
        <RatanDesignProvider designGeneration="webkit" mode="dark">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Picker label="Schedule" value={null} disabled />
          </LocalizationProvider>
        </RatanDesignProvider>
      );
      expect(screen.getByRole("textbox", { name: "Schedule" })).toHaveValue("");
      expect(screen.getByRole("textbox", { name: "Schedule" })).toBeDisabled();
      rerender(
        <RatanDesignProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Picker
              label="Schedule"
              value={dayjs("2026-09-18T12:00")}
              labelPosition="left"
              className="host-date"
              hidden
              slotProps={{ textField: { helperText: "Host hint" } }}
              sx={{ width: 240 }}
            />
          </LocalizationProvider>
        </RatanDesignProvider>
      );
      const input = screen.getByLabelText("Schedule");
      expect(input).not.toBeVisible();
      expect(screen.getByText("Host hint")).toBeInTheDocument();
      expect(input.closest(".host-date")).toHaveStyle({
        display: "none",
        width: "240px"
      });
    }
  );

  it.each([
    {
      Picker: DatePicker,
      label: "Trade date",
      format: "YYYY-MM-DD",
      initial: "2026-09-18",
      edited: "2026-09-21"
    },
    {
      Picker: DateTimePicker,
      label: "Execution time",
      format: "YYYY-MM-DD HH:mm",
      initial: "2026-09-18 15:30",
      edited: "2026-09-21 09:45"
    },
    {
      Picker: TimePicker,
      label: "Cutoff time",
      format: "HH:mm",
      initial: "15:30",
      edited: "09:45"
    }
  ])(
    "$label preserves its uncontrolled default, edits and clearing",
    ({ Picker, label, format, initial, edited }) => {
      const change = vi.fn();
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);
      try {
        render(
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Picker
              label={label}
              defaultValue={dayjs("2026-09-18T15:30")}
              format={format}
              onChange={change}
            />
          </LocalizationProvider>
        );
        const field = screen.getByRole("textbox", { name: label });
        expect(field).toHaveValue(initial);

        fireEvent.change(field, { target: { value: edited } });
        expect(change.mock.calls.at(-1)?.[0].format(format)).toBe(edited);
        expect(field).toHaveValue(edited);

        fireEvent.change(field, { target: { value: "" } });
        expect(change.mock.calls.at(-1)?.[0]).toBeNull();
        expect(field).toHaveValue("");
        expect(consoleError.mock.calls.flat().join(" ")).not.toMatch(
          /uncontrolled.*controlled|controlled.*uncontrolled/i
        );
      } finally {
        consoleError.mockRestore();
      }
    }
  );

  it("uses host locale and publishes calendar selection within the provider", async () => {
    const change = vi.fn();
    render(
      <RatanDesignProvider designGeneration="webkit">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            label="Trade date"
            value={dayjs("2026-09-18")}
            onChange={change}
            desktopModeMediaQuery="@media (min-width: 0px)"
          />
        </LocalizationProvider>
      </RatanDesignProvider>
    );
    expect(screen.getByRole("textbox", { name: "Trade date" })).toHaveValue(
      "18/09/2026"
    );
    fireEvent.click(screen.getByRole("button", { name: /choose date/i }));
    const calendar = await screen.findByRole("dialog");
    expect(calendar.closest(".ratan-design-root")).not.toBeNull();
    fireEvent.click(screen.getByRole("gridcell", { name: "21" }));
    expect(change.mock.calls.at(-1)?.[0].format("YYYY-MM-DD")).toBe(
      "2026-09-21"
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });
  it("preserves date-time and time fields with caller formats and callbacks", () => {
    const change = vi.fn();
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Execution"
          value={dayjs("2026-09-18T15:30")}
          format="YYYY-MM-DD HH:mm"
          onChange={change}
        />
        <TimePicker
          label="Cutoff"
          value={dayjs("2026-09-18T16:00")}
          format="HH:mm"
          ampm={false}
          onChange={change}
        />
      </LocalizationProvider>
    );
    expect(screen.getByRole("textbox", { name: "Execution" })).toHaveValue(
      "2026-09-18 15:30"
    );
    const time = screen.getByRole("textbox", { name: "Cutoff" });
    expect(time).toHaveValue("16:00");
    fireEvent.change(time, { target: { value: "17:45" } });
    expect(change.mock.calls.at(-1)?.[0].format("HH:mm")).toBe("17:45");
  });
  it("displays a controlled date and publishes field edits as Dayjs values", () => {
    const change = vi.fn();
    render(
      <RatanDesignProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Settlement"
            value={dayjs("2026-09-18")}
            format="YYYY-MM-DD"
            onChange={change}
          />
        </LocalizationProvider>
      </RatanDesignProvider>
    );
    const field = screen.getByRole("textbox", { name: "Settlement" });
    expect(field).toHaveValue("2026-09-18");
    fireEvent.change(field, { target: { value: "2026-09-21" } });
    expect(change.mock.calls.at(-1)?.[0].format("YYYY-MM-DD")).toBe(
      "2026-09-21"
    );
  });
});
