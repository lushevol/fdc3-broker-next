import React from "react";
import type { Meta } from "@storybook/react-vite";
import Typography from '@mui/material/Typography';
import SearchInput from "../../src/components/SearchInput";
import MuiButton from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { SearchButton } from "src/Root/import";
*/
import BuilderButton, { BuilderButtonProps, a11yTabPanelProps, TabPanel, Tabs, Tab } from "../../src/components/BuilderButton";
/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const ViewBuilderButton = Container.ViewBuilderButton.default;
export const BuilderButtonProps = Container.ViewBuilderButton.BuilderButtonProps;
...
export default Container;
*/

const PopOverChildren = ({ handleClose }) => {
  const [searchVal, setSearchVal] = React.useState("")
  const handleClear = () => {
    setSearchVal("")
  }
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} aria-label="Builder Tabs">
        <Tab label="Tab 1" {...a11yTabPanelProps(0)} />
        <Tab label="Tab 2" {...a11yTabPanelProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <SearchInput
          labelPosition="top"
          label="Show All Columns"
          variant="outlined"
          fullWidth
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          handleClear={handleClear}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
        <Typography>The content of the Popover.</Typography>
      </TabPanel>
      <Stack spacing={2} direction="row">
        <MuiButton data-testid="popover-close" variant="outlined" color="inherit" onClick={handleClose}>Cancel</MuiButton>
        <MuiButton data-testid="popover-apply" variant="contained" color="primary" onClick={handleClose}>Apply</MuiButton>
      </Stack>
    </Box>)
}

export const Button = ({ label, size, anchorEl, ...rest }: BuilderButtonProps) => {
  const [_anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <BuilderButton size={size || "small"} label={label || "Table"}
      anchorEl={_anchorEl}
      onClick={onClick}
      {...rest}
    >
      <PopOverChildren handleClose={onClose} />
    </BuilderButton>
  )
};

const meta: Meta<typeof Button> = {
  title: "Custom Input Component/Builder Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta


export const ViewLarge: BuilderButtonProps = {
  //@ts-ignore
  args: {
    size: "large",
  },
}

export const ViewMedium: BuilderButtonProps = {
  //@ts-ignore
  args: {
    size: "medium",
  },
}

export const ViewSmall: BuilderButtonProps = {
  //@ts-ignore
  args: {
    size: "small",
  },
}



export const FiltersLarge: BuilderButtonProps = {
  //@ts-ignore
  args: {
    size: "large",
    label: "Filters",
    popOverWidth: "455px",
    popOverHeight: "612px",
  },
}

export const FiltersMedium: BuilderButtonProps = {
  //@ts-ignore
  args: {
    size: "medium",
    label: "Filters",
    popOverWidth: "455px",
    popOverHeight: "612px",
  },
}

export const FiltersSmall: BuilderButtonProps = {
  //@ts-ignore
  args: {
    size: "small",
    label: "Filters",
    popOverWidth: "455px",
    popOverHeight: "612px",
  },
}