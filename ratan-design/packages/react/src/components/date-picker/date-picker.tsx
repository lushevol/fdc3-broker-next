import { forwardRef, type ReactNode } from 'react';
import {
  AriaButtonAdapter,
  AriaCalendarAdapter,
  AriaCalendarCellAdapter,
  AriaCalendarGridAdapter,
  AriaDateInputAdapter,
  AriaDatePickerAdapter,
  AriaDateSegmentAdapter,
  AriaDialogAdapter,
  AriaFieldErrorAdapter,
  AriaGroupAdapter,
  AriaHeadingAdapter,
  AriaI18nProviderAdapter,
  AriaLabelAdapter,
  AriaPopoverAdapter,
  AriaTextAdapter,
  parseCalendarDateAdapter,
} from '@fm/ratan-design-foundation';

export type DatePickerValue = string | null;

export interface DatePickerProps {
  readonly value?: DatePickerValue;
  readonly defaultValue?: DatePickerValue;
  readonly onValueChange?: (value: DatePickerValue) => void;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly label: ReactNode;
  readonly description?: ReactNode;
  readonly errorMessage?: ReactNode;
  readonly name?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly invalid?: boolean;
  readonly minValue?: string;
  readonly maxValue?: string;
  readonly locale?: string;
  readonly dir?: 'ltr' | 'rtl';
  readonly className?: string;
  readonly id?: string;
}

function parseIsoDate(value: DatePickerValue | undefined, property: string) {
  if (value == null || value === '') return null;
  try {
    return parseCalendarDateAdapter(value);
  } catch {
    throw new TypeError(`${property} must be an ISO calendar date (YYYY-MM-DD).`);
  }
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  function DatePicker(
    {
      value,
      defaultValue,
      onValueChange,
      open,
      defaultOpen = false,
      onOpenChange,
      label,
      description,
      errorMessage,
      name,
      required = false,
      disabled = false,
      readOnly = false,
      invalid = false,
      minValue,
      maxValue,
      locale,
      dir,
      className,
      id,
    },
    forwardedRef,
  ) {
    const parsedValue = parseIsoDate(value, 'value');
    const parsedDefaultValue = parseIsoDate(defaultValue, 'defaultValue');
    const parsedMinValue = parseIsoDate(minValue, 'minValue');
    const parsedMaxValue = parseIsoDate(maxValue, 'maxValue');

    const picker = (
      <AriaDatePickerAdapter
        ref={forwardedRef}
        id={id}
        value={value === undefined ? undefined : parsedValue}
        defaultValue={parsedDefaultValue}
        onChange={(nextValue) => onValueChange?.(nextValue?.toString() ?? null)}
        isOpen={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        name={name}
        isRequired={required}
        isDisabled={disabled}
        isReadOnly={readOnly}
        isInvalid={invalid}
        minValue={parsedMinValue ?? undefined}
        maxValue={parsedMaxValue ?? undefined}
        className={className}
        data-ratan-component="DatePicker"
        data-invalid={invalid}
        data-disabled={disabled}
        data-read-only={readOnly}
        data-required={required}
        dir={dir}
      >
        <AriaLabelAdapter className="ratan-date-picker__label">
          {label}
        </AriaLabelAdapter>
        <AriaGroupAdapter className="ratan-date-picker__group">
          <AriaDateInputAdapter className="ratan-date-picker__input">
            {(segment) => (
              <AriaDateSegmentAdapter
                segment={segment}
                className="ratan-date-picker__segment"
              />
            )}
          </AriaDateInputAdapter>
          <AriaButtonAdapter
            className="ratan-date-picker__trigger"
            aria-label="Open calendar"
          >
            <span aria-hidden="true">▦</span>
          </AriaButtonAdapter>
        </AriaGroupAdapter>
        {description ? (
          <AriaTextAdapter slot="description" className="ratan-date-picker__description">
            {description}
          </AriaTextAdapter>
        ) : null}
        <AriaFieldErrorAdapter className="ratan-date-picker__error">
          {errorMessage}
        </AriaFieldErrorAdapter>
        <AriaPopoverAdapter className="ratan-date-picker__popover">
          <AriaDialogAdapter aria-label="Calendar" className="ratan-date-picker__dialog">
            <AriaCalendarAdapter className="ratan-date-picker__calendar">
              <header className="ratan-date-picker__calendar-header">
                <AriaButtonAdapter slot="previous" aria-label="Previous month">
                  ‹
                </AriaButtonAdapter>
                <AriaHeadingAdapter className="ratan-date-picker__calendar-title" />
                <AriaButtonAdapter slot="next" aria-label="Next month">
                  ›
                </AriaButtonAdapter>
              </header>
              <AriaCalendarGridAdapter>
                {(date) => <AriaCalendarCellAdapter date={date} />}
              </AriaCalendarGridAdapter>
            </AriaCalendarAdapter>
          </AriaDialogAdapter>
        </AriaPopoverAdapter>
      </AriaDatePickerAdapter>
    );

    return locale ? (
      <AriaI18nProviderAdapter locale={locale}>{picker}</AriaI18nProviderAdapter>
    ) : (
      picker
    );
  },
);
