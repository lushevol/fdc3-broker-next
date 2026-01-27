import React from 'react';
import {
  ConfigProvider,
  Input as AntInput,
  InputProps as AntInputProps,
} from 'antd';

// ============================================================================
// Input Status Types
// ============================================================================

export type InputSize = 'small' | 'medium' | 'large';
export type InputStatus = 'default' | 'error' | 'alert' | 'success';

// ============================================================================
// Input Props
// ============================================================================

export interface InputProps extends AntInputProps {
  /**
   * Helper text displayed below the input
   */
  helperText?: React.ReactNode;

  /**
   * Whether to show the required asterisk
   * @default false
   */
  required?: boolean;

  /**
   * Label for the input field
   */
  label?: React.ReactNode;

  /**
   * Prefix text (read-only text before the input)
   */
  prefixText?: string;

  /**
   * Suffix text (read-only text after the input)
   */
  suffixText?: string;

  /**
   * Custom validation message (overrides default based on status)
   */
  validationMessage?: React.ReactNode;

  /**
   * Validation status for custom styling
   * @default "default"
   */
  validationStatus?: InputStatus;
}

// ============================================================================
// Design Tokens (from Figma SC GDS)
// ============================================================================

const tokens = {
  // Colors
  colorPrimary: '#0473ea',
  colorPrimaryHover: '#4f9df0',
  colorPrimaryActive: '#0250a3',
  colorText: '#333333',
  colorPlaceholder: '#666666',
  colorBackground: '#ffffff',
  colorBorder: '#cccccc',
  colorBorderHover: '#4f9df0',
  colorBorderActive: '#0250a3',
  colorError: '#ca0913',
  colorErrorHover: '#e63b44',
  colorAlert: '#faad14',
  colorAlertHover: '#fddea1',
  colorSuccess: '#207e00',
  colorSuccessHover: '#32bd00',
  colorDisabledBackground: '#e5e5e5',
  colorDisabledText: '#a6a6a6',

  // Typography
  fontFamily:
    "'SC Prosper Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  labelFontSize: '12px',
  labelFontWeight: 500,
  labelLineHeight: '16px',
  labelColor: '#4d4d4d',
  helperFontSize: '12px',
  helperFontWeight: 400,
  helperLineHeight: '16px',
  helperColor: '#595959',
  errorColor: '#ca0913',
  alertColor: '#7d570a',
  successColor: '#207e00',

  // Spacing
  paddingHorizontal: '12px',
  paddingVertical: '5px',
  labelMarginBottom: '4px',
  helperMarginTop: '4px',

  // Border
  borderRadius: '6px',
};

// ============================================================================
// Theme Configuration for Ant Design Input
// ============================================================================

const getInputThemeConfig = (inputStatus: InputStatus) => {
  const statusConfig = {
    error: {
      colorPrimary: tokens.colorError,
      colorErrorBg: '#fce6e7',
      colorErrorBorder: tokens.colorError,
      colorError: tokens.colorError,
    },
    alert: {
      colorPrimary: tokens.colorAlert,
      colorWarningBg: '#fef2db',
      colorWarningBorder: tokens.colorAlert,
      colorWarning: tokens.colorAlert,
    },
    success: {
      colorPrimary: tokens.colorSuccess,
      colorSuccessBg: '#ebfbe6',
      colorSuccessBorder: tokens.colorSuccess,
      colorSuccess: tokens.colorSuccess,
    },
    default: {
      colorPrimary: tokens.colorPrimary,
    },
  };

  return {
    token: {
      fontFamily: tokens.fontFamily,
      colorPrimary: tokens.colorPrimary,
      colorText: tokens.colorText,
      colorTextPlaceholder: tokens.colorPlaceholder,
      colorBgContainer: tokens.colorBackground,
      colorBorder: tokens.colorBorder,
      colorBorderHover: tokens.colorBorderHover,
      colorBorderActive: tokens.colorBorderActive,
      controlHeight: 32,
      controlPaddingHorizontal: parseInt(tokens.paddingHorizontal, 10),
      borderRadius: parseInt(tokens.borderRadius, 10),
    },
    components: {
      Input: {
        ...statusConfig[inputStatus],
        algorithm: true,
      },
    },
  };
};

