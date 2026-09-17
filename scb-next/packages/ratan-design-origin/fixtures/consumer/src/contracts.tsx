import React from 'react';
import type { Theme } from '@mui/material/styles';
import {
  Button,
  BuilderButton,
  BuilderTab,
  BuilderTabs,
  BuilderTabPanel,
  builderTabProps,
  type BuilderButtonProps,
  Loader,
  PageLoader,
  Snackbar,
  type LoaderProps,
  type SnackbarProps,
  Input,
  Select,
  LoadingButton,
  Label,
  LabelMenuItem,
  ResetButton,
  SearchButton,
  SearchCondition,
  SearchConditionContainer,
  SearchGrid,
  SearchInput,
  ToggleButton,
  type InputProps,
  type LoadingButtonProps,
} from 'ratan-design-origin';
import { createRatanTheme, type DesignGeneration } from 'ratan-design-origin/theme';
import { legacyTokens, newStyleTokens } from 'ratan-design-origin/tokens';
import { InputStyled, legacyColorAliases } from 'ratan-design-origin/compatibility';

const theme: Theme = createRatanTheme();
const generation: DesignGeneration = theme.ratan.designGeneration;
const input: InputProps = {
  variant: 'outlined',
  inputProps: { maxLength: 50 },
  slotProps: { inputLabel: { shrink: false } },
};
const loading: LoadingButtonProps = { loading: false, loadingSize: 14 };
const buttonRef = React.createRef<HTMLButtonElement>();
const inputRef = React.createRef<HTMLInputElement>();
const rootRef = React.createRef<HTMLDivElement>();

export const capturedContracts = (
  <>
    <Button ref={buttonRef} sx={(currentTheme) => ({ color: currentTheme.palette.primary.main })}>
      Search
    </Button>
    <LoadingButton {...loading} ref={buttonRef}>
      Save
    </LoadingButton>
    <Input {...input} ref={rootRef} inputRef={inputRef} onChange={(event) => event.target.value} />
    <Select
      variant="standard"
      value="USD"
      onChange={(event, child) => {
        String(event.target.value);
        React.isValidElement(child);
      }}
    />
    <SearchInput variant="outlined" handleClear={() => undefined} />
    <SearchButton loading={false}>Search</SearchButton>
    <ResetButton>Reset</ResetButton>
    <SearchGrid>
      <Input label="Reference" variant="outlined" />
    </SearchGrid>
    <SearchConditionContainer>
      <SearchCondition label="Status" value="Confirmed" onClose={() => undefined} />
    </SearchConditionContainer>
    <ToggleButton value="active">Active</ToggleButton>
    <Label label="Status" value="Status">
      <LabelMenuItem value="Confirmed">Confirmed</LabelMenuItem>
    </Label>
  </>
);
export const exportedContracts = {
  generation,
  legacyTokens,
  newStyleTokens,
  InputStyled,
  legacyColorAliases,
};

const loader: LoaderProps = { text: 'Loading trades', size: '24px', 'aria-label': 'Refreshing' };
const notification: SnackbarProps = {
  open: true,
  severity: 'success',
  message: <strong>Saved</strong>,
  alertsx: [(currentTheme) => ({ color: currentTheme.palette.text.primary })],
  onClose: (_event, reason) => {
    String(reason);
  },
};
export const feedbackContracts = (
  <>
    <Loader {...loader} />
    <PageLoader {...loader} slotProps={{ loader: { 'data-testid': 'loading' } }} />
    <Snackbar {...notification} action={<Button>Undo</Button>} />
  </>
);

const builder: BuilderButtonProps = { label: 'Filters', anchorEl: null, popOverWidth: '400px' };
export const builderContracts = (
  <BuilderButton {...builder}>
    <BuilderTabs value={0} ref={rootRef}>
      <BuilderTab component="button" ref={buttonRef} label="Columns" {...builderTabProps(0)} />
      <BuilderTab component="a" href="#settings" label="Settings" {...builderTabProps(1)} />
    </BuilderTabs>
    <BuilderTabPanel value={0} index={0}>Column settings</BuilderTabPanel>
  </BuilderButton>
);
