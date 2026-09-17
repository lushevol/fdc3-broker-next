import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import MenuItem from "@mui/material/MenuItem";
import { Button, LoadingButton, Input, Select } from "../src";

function Controls() {
  const [currency, setCurrency] = React.useState("USD");
  return (
    <div style={{ padding: 24, display: "grid", gap: 16, maxWidth: 480 }}>
      <Input label="Reference" variant="outlined" />
      <Input label="Account" variant="outlined" labelPosition="left" />
      <Input
        label="Amount"
        variant="outlined"
        error
        helperText="Enter a positive amount"
      />
      <Input label="Approved by" variant="outlined" disabled value="Pending" />
      <Select
        label="Currency"
        variant="outlined"
        value={currency}
        onChange={(event) => setCurrency(String(event.target.value))}
      >
        <MenuItem value="USD">USD</MenuItem>
        <MenuItem value="SGD">SGD</MenuItem>
      </Select>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Button variant="contained">Submit</Button>
        <Button disabled>Disabled</Button>
        <LoadingButton loading>Saving</LoadingButton>
      </div>
    </div>
  );
}

const meta: Meta<typeof Controls> = {
  title: "Controls/States",
  component: Controls,
};
export default meta;
export const States: StoryObj<typeof Controls> = {};