// ============================================================================
// Size Mappings
// ============================================================================

const sizeMap = {
  small: 24,
  medium: 32,
  large: 40,
};

// ============================================================================
// Sub-components
// ============================================================================

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledLabel = styled.label`
  font-family: ${tokens.fontFamily};
  font-size: ${tokens.labelFontSize};
  font-weight: ${tokens.labelFontWeight};
  line-height: ${tokens.labelLineHeight};
  color: ${tokens.labelColor};
  margin-bottom: ${tokens.labelMarginBottom};
`;

const StyledHelperText = styled.div<{ $status: InputStatus }>`
  font-family: ${tokens.fontFamily};
  font-size: ${tokens.helperFontSize};
  font-weight: ${tokens.helperFontWeight};
  line-height: ${tokens.helperLineHeight};
  color: ${(props) => {
    switch (props.$status) {
      case 'error':
        return tokens.errorColor;
      case 'alert':
        return tokens.alertColor;
      case 'success':
        return tokens.successColor;
      default:
        return tokens.helperColor;
    }
  }};
  margin-top: ${tokens.helperMarginTop};
`;

const RequiredAsterisk = styled.span`
  color: ${tokens.colorError};
  margin-left: 2px;
`;

const PrefixText = styled.span`
  color: ${tokens.colorText};
  padding-left: ${tokens.paddingHorizontal};
`;

const SuffixText = styled.span`
  color: ${tokens.colorText};
  padding-right: ${tokens.paddingHorizontal};
`;

// ============================================================================
// Styled Components
// ============================================================================

import styled from '@emotion/styled';

// ============================================================================
// Input Component
// ============================================================================

/**
 * Input Component
 *
 * A text input component based on SC Global Design System (GDS) specifications,
 * built on top of Ant Design's Input component with custom theming.
 *
 * ## Features
 *
 * - **Validation States**: Error, Alert, Success, Default
 * - **Sizes**: Small, Medium, Large
 * - **Prefix/Suffix Text**: For input limitations like currency or email
 * - **Helper Text**: Additional context or instructions
 * - **Labels**: With optional required asterisk
 * - **Clear Button**: Built-in clear functionality
 * - **Icons**: Optional leading and trailing icons
 *
 * ## Usage
 *
 * ```tsx
 * import { Input } from "@ratan-design/core";
 *
 * // Basic input
 * <Input placeholder="Enter text" />
 *
 * // With label
 * <Input label="Email" placeholder="Enter your email" />
 *
 * // Required field
 * <Input label="Username" required placeholder="Enter username" />
 *
 * // With validation error
 * <Input
 *   label="Email"
 *   status="error"
 *   validationMessage="Email is required"
 *   placeholder="Enter email"
 * />
 *
 * // With prefix text
 * <Input
 *   label="Price"
 *   prefixText="$"
 *   placeholder="0.00"
 * />
 *
 * // With suffix text
 * <Input
 *   label="Email"
 *   suffixText="@email.com"
 *   placeholder="user"
 * />
 *
 * // With helper text
 * <Input
 *   label="Password"
 *   type="password"
 *   helperText="Must be at least 8 characters"
 *   placeholder="Enter password"
 * />
 *
 * // With icons
 * <Input
 *   prefix={<SearchIcon />}
 *   suffix={<ClearIcon />}
 *   placeholder="Search"
 * />
 * ```
 *
 * ## Design Guidelines
 *
 * - Labels should be clear, concise nouns or short phrases
 * - Start with capital letter, all sentence case
 * - Avoid articles (a, an, the) when possible
 * - Helper text should be 1 sentence maximum
 * - Validation messages should be solution-focused
 *
 * @see https://www.figma.com/design/QlWDegEER5VGZocSZXXS1b/SC-Global-Design-System--GDS--Components
 */
