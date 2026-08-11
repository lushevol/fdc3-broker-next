import {
  forwardRef,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEventHandler,
  type CSSProperties,
  type FormEvent,
  type FormEventHandler,
  type HTMLInputTypeAttribute,
  type InputHTMLAttributes,
  type MutableRefObject,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
} from 'react';
import {
  AriaButtonAdapter,
  AriaFieldErrorAdapter,
  AriaInputAdapter,
  AriaLabelAdapter,
  AriaTextAdapter,
  AriaTextAreaAdapter,
  AriaTextFieldAdapter,
} from '@fm/ratan-design-foundation';
import type { RatanPressEvent } from '../../events';

export const TEXT_INPUT_SIZES = [
  'xxs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
] as const;
export const TEXT_INPUT_BORDER_TYPES = ['line', 'box'] as const;
export const TEXT_INPUT_LABEL_POSITIONS = [
  'top',
  'top-right',
  'right',
  'bottom',
  'left',
] as const;
export const TEXT_INPUT_LABEL_ALIGNMENTS = ['left', 'right'] as const;
export const TEXT_INPUT_PLACEMENTS = ['top', 'left', 'right', 'bottom'] as const;

export type TextInputSize = (typeof TEXT_INPUT_SIZES)[number];
export type TextInputBorderType = (typeof TEXT_INPUT_BORDER_TYPES)[number];
export type TextInputLabelPosition = (typeof TEXT_INPUT_LABEL_POSITIONS)[number];
export type TextInputLabelAlignment =
  (typeof TEXT_INPUT_LABEL_ALIGNMENTS)[number];
export type TextInputPlacement = (typeof TEXT_INPUT_PLACEMENTS)[number];
export type TextInputElement = HTMLInputElement | HTMLTextAreaElement;
export type TextInputValueChangeEvent =
  | FormEvent<TextInputElement>
  | RatanPressEvent;

export interface TextInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'children'
    | 'defaultValue'
    | 'onChange'
    | 'onInput'
    | 'prefix'
    | 'size'
    | 'type'
    | 'value'
  > {
  readonly value?: string | number;
  readonly defaultValue?: string | number;
  readonly type?: HTMLInputTypeAttribute;
  readonly multiline?: boolean;
  readonly rows?: number;
  readonly resizable?: boolean | 'auto';
  readonly showCharacterCount?: boolean;
  readonly borderType?: TextInputBorderType;
  readonly size?: TextInputSize;
  readonly textAlign?: 'left' | 'right';
  readonly labelPosition?: TextInputLabelPosition;
  readonly labelAlignment?: TextInputLabelAlignment;
  readonly label?: ReactNode;
  readonly children?: ReactNode;
  readonly labelTooltip?: ReactNode;
  readonly labelHint?: ReactNode;
  readonly tooltip?: ReactNode;
  readonly hint?: ReactNode;
  readonly tooltipPlacement?: TextInputPlacement;
  readonly hintPlacement?: TextInputPlacement;
  readonly prefix?: ReactNode;
  readonly suffix?: ReactNode;
  readonly errorIcon?: ReactNode;
  readonly formControl?: ReactNode;
  readonly help?: ReactNode;
  readonly helpText?: string;
  readonly error?: boolean;
  readonly success?: boolean;
  readonly errorMessage?: string;
  readonly successMessage?: string;
  readonly errorContent?: ReactNode;
  readonly successContent?: ReactNode;
  readonly clearable?: boolean;
  readonly prefixIcon?: string;
  readonly suffixIcon?: string;
  readonly suffixLabel?: string;
  readonly maxRows?: boolean;
  readonly readOnlyRows?: number;
  readonly labelSize?: TextInputSize;
  readonly iconSize?: string;
  readonly truncate?: boolean;
  readonly trustpoint?: boolean;
  readonly useDefaultSlotNotAsLabel?: boolean;
  readonly formControlClsName?: string;
  readonly onValueChange?: (
    value: string,
    event: TextInputValueChangeEvent,
  ) => void;
  readonly onBubbleInput?: (value: string, event: FormEvent<TextInputElement>) => void;
  readonly onClear?: (event: RatanPressEvent) => void;
  readonly onInput?: FormEventHandler<TextInputElement>;
  readonly onChange?: ChangeEventHandler<TextInputElement>;
}

