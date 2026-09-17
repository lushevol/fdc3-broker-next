import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  BuilderButton, BuilderTab, BuilderTabs, BuilderTabPanel,
  builderTabProps, Button, SearchInput,
} from "../src";

function Builder() {
  const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);
  const [value, setValue] = React.useState(0);
  const [search, setSearch] = React.useState("");
  return (
    <div style={{ padding: 24 }}>
      <BuilderButton label="Table" anchorEl={anchor} onClick={(event) => setAnchor(event.currentTarget)}>
        <BuilderTabs value={value} onChange={(_event, next: number) => setValue(next)} aria-label="Table settings">
          <BuilderTab label="Columns" {...builderTabProps(0)} />
          <BuilderTab label="Order" {...builderTabProps(1)} />
        </BuilderTabs>
        <BuilderTabPanel value={value} index={0}>
          <SearchInput label="Columns" variant="outlined" fullWidth value={search}
            onChange={(event) => setSearch(event.target.value)} handleClear={() => setSearch("")} />
          {["Reference", "Counterparty", "Amount", "Currency", "Status"]
            .filter((column) => column.toLowerCase().includes(search.toLowerCase()))
            .map((column) => <FormControlLabel key={column} control={<Checkbox defaultChecked />} label={column} />)}
        </BuilderTabPanel>
        <BuilderTabPanel value={value} index={1}>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Newest first" />
        </BuilderTabPanel>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="inherit" onClick={() => setAnchor(null)}>Cancel</Button>
          <Button variant="contained" onClick={() => setAnchor(null)}>Apply</Button>
        </Stack>
      </BuilderButton>
    </div>
  );
}

const meta: Meta<typeof Builder> = { title: "Search/Builder", component: Builder };
export default meta;
export const Table: StoryObj<typeof Builder> = {};
