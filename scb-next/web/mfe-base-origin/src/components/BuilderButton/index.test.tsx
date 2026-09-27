import React from "react";
import { render, screen } from "@testing-library/react";
import { Typography, Button as MuiButton, Tabs, Tab, Box, Stack } from 'ratan-design-origin/primitives';
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import BuilderButton, { TabPanel, a11yTabPanelProps, emptyFunction } from ".";
import SearchInput from "../SearchInput";

const PopOverChildren = ({ handleClose }) => {
  const [searchVal, setSearchVal] = React.useState("")
  const handleClear = () => {
    setSearchVal("")
  }
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (<Box sx={{ width: '100%' }}>
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
    </TabPanel>
    <Stack spacing={2} direction="row">
      <MuiButton data-testid="popover-close" variant="outlined" color="inherit" onClick={handleClose}>Cancel</MuiButton>
      <MuiButton data-testid="popover-apply" variant="contained" color="primary" onClick={handleClose}>Apply</MuiButton>
    </Stack>
  </Box>)
}

const Comp = () => {
  const [el, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const onClose = () => {
    setAnchorEl(null);
  };
  return (
    <BuilderButton
      anchorEl={el}
      onClick={onClick}
      size={"small"}
      label="Table"
    >
      <PopOverChildren handleClose={onClose} />
    </BuilderButton>
  )
};

const Comp2 = () => {
  const [el, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const onClose = () => {
    setAnchorEl(null);
  };
  return (
    <BuilderButton
      anchorEl={el}
      onClick={onClick}
      label="Filters"
      popOverWidth="540px"
      popOverHeight="612px"
    >
      <PopOverChildren handleClose={onClose} />
    </BuilderButton>
  )
};

const waitFor = (time = 2000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time)
});

describe("BuilderButton component", () => {
  it("light theme should be in the document", async () => {
    render(<Provider data={{ theme: "light", token: undefined, user: undefined }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const BuilderButton = screen.getByTestId("BuilderButton")
    expect(BuilderButton).toBeInTheDocument();
    BuilderButton.click();
    await waitFor()
    const tabpanel = screen.getByTestId("Builder-tabpanel-1")
    expect(tabpanel).toBeInTheDocument();
    const popoverId = BuilderButton.getAttribute("aria-describedby");
    expect(document.getElementById(popoverId!)).toContainElement(tabpanel);
    tabpanel.click();
    const close = screen.getByTestId("popover-close");
    expect(close).toBeInTheDocument();
    close.click();
    emptyFunction();
  });
  it("dark theme should be in the document", async () => {
    render(<Provider data={{ theme: "dark", token: undefined, user: undefined }}>
      <ThemeProvider>
        <Comp2 />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const BuilderButton = screen.getByTestId("BuilderButton")
    expect(BuilderButton).toBeInTheDocument();
    BuilderButton.click();
    await waitFor()
    const tabpanel = screen.getByTestId("Builder-tabpanel-1")
    expect(tabpanel).toBeInTheDocument();
    tabpanel.click();
    const close = screen.getByTestId("popover-close");
    expect(close).toBeInTheDocument();
    close.click();
  });
});
