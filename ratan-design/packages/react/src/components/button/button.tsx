import {
  Fragment,
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  AriaButtonAdapter,
  type AriaButtonAdapterProps,
} from '@fm/ratan-design-foundation';
import type { RatanPressEvent } from '../../events';

export const BUTTON_VARIANTS = ['primary', 'secondary', 'text', 'link'] as const;
export const BUTTON_TONES = ['default', 'error', 'alert', 'success'] as const;
export const BUTTON_SIZES = ['xxs', 'xs', 'sm', 'md', 'lg'] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonTone = (typeof BUTTON_TONES)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'type'> {
  readonly variant?: ButtonVariant;
  readonly tone?: ButtonTone;
  readonly size?: ButtonSize;
  readonly width?: CSSProperties['width'];
  readonly startIcon?: ReactNode;
  readonly endIcon?: ReactNode;
  readonly pill?: boolean;
  readonly border?: boolean;
  readonly compact?: boolean;
  readonly snack?: boolean;
  readonly truncate?: boolean;
  readonly loading?: boolean;
  /** Localized text announced when loading begins. */
  readonly loadingLabel?: string;
  readonly readOnly?: boolean;
  readonly selectable?: boolean | 'toggle';
  readonly selected?: boolean;
  readonly defaultSelected?: boolean;
  readonly onSelectedChange?: (selected: boolean) => void;
  readonly onPress?: (event: RatanPressEvent) => void;
  /** Legacy capability retained for parity. Prefer a primary variant directly. */
  readonly fill?: boolean;
  /** Legacy inverse presentation retained for parity. */
  readonly inverse?: boolean;
  /** Legacy icon-button presentation retained for parity. Prefer IconButton. */
  readonly iconButton?: boolean;
  readonly type?: 'button' | 'submit' | 'reset';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    tone = 'default',
    size = 'sm',
    width,
    startIcon,
    endIcon,
    pill = true,
    border = true,
    compact = false,
    snack = false,
    truncate = false,
    loading = false,
    loadingLabel = 'Loading',
    readOnly = false,
    selectable = false,
    selected,
    defaultSelected = false,
    onSelectedChange,
    onPress,
    fill = false,
    inverse = false,
    iconButton = false,
    disabled = false,
    className,
    children,
    onClick,
    style,
    type = 'button',
    ...nativeProps
  },
  ref,
) {
  const [uncontrolledSelected, setUncontrolledSelected] = useState(defaultSelected);
  const isControlled = selected !== undefined;
  const isSelected = selected ?? uncontrolledSelected;
  const effectiveVariant = fill ? 'primary' : variant;

  const handlePress = (event: RatanPressEvent) => {
    if (selectable) {
      const nextSelected = selectable === 'toggle' ? !isSelected : true;
      if (!isControlled) setUncontrolledSelected(nextSelected);
      onSelectedChange?.(nextSelected);
    }
    onPress?.(event);
  };

  return (
    <Fragment>
      <AriaButtonAdapter
      {...(nativeProps as unknown as AriaButtonAdapterProps)}
      ref={ref}
      type={type}
      className={className}
      style={{ ...style, ...(width === undefined ? {} : { width }) }}
      isDisabled={disabled || readOnly}
      isPending={loading}
      aria-disabled={loading || readOnly || undefined}
      aria-readonly={readOnly || undefined}
      aria-pressed={selectable ? isSelected : undefined}
      data-ratan-component="Button"
      data-variant={effectiveVariant}
      data-tone={tone}
      data-size={size}
      data-pill={pill}
      data-border={border}
      data-compact={compact}
      data-snack={snack}
      data-truncate={truncate}
      data-loading={loading}
      data-disabled={disabled}
      data-read-only={readOnly}
      data-selected={selectable ? isSelected : undefined}
      data-inverse={inverse}
      data-icon-button={iconButton}
      onClick={onClick as unknown as AriaButtonAdapterProps['onClick']}
      onPress={handlePress}
      >
        {loading ? <span className="ratan-button__spinner" aria-hidden="true" /> : null}
        {!loading && startIcon ? (
          <span className="ratan-button__start-icon" aria-hidden="true">
            {startIcon}
          </span>
        ) : null}
        <span className="ratan-button__label">{children}</span>
        {endIcon ? (
          <span className="ratan-button__end-icon" aria-hidden="true">
            {endIcon}
          </span>
        ) : null}
      </AriaButtonAdapter>
      {loading ? (
        <span
          className="ratan-button__loading-announcement"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {loadingLabel}
        </span>
      ) : null}
    </Fragment>
  );
});
