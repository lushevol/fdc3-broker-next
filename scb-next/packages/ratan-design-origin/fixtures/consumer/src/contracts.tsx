import React from "react";
import type { Theme } from "@mui/material/styles";
import {
  Button,
  Input,
  Select,
  LoadingButton,
  type InputProps,
  type LoadingButtonProps,
} from "ratan-design-origin";
import {
  createRatanTheme,
  type DesignGeneration,
} from "ratan-design-origin/theme";
import { legacyTokens, newStyleTokens } from "ratan-design-origin/tokens";
import {
  InputStyled,
  legacyColorAliases,
} from "ratan-design-origin/compatibility";

const theme: Theme = createRatanTheme();
const generation: DesignGeneration = theme.ratan.designGeneration;
const input: InputProps = {
  variant: "outlined",
  inputProps: { maxLength: 50 },
  slotProps: { inputLabel: { shrink: false } },
};
const loading: LoadingButtonProps = { loading: false, loadingSize: 14 };
const buttonRef = React.createRef<HTMLButtonElement>();
const inputRef = React.createRef<HTMLInputElement>();
const rootRef = React.createRef<HTMLDivElement>();

export const capturedContracts = (
  <>
    <Button
      ref={buttonRef}
      sx={(currentTheme) => ({ color: currentTheme.palette.primary.main })}
    >
      Search
    </Button>
    <LoadingButton {...loading} ref={buttonRef}>
      Save
    </LoadingButton>
    <Input
      {...input}
      ref={rootRef}
      inputRef={inputRef}
      onChange={(event) => event.target.value}
    />
    <Select
      variant="standard"
      value="USD"
      onChange={(event, child) => {
        String(event.target.value);
        React.isValidElement(child);
      }}
    />
  </>
);
export const exportedContracts = {
  generation,
  legacyTokens,
  newStyleTokens,
  InputStyled,
  legacyColorAliases,
};
