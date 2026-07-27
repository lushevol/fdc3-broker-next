import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DatePicker as ReactAriaDatePicker,
  DateSegment,
  Dialog,
  FieldError,
  Group,
  Heading,
  Label,
  Popover,
  Text,
} from 'react-aria-components';
import type { DateValue } from '@internationalized/date';
import type { ReactNode } from 'react';

export interface DatePickerProps {
  readonly id: string;
  readonly label: string;
  readonly value: DateValue | null;
  readonly onChange: (value: DateValue | null) => void;
  readonly helperText?: ReactNode;
  readonly error?: boolean;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly minValue?: DateValue;
  readonly maxValue?: DateValue;
}

/** A locale-aware calendar field with React Aria keyboard and screen-reader behavior. */
export function DatePicker({
  id, label, value, onChange, helperText, error = false, required = false,
  disabled = false, minValue, maxValue,
}: DatePickerProps) {
  return (
    <ReactAriaDatePicker
      className="ratan-field ratan-date-picker"
      data-ratan-component="date-picker"
      id={id}
      isDisabled={disabled}
      isInvalid={error}
      isRequired={required}
      minValue={minValue}
      maxValue={maxValue}
      value={value}
      onChange={onChange}
    >
      <Label className="ratan-field-label">{label}</Label>
      <Group className="ratan-date-group">
        <DateInput className="ratan-date-input" data-ratan-control="date-picker">
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
        <Button className="ratan-date-trigger" aria-label={`Open ${label} calendar`}>▾</Button>
      </Group>
      {helperText ? (error ? <FieldError className="ratan-field-message ratan-field-error">{helperText}</FieldError> : <Text className="ratan-field-message" slot="description">{helperText}</Text>) : null}
      <Popover className="ratan-date-popover">
        <Dialog className="ratan-date-dialog">
          <Calendar>
            <header className="ratan-calendar-header"><Button slot="previous" aria-label="Previous month">‹</Button><Heading /><Button slot="next" aria-label="Next month">›</Button></header>
            <CalendarGrid>{(date) => <CalendarCell date={date} />}</CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </ReactAriaDatePicker>
  );
}