export const Input: React.FC<InputProps> = ({
  helperText,
  required = false,
  label,
  size,
  prefixText,
  suffixText,
  validationMessage,
  validationStatus = 'default',
  prefix,
  suffix,
  style,
  className,
  ...props
}) => {
  const themeConfig = getInputThemeConfig(validationStatus);
  const controlHeight = size ? sizeMap[size as InputSize] : 32;

  // Create prefix/suffix elements
  const prefixNode = prefixText ? (
    <PrefixText>{prefixText}</PrefixText>
  ) : prefix ? (
    prefix
  ) : null;

  const suffixNode = suffixText ? (
    <SuffixText>{suffixText}</SuffixText>
  ) : suffix ? (
    suffix
  ) : null;

  return (
    <ConfigProvider theme={themeConfig}>
      <InputContainer className={className} style={style}>
        {!!label && (
          <StyledLabel>
            <>{label}</>
            {required && <RequiredAsterisk>*</RequiredAsterisk>}
          </StyledLabel>
        )}

        <AntInput
          prefix={prefixNode}
          suffix={suffixNode}
          size={size}
          style={controlHeight ? { height: controlHeight } : undefined}
          {...props}
        />

        {!!validationMessage && (
          <StyledHelperText $status={validationStatus}>
            <>{validationMessage}</>
          </StyledHelperText>
        )}

        {!!helperText && !validationMessage && (
          <StyledHelperText $status="default">
            <>{helperText}</>
          </StyledHelperText>
        )}
      </InputContainer>
    </ConfigProvider>
  );
};

// ============================================================================
// Password Input
// ============================================================================

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  /**
   * Whether to show the password strength requirements
   * @default false
   */
  showStrengthRequirements?: boolean;
}

/**
 * Password Input Component
 *
 * A specialized input for password entry with visibility toggle and optional
 * strength requirement indicators.
 *
 * ## Usage
 *
 * ```tsx
 * import { PasswordInput } from "@ratan-design/core";
 *
 * <PasswordInput
 *   label="Password"
 *   required
 *   helperText="Must be at least 8 characters"
 *   showStrengthRequirements
 * />
 * ```
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  showStrengthRequirements = false,
  ...props
}) => {
  return (
    <Input
      type="password"
      suffix={
        showStrengthRequirements ? <PasswordStrengthIndicator /> : undefined
      }
      {...props}
    />
  );
};

// ============================================================================
// Password Strength Indicator (placeholder for expansion)
// ============================================================================

const PasswordStrengthIndicator: React.FC = () => {
  // This is a placeholder for password strength indicator
  // In a full implementation, this would show validation requirements
  return (
    <span
      style={{
        fontSize: '12px',
        color: tokens.colorPlaceholder,
      }}
    >
      {/* Password requirements indicator */}
    </span>
  );
};

// ============================================================================
// Search Input
// ============================================================================

export interface SearchInputProps extends Omit<InputProps, 'prefix'> {
  /**
   * Callback when search is submitted
   */
  onSearch?: (value: string) => void;
}

/**
 * Search Input Component
 *
 * A specialized input for search functionality with built-in search icon.
 *
 * ## Usage
 *
 * ```tsx
 * import { SearchInput } from "@ratan-design/core";
 *
 * <SearchInput
 *   placeholder="Search..."
 *   onSearch={(value) => console.log(value)}
 * />
 * ```
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  ...props
}) => {
  const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onSearch && props.value) {
      onSearch(props.value.toString());
    }
    props.onPressEnter?.(e);
  };

  return (
    <Input prefix={<SearchIcon />} onPressEnter={handlePressEnter} {...props} />
  );
};

// ============================================================================
// Search Icon
// ============================================================================

const SearchIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.5 0C10.09 0 13 2.91 13 6.5C13 8.03 12.36 9.38 11.34 10.4L15.71 14.77C16.1 15.16 16.1 15.83 15.71 16.22C15.32 16.61 14.69 16.61 14.3 16.22L9.93 11.85C8.91 12.87 7.56 13.5 6 13.5C2.41 13.5 0 11.09 0 7.5C0 3.91 2.41 1.5 6 1.5C9.59 1.5 12 3.91 12 7.5C12 8.03 12.03 8.55 12.09 9.06L12.18 9.73L11.45 9.41C11.05 9.2 10.58 9.1 10.09 9.1C7.88 9.1 6 10.98 6 13.19C6 15.4 7.88 17.28 10.09 17.28C12.3 17.28 14.18 15.4 14.18 13.19C14.18 11.57 13.33 10.17 12.09 9.35C12.35 8.65 12.5 7.85 12.5 7C12.5 3.41 10.09 1 6.5 1V0Z" />
  </svg>
);

export default Input;
