/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import styled from '@emotion/styled';

// ============================================================================
// Card Variant Types
// ============================================================================

export type CardVariant = 'base' | 'clickable' | 'selected';

export type CardPadding = 'none' | 'small' | 'medium' | 'large';

export type CardImagePosition = 'top' | 'left' | 'background';

export type CardSelectionType = 'none' | 'checkbox' | 'radio';

export type CardTrailingContent =
  | 'none'
  | 'chevron'
  | 'switch'
  | 'more-menu'
  | 'buttons'
  | 'hint-text';

// ============================================================================
// Card Props
// ============================================================================

export interface CardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  /**
   * The card variant
   * @default "base"
   */
  variant?: CardVariant;

  /**
   * The card padding size
   * @default "medium"
   */
  padding?: CardPadding;

  /**
   * Optional image configuration
   */
  image?: {
    src: string;
    alt: string;
    position?: CardImagePosition;
    height?: string;
  };

  /**
   * Optional leading content (icon or avatar)
   */
  leading?: React.ReactNode;

  /**
   * Card title (label)
   */
  title?: React.ReactNode;

  /**
   * Optional eyebrow text (category label above title)
   */
  eyebrow?: React.ReactNode;

  /**
   * Helper text (description below title)
   */
  helperText?: React.ReactNode;

  /**
   * Additional details (e.g., date, timestamp, duration)
   */
  additionalDetails?: React.ReactNode;

  /**
   * Tags for status indicators or keywords
   */
  tags?: Array<{
    label: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  }>;

  /**
   * Trailing content type
   * @default "none"
   */
  trailingContent?: CardTrailingContent;

  /**
   * Hint text (1-2 words for additional context in trailing section)
   */
  hintText?: string;

  /**
   * Selection type for actionable cards
   * @default "none"
   */
  selectionType?: CardSelectionType;

  /**
   * Whether the card is selected (for checkbox/radio)
   * @default false
   */
  selected?: boolean;

  /**
   * Callback for selection change
   */
  onSelectionChange?: (selected: boolean) => void;

  /**
   * Footer actions
   */
  footerActions?: React.ReactNode;

  /**
   * Whether the card is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Click handler (makes card clickable)
   */
  onClick?: () => void;

  /**
   * Whether the card is draggable
   * @default false
   */
  draggable?: boolean;
}

// ============================================================================
// Design Tokens (from Figma SC GDS)
// ============================================================================

const tokens = {
  // Typography
  fontFamily:
    "'SC Prosper Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

  // Title/Sub-Medium
  titleFontSize: '16px',
  titleFontWeight: 500,
  titleLineHeight: '24px',
  titleColor: '#333333',

  // Description/Main-Regular
  helperFontSize: '12px',
  helperFontWeight: 400,
  helperLineHeight: '16px',
  helperColor: '#595959',

  // Eyebrow text
  eyebrowFontSize: '12px',
  eyebrowFontWeight: 500,
  eyebrowLineHeight: '16px',
  eyebrowColor: '#666666',

  // Additional details
  detailsFontSize: '12px',
  detailsFontWeight: 400,
  detailsLineHeight: '16px',
  detailsColor: '#808080',

  // Hint text
  hintFontSize: '12px',
  hintFontWeight: 400,
  hintLineHeight: '16px',
  hintColor: '#999999',

  // Spacing
  paddingSmall: '8px',
  paddingMedium: '12px',
  paddingLarge: '16px',
  gapSmall: '4px',
  gapMedium: '8px',
  gapLarge: '12px',

  // Border
  borderRadius: '6px',

  // Elevation/Shadow (Elevation 3: Medium)
  shadowBase: '0px 1px 2px 0px rgba(26, 26, 26, 0.3)',
  shadowElevated:
    '0px 4px 8px 3px rgba(26, 26, 26, 0.15), 0px 1px 2px 0px rgba(26, 26, 26, 0.3)',

  // Colors
  colorBackground: '#ffffff',
  colorBorder: '#ececec',
  colorBorderSelected: '#0473ea',
  colorFocusRing: 'rgba(255, 255, 255, 0)',
  colorDisabledBackground: '#f9f9f9',
  colorDisabledContent: '#bfbfbf',

  // Tag colors
  tagBackground: '#f2f2f2',
  tagText: '#333333',
};

// ============================================================================
// Helper Functions
// ============================================================================

const getPaddingStyles = (padding: CardPadding) => {
  const paddingMap: Record<CardPadding, string> = {
    none: '0',
    small: tokens.paddingSmall,
    medium: tokens.paddingMedium,
    large: tokens.paddingLarge,
  };
  return paddingMap[padding];
};

const getTagColors = (variant?: string) => {
  const variantMap: Record<string, { bg: string; text: string }> = {
    default: { bg: tokens.tagBackground, text: tokens.tagText },
    success: { bg: '#ebfbe6', text: '#207e00' },
    warning: { bg: '#fef2db', text: '#96680c' },
    error: { bg: '#fce6e7', text: '#86060d' },
    info: { bg: '#e5f1fc', text: '#02458c' },
  };
  return variantMap[variant || 'default'];
};

