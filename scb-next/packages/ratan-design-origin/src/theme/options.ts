import type { PaletteMode, ThemeOptions } from '@mui/material';
import { legacyTokens as custom } from '../tokens/legacy.js';
import { webkitMuiTheme } from '../tokens/webkit-theme.generated.js';
import { compactControlTokens as compact } from '../tokens/compact.js';
import type { ControlThemeConfig, DesignGeneration } from './index.js';

const getWebkitOptions = (props: ControlThemeConfig): ThemeOptions => {
  const mode = props.palette.mode as PaletteMode;
  const palette = webkitMuiTheme.palette[mode];
  return {
    typography: {
      fontFamily: compact.typography.fontFamily,
      fontSize: webkitMuiTheme.typography.fontSize.value,
      body1: {
        fontFamily: compact.typography.fontFamily,
        fontSize: `${compact.typography.body}px`,
        lineHeight: 1.5,
      },
      body2: {
        fontFamily: compact.typography.fontFamily,
        fontSize: `${compact.typography.compact}px`,
        lineHeight: 1.5,
      },
      subtitle1: {
        fontFamily: compact.typography.fontFamily,
        fontSize: `${compact.typography.body}px`,
        lineHeight: 1.5,
      },
      subtitle2: {
        fontFamily: compact.typography.fontFamily,
        fontSize: `${compact.typography.compact}px`,
        lineHeight: 1.5,
      },
      caption: {
        fontFamily: compact.typography.fontFamily,
        fontSize: `${compact.typography.compact}px`,
        lineHeight: 1.5,
      },
      button: {
        fontFamily: compact.typography.fontFamily,
        fontSize: `${compact.typography.compact}px`,
        textTransform: 'none',
      },
    },
    palette: {
      mode,
      primary: { main: palette.primary.value },
      secondary: { main: palette.secondary.value },
      error: { main: palette.error.value },
      warning: { main: palette.warning.value },
      success: { main: palette.success.value },
      background: {
        default: palette.backgroundDefault.value,
        paper: palette.backgroundPaper.value,
      },
      text: {
        primary: palette.textPrimary.value,
        secondary: palette.textSecondary.value,
      },
    },
    shape: { borderRadius: webkitMuiTheme.shape.borderRadius.value },
    components: {
      MuiButtonBase: {
        styleOverrides: {
          root: {
            '&.Mui-focusVisible': {
              outline: '2px solid var(--sc-focus-ring-color)',
              outlineOffset: 2,
            },
          },
        },
      },
      MuiButton: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          root: {
            borderRadius: 'var(--sc-button-rounded-border-radius, 0.375rem)',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'var(--sc-button-hover-shadow, 0 1px 3px 1px rgb(26 26 26 / 15%))',
            },
          },
          sizeSmall: {
            fontSize: compact.control.small.fontSize,
            minHeight: compact.control.small.minHeight,
            padding: `${compact.control.small.paddingBlock}px ${compact.control.small.paddingInline}px`,
            lineHeight: compact.control.small.lineHeight,
          },
          sizeMedium: {
            fontSize: compact.control.medium.fontSize,
            minHeight: compact.control.medium.minHeight,
            padding: `${compact.control.medium.paddingBlock}px ${compact.control.medium.paddingInline}px`,
            lineHeight: compact.control.medium.lineHeight,
          },
          sizeLarge: {
            fontSize: compact.control.large.fontSize,
            minHeight: compact.control.large.minHeight,
            padding: `${compact.control.large.paddingBlock}px ${compact.control.large.paddingInline}px`,
            lineHeight: compact.control.large.lineHeight,
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
            fontSize: compact.input.medium.fontSize,
            lineHeight: `${compact.input.medium.lineHeight}px`,
            '&::placeholder': {
              color: 'var(--sc-label-color)',
              opacity: 1,
            },
          },
          inputSizeSmall: {
            fontSize: compact.input.small.fontSize,
            lineHeight: `${compact.input.small.lineHeight}px`,
          },
        },
      },
      MuiOutlinedInput: {
        defaultProps: { margin: 'dense' },
        styleOverrides: {
          root: {
            minHeight: compact.control.medium.minHeight,
            '&.MuiInputBase-sizeSmall': {
              minHeight: compact.control.small.minHeight,
              '& .MuiOutlinedInput-input': {
                fontSize: compact.input.small.fontSize,
                lineHeight: `${compact.input.small.lineHeight}px`,
                padding: `${compact.input.small.paddingBlock}px ${compact.input.small.paddingInline}px`,
              },
            },
            color: 'var(--sc-form-control-color)',
            backgroundColor: 'var(--sc-form-control-background-color)',
            borderRadius: 'var(--sc-form-input-border-radius, 0.375rem)',
            '&& input::placeholder': {
              color: 'var(--sc-label-color)',
              opacity: 1,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--sc-form-control-border-color)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--sc-form-input-hover-border-color, var(--sc-color-blue-450))',
            },
            '&.Mui-focused': {
              outline: '2px solid var(--sc-focus-ring-color)',
              outlineOffset: 1,
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
          input: {
            padding: `${compact.input.medium.paddingBlock}px ${compact.input.medium.paddingInline}px`,
          },
        },
      },
      MuiTextField: {
        defaultProps: { margin: 'dense', size: 'small' },
      },
      MuiFormControl: {
        defaultProps: { margin: 'dense', size: 'small' },
        styleOverrides: {
          root: ({ ownerState }) => ({
            fontSize:
              ownerState.size === 'small' ? compact.typography.compact : compact.typography.body,
          }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: 'var(--sc-label-color)',
            fontSize: compact.typography.compact,
            fontWeight: 500,
            lineHeight: '1.25rem',
          },
        },
      },
      MuiFormHelperText: {
        defaultProps: { margin: 'dense' },
        styleOverrides: { root: { fontSize: compact.typography.compact } },
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
