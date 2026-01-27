/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import styled from '@emotion/styled';

// ============================================================================
// Button Variant Types
// ============================================================================

export type ButtonType =
  | 'primary'
  | 'secondary'
  | 'floating'
  | 'link'
  | 'link-contrast'
  | 'text';

export type ButtonStatus = 'neutral' | 'error' | 'alert' | 'success';

export type ButtonStyle = 'text' | 'icon-only';

export type ButtonState =
  | 'default'
  | 'hover'
  | 'pressed'
  | 'selected'
  | 'disabled';

// ============================================================================
// Button Props
// ============================================================================

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  /**
   * The button type/variant
   * @default "primary"
   */
  type?: ButtonType;

  /**
   * The button status color
   * @default "neutral"
   */
  status?: ButtonStatus;

  /**
   * The button style variant
   * @default "text"
   */
  styleVariant?: ButtonStyle;

  /**
   * Icon to display before the button text
   */
  iconLeading?: React.ReactElement;

  /**
   * Icon to display after the button text
   */
  iconTrailing?: React.ReactElement;

  /**
   * Whether the button is in loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Whether the button is selected (toggle state)
   * @default false
   */
  selected?: boolean;

  /**
   * Whether the button should take full width
   * @default false
   */
  fullWidth?: boolean;
}

// ============================================================================
// Design Tokens (from Figma SC GDS)
// ============================================================================

const tokens = {
  // Typography
  fontFamily:
    "'SC Prosper Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '16px',

  // Spacing
  paddingVertical: '8px',
  paddingHorizontal: '16px',
  iconGap: '8px',

  // Sizing
  minHeight: '32px',
  minWidth: '32px',
  iconSize: '16px',

  // Border
  borderRadius: '32px',
  borderRadiusPill: '32px',
  borderRadiusSmall: '6px',

  // Colors - Primary
  colorPrimaryBg: '#0473ea',
  colorPrimaryBgHover: '#035cbb',
  colorPrimaryBgPressed: '#02458c',
  colorPrimaryText: '#ffffff',
  colorPrimaryBorder: '#0473ea',

  // Colors - Secondary
  colorSecondaryBg: '#f2f2f2',
  colorSecondaryBgHover: '#e5e5e5',
  colorSecondaryBgPressed: '#cccccc',
  colorSecondaryText: '#333333',
  colorSecondaryBorder: '#bfbfbf',

  // Colors - Link
  colorLinkText: '#0473ea',
  colorLinkTextHover: '#035cbb',
  colorLinkTextPressed: '#02458c',
  colorLinkContrastText: '#ffffff',

  // Colors - Floating (FAB)
  colorFloatingBg: '#0473ea',
  colorFloatingBgHover: '#035cbb',
  colorFloatingText: '#ffffff',

  // Colors - Error
  colorErrorBg: '#e00a15',
  colorErrorBgHover: '#ca0913',
  colorErrorBgPressed: '#b30811',
  colorErrorText: '#ffffff',
  colorErrorBorder: '#e00a15',

  // Colors - Alert
  colorAlertBg: '#faad14',
  colorAlertBgHover: '#e19c12',
  colorAlertBgPressed: '#c88a10',
  colorAlertText: '#333333',
  colorAlertBorder: '#faad14',

  // Colors - Success
  colorSuccessBg: '#38d200',
  colorSuccessBgHover: '#32bd00',
  colorSuccessBgPressed: '#2ca800',
  colorSuccessText: '#ffffff',
  colorSuccessBorder: '#38d200',

  // Colors - Text button
  colorTextBg: 'transparent',
  colorTextBgHover: '#f2f2f2',
  colorTextBgPressed: '#e5e5e5',
  colorTextText: '#333333',
  colorTextBorder: 'transparent',

  // Colors - Disabled
  colorDisabledBg: '#bfbfbf',
  colorDisabledBgSecondary: '#f2f2f2',
  colorDisabledText: '#999999',
  colorDisabledBorder: '#bfbfbf',

  // Focus ring
  focusRingColor: 'rgba(255, 255, 255, 0)',
  focusRingOffset: '2px',

  // Elevation/Shadow
  shadowBase: '0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
  shadowElevated:
    '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
};

// ============================================================================
// Helper Functions
// ============================================================================

interface ButtonColorScheme {
  bg: string;
  bgHover: string;
  bgPressed: string;
  text: string;
  border: string;
}

