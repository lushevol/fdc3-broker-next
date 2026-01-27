import { styled } from '@mui/material/styles';
import MuiTextField, { type TextFieldProps, type TextFieldVariants } from '@mui/material/TextField';
import * as React from 'react';

const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_CustomInput`;
const classes = {
  left: `${PREFIX}-left`,
};

export const InputStyled =
  (c) =>
  ({ theme }) => ({
    margin: 0,
    width: 'auto',
    [`&.${c.left}`]: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      '& .MuiFormLabel-root': {
        marginRight: theme.spacing(1),
        marginBottom: 0,
      },
    },
    '& .MuiFormControl-root': {
      margin: 0,
    },
    '& .MuiOutlinedInput-root': {
      margin: 0,
    },
    '& .MuiFormLabel-root': {
      position: 'static',
      fontSize: 'inherit',
      transformOrigin: 'center left',
      textOverflow: 'inherit',
      overflow: 'inherit',
      transform: 'none',
      textTransform: 'capitalize',
      marginRight: 0,
      marginBottom: theme.spacing(1),
      backgroundColor: 'transparent!important',
    },
    '& legend': {
      display: 'none',
    },
  });
const TextField = styled(MuiTextField)(InputStyled(classes));

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  labelPosition?: 'top' | 'left';
  variant: TextFieldVariants;
  hidden?: boolean;
  disabled?: boolean;
}

export default function Input({
  labelPosition = 'top',
  variant: _variant,
  hidden,
  disabled: _disabled,
  ...rest
}: Readonly<InputProps>) {
  return (
    <TextField
      variant={_variant}
      className={labelPosition.toLocaleLowerCase() === 'left' ? classes.left : undefined}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        disabled: _disabled,
      }}
      style={{ display: hidden ? 'none' : undefined }}
      {...rest}
    />
  );
}