function setForwardedRef(ref: Ref<TextInputElement>, value: TextInputElement | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    (ref as MutableRefObject<TextInputElement | null>).current = value;
  }
}

function BuiltInIcon({ name }: { readonly name: string }) {
  return <span aria-hidden="true" className="ratan-text-input__named-icon" data-icon-name={name} />;
}

export const TextInput = forwardRef<TextInputElement, TextInputProps>(
  function TextInput(
    {
      value,
      defaultValue = '',
      type = 'text',
      multiline = false,
      rows,
      resizable = false,
      showCharacterCount = false,
      borderType = 'box',
      size = 'md',
      textAlign = 'left',
      labelPosition = 'top',
      labelAlignment = 'left',
      label,
      children,
      labelTooltip,
      labelHint,
      tooltip,
      hint,
      tooltipPlacement = 'top',
      hintPlacement = 'right',
      prefix,
      suffix,
      errorIcon,
      formControl,
      help,
      helpText = '',
      error = false,
      success = false,
      errorMessage = '',
      successMessage = '',
      errorContent,
      successContent,
      clearable = false,
      prefixIcon = '',
      suffixIcon = '',
      suffixLabel = '',
      maxRows = false,
      readOnlyRows = 5,
      labelSize,
      iconSize,
      truncate = false,
      trustpoint = false,
      useDefaultSlotNotAsLabel = false,
      formControlClsName,
      maxLength,
      placeholder = 'Input here',
      readOnly = false,
      disabled = false,
      required = false,
      className,
      id,
      onValueChange,
      onBubbleInput,
      onClear,
      onInput,
      onChange,
      ...nativeProps
    },
    forwardedRef,
  ) {
    const generatedId = useId();
    const controlId = id ?? `ratan-text-input-${generatedId}`;
    const helpId = `${controlId}-help`;
    const errorId = `${controlId}-error`;
    const successId = `${controlId}-success`;
    const controlRef = useRef<TextInputElement | null>(null);
    const isControlled = value !== undefined;
    const clamp = (candidate: string) =>
      maxLength === undefined ? candidate : candidate.slice(0, maxLength);
    const [uncontrolledValue, setUncontrolledValue] = useState(() =>
      clamp(String(defaultValue)),
    );
    const currentValue = clamp(String(value ?? uncontrolledValue));
    const renderedLabel = label ?? (useDefaultSlotNotAsLabel ? null : children);
    const renderedTooltip = labelTooltip ?? tooltip;
    const renderedHint = labelHint ?? hint;
    const helpContent = help ?? (helpText || null);
    const renderedError = errorContent ?? (errorMessage || null);
    const renderedSuccess = successContent ?? (successMessage || null);

    const assignControlRef = (element: TextInputElement | null) => {
      controlRef.current = element;
      setForwardedRef(forwardedRef, element);
    };

    useLayoutEffect(() => {
      const control = controlRef.current;
      if (!multiline || resizable !== 'auto' || !(control instanceof HTMLTextAreaElement)) {
        return;
      }
      control.style.height = '0px';
      control.style.height = `${control.scrollHeight + 2}px`;
    }, [currentValue, multiline, resizable]);

    const handleInput = (event: FormEvent<TextInputElement>) => {
      const nextValue = clamp(event.currentTarget.value);
      if (event.currentTarget.value !== nextValue) event.currentTarget.value = nextValue;
      if (!isControlled) setUncontrolledValue(nextValue);
      onInput?.(event);
      onValueChange?.(nextValue, event);
      onBubbleInput?.(nextValue, event);
    };

    const handleClear = (event: RatanPressEvent) => {
      if (!isControlled) setUncontrolledValue('');
      onValueChange?.('', event);
      onClear?.(event);
      controlRef.current?.focus();
    };

    const sharedControlProps = {
      id: controlId,
      ref: assignControlRef,
      maxLength,
      placeholder,
      className: formControlClsName,
      'aria-errormessage': error && renderedError ? errorId : undefined,
      'data-border-type': borderType,
      'data-size': size,
      'data-text-align': textAlign,
      'data-resizable': multiline ? String(resizable) : undefined,
      onInput: handleInput,
      onChange,
    } as const;

    const nativeControl = multiline ? (
      <AriaTextAreaAdapter
        {...(nativeProps as unknown as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        {...sharedControlProps}
        rows={rows}
        className={formControlClsName}
        onChange={onChange as ChangeEventHandler<HTMLTextAreaElement>}
      />
    ) : (
      <AriaInputAdapter
        {...nativeProps}
        {...sharedControlProps}
        type={type}
        className={formControlClsName}
        onChange={onChange as ChangeEventHandler<HTMLInputElement>}
      />
    );

    return (
      <AriaTextFieldAdapter
        className={className}
        value={currentValue}
        onChange={(nextValue) => {
          const clampedValue = clamp(nextValue);
          if (!isControlled) setUncontrolledValue(clampedValue);
        }}
        isDisabled={disabled}
        isReadOnly={readOnly}
        isRequired={required}
        isInvalid={error}
        aria-label={nativeProps['aria-label']}
        aria-labelledby={nativeProps['aria-labelledby']}
        data-ratan-component="TextInput"
        data-border-type={borderType}
        data-size={size}
        data-label-position={labelPosition}
        data-label-alignment={labelAlignment}
        data-tooltip-placement={tooltipPlacement}
        data-hint-placement={hintPlacement}
        data-error={error}
        data-success={success}
        data-disabled={disabled}
        data-read-only={readOnly}
        data-max-rows={maxRows}
        data-truncate={truncate}
        data-trustpoint={trustpoint}
        style={{ '--_read-only-rows': readOnlyRows } as CSSProperties}
      >
        <div className="ratan-text-input__main">
          {renderedLabel || renderedTooltip || renderedHint ? (
            <AriaLabelAdapter
              className="ratan-text-input__label"
              data-size={labelSize ?? size}
              data-alignment={labelAlignment}
              data-tooltip-placement={tooltipPlacement}
              data-hint-placement={hintPlacement}
              title={typeof renderedTooltip === 'string' ? renderedTooltip : undefined}
            >
              <span className="ratan-text-input__label-content">{renderedLabel}</span>
              {required ? (
                <span className="ratan-text-input__required" aria-hidden="true">
                  *
                </span>
              ) : null}
              {renderedHint ? <span className="ratan-text-input__label-hint">{renderedHint}</span> : null}
              {renderedTooltip && typeof renderedTooltip !== 'string' ? renderedTooltip : null}
            </AriaLabelAdapter>
          ) : null}
          <div className="ratan-text-input__input-area">
            {prefix || prefixIcon ? (
              <span className="ratan-text-input__prefix" data-icon-size={iconSize}>
                {prefix ?? <BuiltInIcon name={prefixIcon} />}
              </span>
            ) : null}
            <div className="ratan-text-input__control">{formControl ?? nativeControl}</div>
            <span className="ratan-text-input__suffix" data-icon-size={iconSize}>
              {clearable && currentValue && !disabled && !readOnly ? (
                <AriaButtonAdapter
                  className="ratan-text-input__clear"
                  aria-label={`Clear ${typeof renderedLabel === 'string' ? renderedLabel : 'input'}`}
                  onPress={handleClear}
                >
                  <BuiltInIcon name="close-circle--fill" />
                </AriaButtonAdapter>
              ) : null}
              {error ? errorIcon ?? <BuiltInIcon name="alert-circle--line" /> : null}
              {suffixLabel ? <span className="ratan-text-input__suffix-label">{suffixLabel}</span> : null}
              {suffixIcon ? <BuiltInIcon name={suffixIcon} /> : null}
              {suffix}
            </span>
          </div>
        </div>
        <div className="ratan-text-input__description">
          <div className="ratan-text-input__messages">
            {helpContent ? (
              <AriaTextAdapter id={helpId} slot="description" className="ratan-text-input__help">
                {helpContent}
              </AriaTextAdapter>
            ) : null}
            {renderedSuccess ? <div id={successId} className="ratan-text-input__success">{renderedSuccess}</div> : null}
            {renderedError ? (
              <AriaFieldErrorAdapter id={errorId} className="ratan-text-input__error">
                {renderedError}
              </AriaFieldErrorAdapter>
            ) : null}
          </div>
          {maxLength !== undefined && showCharacterCount && !readOnly ? (
            <div className="ratan-text-input__character-count">
              {currentValue.length} / {maxLength}
            </div>
          ) : null}
        </div>
      </AriaTextFieldAdapter>
    );
  },
);