const getStatusColors = (
  type: ButtonType,
  status: ButtonStatus,
): ButtonColorScheme => {
  // Base colors by type
  const typeColors: Record<ButtonType, ButtonColorScheme> = {
    primary: {
      bg: tokens.colorPrimaryBg,
      bgHover: tokens.colorPrimaryBgHover,
      bgPressed: tokens.colorPrimaryBgPressed,
      text: tokens.colorPrimaryText,
      border: tokens.colorPrimaryBorder,
    },
    secondary: {
      bg: tokens.colorSecondaryBg,
      bgHover: tokens.colorSecondaryBgHover,
      bgPressed: tokens.colorSecondaryBgPressed,
      text: tokens.colorSecondaryText,
      border: tokens.colorSecondaryBorder,
    },
    floating: {
      bg: tokens.colorFloatingBg,
      bgHover: tokens.colorFloatingBgHover,
      bgPressed: tokens.colorFloatingBg,
      text: tokens.colorFloatingText,
      border: tokens.colorFloatingBg,
    },
    link: {
      bg: 'transparent',
      bgHover: 'transparent',
      bgPressed: 'transparent',
      text: tokens.colorLinkText,
      border: 'transparent',
    },
    'link-contrast': {
      bg: 'transparent',
      bgHover: 'transparent',
      bgPressed: 'transparent',
      text: tokens.colorLinkContrastText,
      border: 'transparent',
    },
    text: {
      bg: tokens.colorTextBg,
      bgHover: tokens.colorTextBgHover,
      bgPressed: tokens.colorTextBgPressed,
      text: tokens.colorTextText,
      border: tokens.colorTextBorder,
    },
  };

  const base = typeColors[type];

  // Status overrides for error, alert, success
  const statusOverrides: Record<ButtonStatus, Partial<ButtonColorScheme>> = {
    neutral: {},
    error: {
      bg: tokens.colorErrorBg,
      bgHover: tokens.colorErrorBgHover,
      bgPressed: tokens.colorErrorBgPressed,
      text: tokens.colorErrorText,
      border: tokens.colorErrorBorder,
    },
    alert: {
      bg: tokens.colorAlertBg,
      bgHover: tokens.colorAlertBgHover,
      bgPressed: tokens.colorAlertBgPressed,
      text: tokens.colorAlertText,
      border: tokens.colorAlertBorder,
    },
    success: {
      bg: tokens.colorSuccessBg,
      bgHover: tokens.colorSuccessBgHover,
      bgPressed: tokens.colorSuccessBgPressed,
      text: tokens.colorSuccessText,
      border: tokens.colorSuccessBorder,
    },
  };

  const override = statusOverrides[status];
  return {
    bg: override.bg ?? base.bg,
    bgHover: override.bgHover ?? base.bgHover,
    bgPressed: override.bgPressed ?? base.bgPressed,
    text: override.text ?? base.text,
    border: override.border ?? base.border,
  };
};

// ============================================================================
// Styled Components
// ============================================================================

