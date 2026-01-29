import React from 'react';
import {
  ConfigProvider,
  Input as AntInput,
  InputProps as AntInputProps,
  type ThemeConfig,
} from 'antd';

// ============================================================================
// Design Tokens Import
// ============================================================================

import {
  primitiveColors,
  foundationColors,
  colorTokens,
} from './tokens/colors';
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  typographyStyles,
} from './tokens/typography';
import {
  componentSizes,
  componentSpacing,
  componentRound,
} from './tokens/sizes';
import { lightTheme } from './tokens/themes/light';

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
// Theme Configuration for Ant Design Input
// ============================================================================

const getInputThemeConfig = (inputStatus: InputStatus): ThemeConfig => {
  const statusConfig = {
    error: {
      colorPrimary: primitiveColors.red[550],
      colorErrorBg: primitiveColors.red[50],
      colorErrorBorder: primitiveColors.red[550],
      colorError: primitiveColors.red[550],
    },
    alert: {
      colorPrimary: primitiveColors.amber[500],
      colorWarningBg: primitiveColors.amber[50],
      colorWarningBorder: primitiveColors.amber[500],
      colorWarning: primitiveColors.amber[500],
    },
    success: {
      colorPrimary: primitiveColors.green[500],
      colorSuccessBg: primitiveColors.green[50],
      colorSuccessBorder: primitiveColors.green[500],
      colorSuccess: primitiveColors.green[500],
    },
    default: {
      colorPrimary: lightTheme.colors.brand.blue,
    },
  };

  return {
    token: {
      fontFamily: fontFamily.primary,
      colorPrimary: lightTheme.colors.brand.blue,
      colorText: primitiveColors.grey[800],
      colorTextPlaceholder: lightTheme.colors.text.placeholder,
      colorBgContainer: lightTheme.colors.background.primary,
      colorBorder: primitiveColors.grey[200],
      controlHeight: componentSizes['32px'],
      controlPaddingHorizontal: componentSpacing['12px'],
      borderRadius: componentRound['round-theme'],
    },
    components: {
      Input: {
        ...statusConfig[inputStatus],
        // Custom hover/active border colors for Input component
        colorBorderHover: primitiveColors.blue[350],
        colorBorderActive: primitiveColors.blue[650],
        algorithm: true,
      },
    },
  } as unknown as ThemeConfig;
};

// ============================================================================
// Size Mappings
// ============================================================================

const sizeMap = {
  small: componentSizes['24px'],
  medium: componentSizes['32px'],
  large: componentSizes['40px'],
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
  font-family: ${fontFamily.primary};
  font-size: ${fontSize.helper}px;
  font-weight: ${fontWeight.medium};
  line-height: ${lineHeight.helper}px;
  color: ${primitiveColors.grey[700]};
  margin-bottom: ${componentSpacing['4px']}px;
`;

const StyledHelperText = styled.div<{ $status: InputStatus }>`
  font-family: ${fontFamily.primary};
  font-size: ${fontSize.helper}px;
  font-weight: ${fontWeight.regular};
  line-height: ${lineHeight.helper}px;
  color: ${(props) => {
    switch (props.$status) {
      case 'error':
        return primitiveColors.red[550];
      case 'alert':
        return primitiveColors.amber[700];
      case 'success':
        return primitiveColors.green[700];
      default:
        return lightTheme.colors.text.helper;
    }
  }};
  margin-top: ${componentSpacing['4px']}px;
`;

const RequiredAsterisk = styled.span`
  color: ${primitiveColors.red[550]};
  margin-left: ${componentSizes['2px']}px;
`;

const PrefixText = styled.span`
  color: ${primitiveColors.grey[800]};
  padding-left: ${componentSpacing['12px']}px;
`;

const SuffixText = styled.span`
  color: ${primitiveColors.grey[800]};
  padding-right: ${componentSpacing['12px']}px;
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
        fontSize: fontSize.helper,
        color: lightTheme.colors.text.placeholder,
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
