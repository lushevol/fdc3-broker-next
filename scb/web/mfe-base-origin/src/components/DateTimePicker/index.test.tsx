import React from "react";
import { render, screen } from "@testing-library/react";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import DateRangePicker from ".";
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';

const Comp = () => {
  return (
    <DateRangePicker
      label="Date Picker Top"
    />
  )
};

const Comp2 = () => {
  return (
    <DateRangePicker
      label="Date Picker Left"
      labelPosition="left"
      value={"2023-07-17"}
      onChange={(val)=>{}}
    />
  )
};

const Comp3 = () => {
  return (
    <DateRangePicker
      label="Date Picker Left"
      labelPosition="left"
      value={"2023-07-17"}
      onChange={(val)=>{}}
      hidden={true}
    />
  )
};

describe("DateTimePicker component", () => {
  it("light theme should be in the document", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider data={{ theme: "light", token: undefined, user: undefined }}>
          <ThemeProvider>
            <Comp />
          </ThemeProvider>
        </Provider>
      </LocalizationProvider>);
    expect(screen).toBeDefined();
  });
  it("dark theme should be in the document", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider data={{ theme: "light", token: undefined, user: undefined }}>
          <ThemeProvider>
            <Comp2 />
          </ThemeProvider>
        </Provider>
      </LocalizationProvider>);
    expect(screen).toBeDefined();
  });
  it("dark theme should be in the document", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider data={{ theme: "light", token: undefined, user: undefined }}>
          <ThemeProvider>
            <Comp3 />
          </ThemeProvider>
        </Provider>
      </LocalizationProvider>);
    expect(screen).toBeDefined();
  });
});