// ============================================================================
// Styled Components
// ============================================================================

const cardBaseStyles = css`
  font-family: ${tokens.fontFamily};
  background-color: ${tokens.colorBackground};
  border-radius: ${tokens.borderRadius};
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  position: relative;
  overflow: hidden;

  &:focus-visible {
    outline: 2px solid ${tokens.colorFocusRing};
    outline-offset: 2px;
  }
`;

const getCardStyles = ({
  variant,
  disabled,
}: {
  variant: CardVariant;
  disabled: boolean;
}) => {
  if (disabled) {
    return css`
      ${cardBaseStyles};
      background-color: ${tokens.colorDisabledBackground};
      cursor: not-allowed;
      box-shadow: none;
    `;
  }

  const baseStyles = css`
    ${cardBaseStyles};
    box-shadow: ${tokens.shadowBase};
  `;

  if (variant === 'clickable') {
    return css`
      ${baseStyles};
      box-shadow: ${tokens.shadowElevated};

      &:hover {
        box-shadow: ${tokens.shadowElevated};
        transform: translateY(-1px);
      }

      &:active {
        box-shadow: ${tokens.shadowBase};
        transform: translateY(0);
      }
    `;
  }

  if (variant === 'selected') {
    return css`
      ${baseStyles};
      border: 2px solid ${tokens.colorBorderSelected};
      box-shadow: ${tokens.shadowElevated};
    `;
  }

  return baseStyles;
};

const StyledCard = styled.div<{
  $variant: CardVariant;
  $disabled: boolean;
}>`
  ${(props) =>
    getCardStyles({
      variant: props.$variant,
      disabled: props.$disabled,
    })}
`;

const CardImage = styled.div<{ height?: string }>`
  width: 100%;
  height: ${(props) => props.height || '140px'};
  border-top-left-radius: ${tokens.borderRadius};
  border-top-right-radius: ${tokens.borderRadius};
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardContent = styled.div<{ padding: CardPadding }>`
  padding: ${(props) => getPaddingStyles(props.padding)};
  display: flex;
  flex-direction: column;
  gap: ${tokens.gapMedium};
  flex: 1;
  min-width: 0;
`;

const CardTopContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${tokens.gapMedium};
`;

const CardLeadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CardMainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.gapSmall};
  min-width: 0;
  flex: 1;
`;

const CardEyebrow = styled.div`
  font-size: ${tokens.eyebrowFontSize};
  font-weight: ${tokens.eyebrowFontWeight};
  line-height: ${tokens.eyebrowLineHeight};
  color: ${tokens.eyebrowColor};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardTitle = styled.div`
  font-size: ${tokens.titleFontSize};
  font-weight: ${tokens.titleFontWeight};
  line-height: ${tokens.titleLineHeight};
  color: ${tokens.titleColor};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CardHelperText = styled.div`
  font-size: ${tokens.helperFontSize};
  font-weight: ${tokens.helperFontWeight};
  line-height: ${tokens.helperLineHeight};
  color: ${tokens.helperColor};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const CardAdditionalDetails = styled.div`
  font-size: ${tokens.detailsFontSize};
  font-weight: ${tokens.detailsFontWeight};
  line-height: ${tokens.detailsLineHeight};
  color: ${tokens.detailsColor};
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.gapSmall};
`;

const CardTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.gapSmall};
  align-items: center;
`;

const CardTag = styled.span<{ variant?: string }>`
  ${(props) => {
    const colors = getTagColors(props.variant);
    return css`
      background-color: ${colors.bg};
      color: ${colors.text};
    `;
  }}
  font-size: ${tokens.helperFontSize};
  font-weight: 500;
  line-height: ${tokens.helperLineHeight};
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const CardHintText = styled.div`
  font-size: ${tokens.hintFontSize};
  font-weight: ${tokens.hintFontWeight};
  line-height: ${tokens.hintLineHeight};
  color: ${tokens.hintColor};
  white-space: nowrap;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${tokens.gapSmall};
  padding-top: ${tokens.gapMedium};
  border-top: 1px solid ${tokens.colorBorder};
  margin-top: ${tokens.gapMedium};
`;

const SelectionContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${tokens.gapMedium};
`;

// ============================================================================
// Icon Components
// ============================================================================

const ChevronRightIcon = () => (
  <svg
    data-testid="chevron-icon"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 1C6 0.447715 6.44772 0 7 0C7.55228 0 8 0.447715 8 1V11H13.5C14.0523 11 14.5 11.4477 14.5 12C14.5 12.5523 14.0523 13 13.5 13H8C7.44772 13 7 12.5523 7 12V1H6Z" />
  </svg>
);

const MoreMenuIcon = () => (
  <svg
    data-testid="more-menu-icon"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="3" r="1.5" />
    <circle cx="8" cy="8" r="1.5" />
    <circle cx="8" cy="13" r="1.5" />
  </svg>
);

// ============================================================================
// Card Component
// ============================================================================

/**
 * Card Component
 *
 * A versatile card component that supports multiple variants, styles, and content
 * based on the SC Global Design System (GDS) specifications.
 *
 * ## Features
 *
 * - **Variants**: Base, Clickable, Selected
 * - **Content**: Image, Leading (icon/avatar), Title, Eyebrow, Helper text, Tags
 * - **Trailing Content**: Chevron, Switch, More menu, Buttons, Hint text
 * - **Selection**: Checkbox, Radio, None
 * - **Footer Actions**: Optional footer with actions
 * - **States**: Default, Hover, Pressed, Selected, Disabled
 * - **Draggable**: Optional drag handle
 *
 * ## Usage
 *
 * ```tsx
 * import { Card } from "@ratan-design/core";
 *
 * // Basic card
 * <Card title="Card Title" helperText="Description text" />
 *
 * // With image
 * <Card
 *   image={{ src: "image.jpg", alt: "Description" }}
 *   title="Card Title"
 *   helperText="Description text"
 * />
 *
 * // Clickable card with trailing chevron
 * <Card
 *   title="Clickable Card"
 *   trailingContent="chevron"
 *   onClick={() => handleClick()}
 *   variant="clickable"
 * />
 *
 * // With tags
 * <Card
 *   title="Card with Tags"
 *   tags={[
 *     { label: "Active", variant: "success" },
 *     { label: "New", variant: "default" }
 *   ]}
 * />
 *
 * // Selectable card with checkbox
 * <Card
 *   title="Selectable Card"
 *   selectionType="checkbox"
 *   selected={isSelected}
 *   onSelectionChange={setIsSelected}
 * />
 * ```
 *
 * ## UX Guidelines
 *
 * - Keep helper text to up to 3 lines
 * - Keep eyebrow text to 1-3 words
 * - Tag row will always be a single line
 * - Front-load important information in helper text
 *
 * @see https://www.figma.com/design/QlWDegEER5VGZocSZXXS1b/SC-Global-Design-System--GDS--Components
 */
export const Card: React.FC<CardProps> = ({
  variant = 'base',
  padding = 'medium',
  image,
  leading,
  title,
  eyebrow,
  helperText,
  additionalDetails,
  tags,
  trailingContent = 'none',
  hintText,
  selectionType = 'none',
  selected = false,
  onSelectionChange,
  footerActions,
  disabled = false,
  onClick,
  draggable = false,
  ...props
}) => {
  const isInteractive =
    onClick || variant === 'clickable' || variant === 'selected';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const handleSelectionChange = () => {
    if (disabled || selectionType === 'none') return;
    if (onSelectionChange) {
      onSelectionChange(!selected);
    }
  };

  const renderTrailingContent = () => {
    switch (trailingContent) {
      case 'chevron':
        return <ChevronRightIcon />;
      case 'more-menu':
        return <MoreMenuIcon />;
      case 'hint-text':
        return hintText ? <CardHintText>{hintText}</CardHintText> : null;
      default:
        return null;
    }
  };

  const renderSelectionIndicator = () => {
    if (selectionType === 'checkbox') {
      return (
        <input
          type="checkbox"
          checked={selected}
          onChange={handleSelectionChange}
          disabled={disabled}
          aria-label="Select card"
        />
      );
    }
    if (selectionType === 'radio') {
      return (
        <input
          type="radio"
          checked={selected}
          onChange={handleSelectionChange}
          disabled={disabled}
          aria-label="Select card"
        />
      );
    }
    return null;
  };

  return (
    <StyledCard
      $variant={variant}
      $disabled={disabled}
      onClick={isInteractive && !disabled ? onClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      tabIndex={isInteractive ? 0 : -1}
      role={isInteractive ? 'button' : undefined}
      aria-disabled={disabled}
      aria-selected={selected}
      draggable={draggable}
      {...props}
    >
      {image && image.position !== 'left' && (
        <CardImage height={image.height}>
          <img src={image.src} alt={image.alt} />
        </CardImage>
      )}

      <CardContent padding={padding}>
        {(selectionType !== 'none' ||
          leading ||
          image?.position === 'left' ||
          trailingContent !== 'none') && (
          <CardTopContainer>
            <SelectionContainer>
              {renderSelectionIndicator()}
              {leading && (
                <CardLeadingContainer>{leading}</CardLeadingContainer>
              )}
            </SelectionContainer>

            {renderTrailingContent()}
          </CardTopContainer>
        )}

        <CardMainContent>
          {eyebrow && <CardEyebrow>{eyebrow}</CardEyebrow>}

          {title && <CardTitle>{title}</CardTitle>}

          {helperText && <CardHelperText>{helperText}</CardHelperText>}

          {additionalDetails && (
            <CardAdditionalDetails>{additionalDetails}</CardAdditionalDetails>
          )}

          {tags && tags.length > 0 && (
            <CardTagRow>
              {tags.map((tag, index) => (
                <CardTag key={index} variant={tag.variant}>
                  {tag.label}
                </CardTag>
              ))}
            </CardTagRow>
          )}
        </CardMainContent>

        {footerActions && <CardFooter>{footerActions}</CardFooter>}
      </CardContent>
    </StyledCard>
  );
};

export default Card;
