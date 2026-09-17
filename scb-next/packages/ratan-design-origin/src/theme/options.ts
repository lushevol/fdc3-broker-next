import type { PaletteMode, ThemeOptions } from '@mui/material';
import { legacyTokens as custom } from '../tokens/legacy.js';
import type { ControlThemeConfig, DesignGeneration } from './index.js';

const getWebkitOptions = (props: ControlThemeConfig): ThemeOptions => {
  const dark = props.palette.mode === 'dark';
  const mode = props.palette.mode as PaletteMode;
  return {
    typography: {
      fontFamily:
        '"SC Prosper Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: 14,
      button: { textTransform: 'none' },
    },
    palette: {
      mode,
      primary: { main: '#0473EA' },
      secondary: { main: dark ? '#68ABF2' : '#02458C' },
      error: { main: dark ? '#E9545B' : '#E00A15' },
      warning: { main: '#FAAD14' },
      success: { main: dark ? '#73E350' : '#207E00' },
      background: {
        default: dark ? '#1A1A1A' : '#F9F9F9',
        paper: dark ? '#000000' : '#FFFFFF',
      },
      text: {
        primary: dark ? '#CCE3FA' : '#00172E',
        secondary: dark ? '#B2B2B2' : '#595959',
      },
    },
    shape: { borderRadius: 6 },
    components: {
      MuiButtonBase: {
        styleOverrides: {
          root: {
            '&.Mui-focusVisible': {
              outline: '2px solid var(--sc-button-focus-outline-color)',
              outlineOffset: 2,
            },
          },
        },
      },
      MuiButton: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          root: {
            minHeight: 'var(--sc-spacing-32, 2rem)',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--sc-button-rounded-border-radius, 0.375rem)',
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.375,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'var(--sc-button-hover-shadow, 0 1px 3px 1px rgb(26 26 26 / 15%))',
            },
          },
          containedPrimary: {
            color: 'var(--sc-button-primary-text-color)',
            backgroundColor: 'var(--sc-button-primary-background-color)',
            border: '1px solid var(--sc-button-primary-border-color)',
            '&:hover': {
              color:
                'var(--sc-button-primary-hover-text-color, var(--sc-button-primary-text-color))',
              backgroundColor: 'var(--sc-button-primary-hover-background-color)',
              borderColor: 'var(--sc-button-primary-hover-border-color)',
            },
            '&:active': {
              color: 'var(--sc-button-primary-press-text-color)',
              backgroundColor: 'var(--sc-button-primary-press-background-color)',
              borderColor: 'var(--sc-button-primary-press-border-color)',
            },
          },
          outlinedPrimary: {
            color: 'var(--sc-button-secondary-text-color)',
            backgroundColor: 'var(--sc-button-secondary-background-color)',
            borderColor: 'var(--sc-button-secondary-border-color)',
            '&:hover': {
              color: 'var(--sc-button-secondary-hover-text-color)',
              backgroundColor: 'var(--sc-button-secondary-hover-background-color)',
              borderColor: 'var(--sc-button-secondary-hover-border-color)',
            },
          },
        },
      },
      MuiInputBase: {
        defaultProps: { margin: 'dense' },
        styleOverrides: {
          input: {
            fontSize: '0.875rem',
            lineHeight: '1.375rem',
            '&::placeholder': {
              color: 'var(--sc-form-control-placeholder-color)',
              opacity: 1,
            },
          },
        },
      },
      MuiOutlinedInput: {
        defaultProps: { margin: 'dense' },
        styleOverrides: {
          root: {
            minHeight: 'var(--sc-spacing-32, 2rem)',
            color: 'var(--sc-form-control-color)',
            backgroundColor: 'var(--sc-form-control-background-color)',
            borderRadius: 'var(--sc-form-input-border-radius, 0.375rem)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--sc-form-control-border-color)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--sc-form-input-hover-border-color, var(--sc-color-blue-450))',
            },
            '&.Mui-focused': {
              outline:
                '2px solid var(--sc-form-input-focus-outline-color, var(--sc-color-blue-100))',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--sc-form-input-focus-border-color)',
              borderWidth: 1,
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--sc-form-input-error-border-color)',
            },
            '&.Mui-disabled': {
              backgroundColor: 'var(--sc-form-disabled-input-background-color)',
            },
          },
          input: { padding: '0.25rem 0.75rem' },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: 'var(--sc-label-color)',
            fontSize: '0.75rem',
            fontWeight: 500,
            lineHeight: '1.25rem',
          },
        },
      },
      MuiFormHelperText: {
        defaultProps: { margin: 'dense' },
        styleOverrides: { root: { fontSize: '0.75rem' } },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundColor: 'var(--sc-panel-background-color)' },
        },
      },
    },
  };
};

export const getThemeOptions = (
  props: ControlThemeConfig,
  designGeneration: DesignGeneration = 'legacy',
): ThemeOptions => {
  if (designGeneration === 'webkit') return getWebkitOptions(props);
  return {
    typography: {
      fontFamily: custom.font.fontFamilyPoppins,
      fontSize: custom.font.fontSizeM,
      button: {
        textTransform: 'none',
      },
    },
    palette: {
      ...props.palette,
    },
    shape: {
      borderRadius: 5,
    },
    components: {
      MuiButtonBase: {
        styleOverrides: {
          root: {
            outline: '0 !important',
            ':focus': {
              outline: '0 !important',
            },
            '&.Mui-focusVisible': {
              outline: `2px solid ${props.palette.primary.main} !important`,
              outlineOffset: 2,
            },
            textTransform: 'capitalize',
            fontWeight: 600,
          },
        },
      },
      MuiDialog: { ...props.MuiDialog },
      MuiChip: { ...props.MuiChip },
      MuiInputBase: { ...props.MuiInputBase },
      MuiInput: { ...props.MuiInput },
      MuiFilledInput: { ...props.MuiFilledInput },
      MuiOutlinedInput: { ...props.MuiOutlinedInput },
      MuiPaper: { ...props.MuiPaper },
      MuiInputLabel: { ...props.MuiInputLabel },
      MuiFormControl: {
        defaultProps: {
          margin: 'dense',
        },
      },
      MuiFormHelperText: {
        defaultProps: {
          margin: 'dense',
        },
      },
      MuiListItem: {
        defaultProps: {
          dense: true,
        },
      },
      MuiTextField: {
        defaultProps: {
          margin: 'dense',
          size: 'small',
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            marginTop: '8px',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            marginLeft: '4px',
            marginRight: '4px',
          },
          dense: {
            padding: '3px 16px',
            height: '26px',
            minHeight: '26px',
          },
        },
      },
      MuiToolbar: {
        defaultProps: {
          variant: 'dense',
        },
      },
      MuiToggleButton: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiButton: {
        defaultProps: {
          size: 'small',
        },
        styleOverrides: {
          root: {
            outline: '0 !important',
            ':focus': {
              outline: '0 !important',
            },
            '&.Mui-focusVisible': {
              outline: `2px solid ${props.palette.primary.main} !important`,
              outlineOffset: 2,
            },
            textTransform: 'capitalize',
            fontWeight: 600,
          },
        },
      },
      MuiIconButton: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiFab: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiTable: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiAlert: {
        styleOverrides: {
          message: {
            userSelect: 'text',
          },
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: {
            maxWidth: '62%',
          },
        },
      },
    },
  } as ThemeOptions;
};
