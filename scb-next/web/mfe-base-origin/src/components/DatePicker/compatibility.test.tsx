import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import dayjs from "dayjs";
import { AdapterDayjs, LocalizationProvider } from "@mui/x-date-pickers";
import DatePicker from ".";
import DateTimePicker from "../DateTimePicker";
import TimePicker from "../TimePicker";
import DateRangePicker from "../DateRangePicker";
import ThemeProvider from "../../theme";
import Provider from "../../hooks/provider";

describe("Base date compatibility exports", () => {
  it("retains formats, field overrides, edits and range composition", () => {
    const change = vi.fn();
    render(
      <Provider data={{ theme: "light", token: undefined, user: undefined }}>
        <ThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Settlement"
              value={dayjs("2026-09-18")}
              format="YYYY-MM-DD"
              onChange={change}
              slotProps={{
                textField: { inputProps: { "data-testid": "settlement-field" } }
              }}
            />
            <DateTimePicker
              label="Execution"
              value={dayjs("2026-09-18T15:30")}
              format="YYYY-MM-DD HH:mm"
            />
            <TimePicker
              label="Cutoff"
              value={dayjs("2026-09-18T16:00")}
              format="HH:mm"
              disabled
              labelPosition="left"
            />
            <DateRangePicker
              label="Period"
              value={[dayjs("2026-09-18"), dayjs("2026-09-21")]}
              format="YYYY-MM-DD"
            />
          </LocalizationProvider>
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByRole("textbox", { name: "Settlement" })).toHaveValue(
      "2026-09-18"
    );
    expect(screen.getByRole("textbox", { name: "Execution" })).toHaveValue(
      "2026-09-18 15:30"
    );
    expect(screen.getByRole("textbox", { name: "Cutoff" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Period" })).toHaveValue(
      "2026-09-18 – 2026-09-21"
    );
    expect(screen.getByTestId("settlement-field")).toHaveValue("2026-09-18");
    fireEvent.change(screen.getByRole("textbox", { name: "Settlement" }), {
      target: { value: "2026-09-22" }
    });
    expect(change.mock.calls.at(-1)?.[0].format("YYYY-MM-DD")).toBe(
      "2026-09-22"
    );
  });
});