const buttonBaseStyles = css`
  font-family: ${tokens.fontFamily};
  font-size: ${tokens.fontSize};
  font-weight: ${tokens.fontWeight};
  line-height: ${tokens.lineHeight};
  min-height: ${tokens.minHeight};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.iconGap};
  padding: ${tokens.paddingVertical} ${tokens.paddingHorizontal};
  border: 1px solid transparent;
  border-radius: ${tokens.borderRadius};
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  text-decoration: none;
  box-sizing: border-box;

  &:focus-visible {
    outline: 2px solid ${tokens.focusRingColor};
    outline-offset: ${tokens.focusRingOffset};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const getButtonStyles = ({
  type,
  status,
  styleVariant,
  fullWidth,
  selected,
}: {
  type: ButtonType;
  status: ButtonStatus;
  styleVariant: ButtonStyle;
  fullWidth: boolean;
  selected: boolean;
}) => {
  const colors = getStatusColors(type, status);

  // Icon-only styles
  if (styleVariant === 'icon-only') {
    return css`
      ${buttonBaseStyles};
      padding: 8px;
      min-width: ${tokens.minWidth};
      min-height: ${tokens.minWidth};
      border-radius: ${tokens.borderRadiusPill};
      width: ${fullWidth ? '100%' : 'auto'};

      background-color: ${colors.bg};
      color: ${colors.text};
      border-color: ${colors.border};

      &:hover:not(:disabled) {
        background-color: ${colors.bgHover};
      }

      &:active:not(:disabled) {
        background-color: ${colors.bgPressed};
      }

      ${selected &&
      css`
        background-color: ${colors.bgPressed};
      `}

      &:disabled {
        background-color: ${type === 'secondary' || type === 'text'
          ? tokens.colorDisabledBgSecondary
          : tokens.colorDisabledBg};
        color: ${tokens.colorDisabledText};
        border-color: ${tokens.colorDisabledBorder};
      }
    `;
  }

  // Standard text styles
  return css`
    ${buttonBaseStyles};
    width: ${fullWidth ? '100%' : 'auto'};

    background-color: ${colors.bg};
    color: ${colors.text};
    border-color: ${colors.border};

    &:hover:not(:disabled) {
      background-color: ${colors.bgHover};
    }

    &:active:not(:disabled) {
      background-color: ${colors.bgPressed};
    }

    ${selected &&
    css`
      background-color: ${colors.bgPressed};
    `}

    &:disabled {
      background-color: ${type === 'secondary' || type === 'text'
        ? tokens.colorDisabledBgSecondary
        : tokens.colorDisabledBg};
      color: ${tokens.colorDisabledText};
      border-color: ${tokens.colorDisabledBorder};
    }
  `;
};

// ============================================================================
// StyledButton Component
// ============================================================================

const StyledButton = styled.button<{
  $type: ButtonType;
  $status: ButtonStatus;
  $styleVariant: ButtonStyle;
  $fullWidth: boolean;
  $selected: boolean;
}>`
  ${(props) =>
    getButtonStyles({
      type: props.$type,
      status: props.$status,
      styleVariant: props.$styleVariant,
      fullWidth: props.$fullWidth,
      selected: props.$selected,
    })}
`;

// ============================================================================
// Loading Spinner
// ============================================================================

const Spinner = styled.div`
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
`;

// ============================================================================
// Button Component
// ============================================================================

/**
 * Button Component
 *
 * A versatile button component that supports multiple variants, styles, and states
 * based on the SC Global Design System (GDS) specifications.
 *
 * ## Features
 *
 * - **Types**: Primary, Secondary, Floating (FAB), Link, Link - Contrast, Text
 * - **Styles**: Text (default), Icon only
 * - **Status**: Neutral, Error, Alert, Success
 * - **States**: Default, Hover, Pressed/Loading, Selected, Disabled
 * - **Icons**: Optional leading and trailing icons
 * - **Full Width**: Optional full-width button
 *
 * ## Usage
 *
 * ```tsx
 * import { Button } from "@ratan-design/core";
 *
 * // Primary button
 * <Button>Click me</Button>
 *
 * // With icon
 * <Button iconLeading={<SearchIcon />}>Search</Button>
 *
 * // Loading state
 * <Button loading>Saving...</Button>
 *
 * // Secondary button
 * <Button type="secondary">Cancel</Button>
 *
 * // Icon-only button
 * <Button
 *   styleVariant="icon-only"
 *   iconLeading={<CloseIcon />}
 *   aria-label="Close"
 * />
 *
 * // Error status
 * <Button status="error">Delete</Button>
 *
 * // Full width
 * <Button fullWidth>Submit</Button>
 * ```
 *
 * ## Accessibility
 *
 * - Buttons are accessible with proper ARIA attributes
 * - Focus states are clearly visible
 * - Disabled state properly disables interaction
 * - Icon-only buttons require aria-label
 *
 * @see https://www.figma.com/design/QlWDegEER5VGZocSZXXS1b/SC-Global-Design-System--GDS--Components
 */
export const Button: React.FC<ButtonProps> = ({
  type = 'primary',
  status = 'neutral',
  styleVariant = 'text',
  children,
  iconLeading,
  iconTrailing,
  loading = false,
  selected = false,
  fullWidth = false,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <StyledButton
      $type={type}
      $status={status}
      $styleVariant={styleVariant}
      $fullWidth={fullWidth}
      $selected={selected}
      disabled={isDisabled}
      aria-busy={loading}
      aria-selected={selected}
      {...props}
    >
      {loading && <Spinner aria-hidden="true" />}
      {iconLeading}
      {children != null && children !== false && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {children}
        </span>
      )}
      {iconTrailing}
    </StyledButton>
  );
};

export default Button;
