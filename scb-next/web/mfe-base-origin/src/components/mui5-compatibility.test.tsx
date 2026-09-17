import React from "react";
import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DatePicker from "./DatePicker";
import DateTimePicker from "./DateTimePicker";
import TimePicker from "./TimePicker";
import DateRangePicker from "./DateRangePicker";
import useFieldController from "./TableDetail/common/Field.useController";
import type { FieldProps } from "./TableDetail/common/interface";

afterEach(() => vi.useRealTimers());

describe("MUI 5 and X 6 compatibility", () => {
  it.each([
    [DatePicker, "07/17/2023"],
    [DateTimePicker, "07/17/2023 10:30 AM"],
    [TimePicker, "10:30 AM"],
  ] as const)(
    "keeps a labeled, disabled picker with its controlled value",
    (Picker, value) => {
      render(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Picker
            label="Settlement"
            value={dayjs("2023-07-17T10:30:00")}
            disabled
          />
        </LocalizationProvider>
      );
      expect(screen.getByRole("textbox", { name: "Settlement" })).toHaveValue(
        value
      );
      expect(
        screen.getByRole("textbox", { name: "Settlement" })
      ).toBeDisabled();
      expect(
        screen.getByText("Settlement", { selector: "label" })
      ).toHaveAttribute("data-shrink", "true");
    }
  );

  it("retains the single-input date-range field and both controlled dates", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRangePicker
          label="Settlement range"
          value={[dayjs("2023-07-17"), dayjs("2023-07-27")]}
          disabled
        />
      </LocalizationProvider>
    );
    const input = screen.getByRole("textbox", { name: "Settlement range" });
    expect(input).toBeDisabled();
    expect(input).toHaveValue("07/17/2023 \u2013 07/27/2023");
  });

  it("passes X 6 row parameters to detail value getters on initial render and reset", () => {
    vi.useFakeTimers();
    const valueGetter = vi.fn(({ row }) => `${row.firstName} ${row.lastName}`);
    const onChange = vi.fn();
    const props: FieldProps = {
      column: { field: "fullName", valueGetter },
      columnId: 0,
      record: { id: 1, firstName: "Jon", lastName: "Snow" },
      onChange,
      resetId: 0,
    };
    const { result, rerender } = renderHook(useFieldController, {
      initialProps: props,
    });
    expect(result.current.fieldValue).toBe("Jon Snow");
    expect(valueGetter).toHaveBeenCalledWith(
      expect.objectContaining({ row: props.record, field: "fullName" })
    );
    act(() => vi.advanceTimersByTime(300));
    expect(onChange).toHaveBeenLastCalledWith("Jon Snow", "fullName");

    rerender({
      ...props,
      record: { id: 2, firstName: "Arya", lastName: "Stark" },
      resetId: 1,
    });
    expect(result.current.fieldValue).toBe("Arya Stark");
    act(() => vi.advanceTimersByTime(300));
    expect(onChange).toHaveBeenLastCalledWith("Arya Stark", "fullName");
  });
});
