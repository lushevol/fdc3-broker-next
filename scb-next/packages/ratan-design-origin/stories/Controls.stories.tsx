import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import MenuItem from "@mui/material/MenuItem";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
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
  Select,
  ToggleButton,
} from "../src";

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
      <SearchInput
        label="Find trade"
        variant="outlined"
        handleClear={() => undefined}
      />
      <SearchGrid>
        <Input label="Client FMID" variant="outlined" labelPosition="left" />
      </SearchGrid>
      <SearchConditionContainer>
        <SearchCondition
          label="Status"
          value="Confirmed"
          onClose={() => undefined}
        />
        <SearchCondition
          label="Currency"
          value="USD"
          onClose={() => undefined}
        />
      </SearchConditionContainer>
      <Label label="Group by" value="Group by">
        <LabelMenuItem value="Counterparty">Counterparty</LabelMenuItem>
        <LabelMenuItem value="Status">Status</LabelMenuItem>
      </Label>
      <ToggleButtonGroup exclusive value="tracking">
        <ToggleButton value="tracking">Tracking</ToggleButton>
        <ToggleButton value="archived">Archived</ToggleButton>
      </ToggleButtonGroup>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Button variant="contained">Submit</Button>
        <Button disabled>Disabled</Button>
        <LoadingButton loading>Saving</LoadingButton>
        <SearchButton>Search</SearchButton>
        <ResetButton>Reset</ResetButton>
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
