import React from 'react';
import type { Theme } from '@mui/material/styles';
import {
  Button,
  Dialog,
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
import { styled } from 'ratan-design-origin/theme';
import { Box, TextField, Tab, Tabs } from 'ratan-design-origin/primitives';
import { LockOutlined, PersonOutlined } from 'ratan-design-origin/icons';
import { legacyTokens, newStyleTokens } from 'ratan-design-origin/tokens';
import { InputStyled, legacyColorAliases } from 'ratan-design-origin/compatibility';
import {
  Button as BaseButton,
  Dialog as BaseDialog,
  Loader as BaseLoader,
  LoadingButton as BaseLoadingButton,
  Time as BaseTime,
} from 'ratan-design-origin/base-compat';

const theme: Theme = createRatanTheme();
export const LoginComposition = styled(Box)(() => ({
  '& .MuiTextField-root': { width: '100%' },
}));
export const loginPrimitiveContracts = (
  <LoginComposition>
    <TextField variant="outlined" InputProps={{ startAdornment: <PersonOutlined /> }} />
    <TextField type="password" InputProps={{ startAdornment: <LockOutlined /> }} />
    <Tabs value={0}><Tab label="Sign in" /></Tabs>
  </LoginComposition>
);
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
    <Input
      {...input}
      ref={rootRef}
      inputRef={inputRef}
      defaultValue="ABC123"
      onChange={(event) => event.target.value}
    />
    <Select
      variant="standard"
      ref={rootRef}
      id="settlement-currency"
      labelId="settlement-currency-label"
      value="USD"
      onChange={(event, child) => {
        String(event.target.value);
        React.isValidElement(child);
      }}
    />
    <SearchInput
      variant="outlined"
      defaultValue="trade"
      handleClear={() => undefined}
      clearButtonLabel="Clear trade search"
      slotProps={{ htmlInput: { readOnly: true } }}
    />
    <SearchButton loading loadingPosition="inline">
      Search
    </SearchButton>
    <SearchButton loading loadingPosition="startIcon">
      Search with icon
    </SearchButton>
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

export const baseCompatibilityContracts = (
  <>
    <BaseButton.default type="primary">Open</BaseButton.default>
    <BaseLoadingButton.default loading>Save</BaseLoadingButton.default>
    <BaseLoader.default />
    <BaseTime.Time value={0} />
    <BaseDialog.default open={false}>Details</BaseDialog.default>
  </>
);

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
    <Dialog
      open={false}
      titleComponents="Trade details"
      titleProps={{ id: 'trade-dialog-title' }}
      aria-labelledby="trade-dialog-title"
      contentRef={rootRef}
      onCloseButton={() => undefined}
      onClose={(_event, reason) => {
        const closeReason: 'backdropClick' | 'escapeKeyDown' = reason;
        String(closeReason);
      }}
    >
      Trade content
    </Dialog>
  </>
);

const builder: BuilderButtonProps = {
  label: 'Filters',
  anchorEl: null,
  popOverWidth: '400px',
  onClose: (_event, reason) => {
    const closeReason: 'backdropClick' | 'escapeKeyDown' = reason;
    String(closeReason);
  },
};
export const builderContracts = (
  <BuilderButton {...builder}>
    <BuilderTabs value={0} ref={rootRef}>
      <BuilderTab component="button" ref={buttonRef} label="Columns" {...builderTabProps(0)} />
      <BuilderTab component="a" href="#settings" label="Settings" {...builderTabProps(1)} />
    </BuilderTabs>
    <BuilderTabPanel value={0} index={0}>
      Column settings
    </BuilderTabPanel>
  </BuilderButton>
);
