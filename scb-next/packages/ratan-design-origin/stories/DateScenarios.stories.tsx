import React from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../src';
import { Box, Stack, Typography } from '../src/primitives';
import {
  AdapterDayjs,
  LocalizationProvider,
  DatePicker,
  DateTimePicker,
  TimePicker,
  DatePickerRoot,
  DateTimePickerRoot,
  TimePickerRoot,
} from '../src/dates';
import { DateRangePicker, DateRangePickerRoot } from '../src/date-range';

const REFERENCE = dayjs('2026-10-12T14:30:00');
const MIN_DATE = dayjs('2026-10-05');
const MAX_DATE = dayjs('2026-10-23');

interface DateExampleProps {
  kind: 'date' | 'dateTime' | 'time';
  labelPosition: 'top' | 'left';
  state: 'value' | 'empty' | 'default' | 'invalid';
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  constrained: boolean;
  customFormat: boolean;
}

function DateExample({
  kind,
  labelPosition,
  state,
  disabled,
  readOnly,
  required,
  constrained,
  customFormat,
}: DateExampleProps) {
  const [value, setValue] = React.useState<Dayjs | null>(() =>
    state === 'empty' ? null : state === 'invalid' ? MIN_DATE.subtract(1, 'day') : REFERENCE,
  );
  const [error, setError] = React.useState<string | null>(null);
  const [event, setEvent] = React.useState('No picker event');
  const common = {
    labelPosition,
    disabled,
    readOnly,
    referenceDate: REFERENCE,
    ...(state === 'default' ? { defaultValue: REFERENCE } : { value }),
    onChange: (next: Dayjs | null) => {
      setValue(next);
      setEvent('change');
    },
    onAccept: () => setEvent('accept'),
    onClose: () => setEvent('close'),
    onError: (reason: string | null) => setError(reason),
    slotProps: {
      textField: {
        fullWidth: true,
        required,
        helperText: disabled
          ? undefined
          : error
            ? `Validation: ${error}`
            : constrained
              ? 'Choose a weekday from 5–23 October 2026; time 09:00–17:00 where shown.'
              : 'Edit the field or open the picker. Clear resets a controlled value.',
      },
      actionBar: { actions: ['clear', 'cancel', 'accept'] as ('clear' | 'cancel' | 'accept')[] },
    },
  };
  const limits =
    constrained || state === 'invalid'
      ? {
          minDate: MIN_DATE,
          maxDate: MAX_DATE,
          shouldDisableDate: (date: Dayjs) => date.day() === 0 || date.day() === 6,
        }
      : {};
  return (
    <Stack spacing={2} sx={{ p: 3, maxWidth: '36rem' }}>
      {kind === 'date' ? (
        <DatePicker
          {...common}
          {...limits}
          label="Selected date"
          format={customFormat ? 'DD MMM YYYY' : 'MM/DD/YYYY'}
        />
      ) : kind === 'dateTime' ? (
        <DateTimePicker
          {...common}
          {...limits}
          label="Selected date and time"
          ampm={!customFormat}
          format={customFormat ? 'DD/MM/YYYY HH:mm' : undefined}
          minTime={constrained ? REFERENCE.hour(9).minute(0) : undefined}
          maxTime={constrained ? REFERENCE.hour(17).minute(0) : undefined}
        />
      ) : (
        <TimePicker
          {...common}
          label="Selected time"
          ampm={!customFormat}
          minutesStep={customFormat ? 15 : 1}
          minTime={constrained ? REFERENCE.hour(9).minute(0) : undefined}
          maxTime={constrained ? REFERENCE.hour(17).minute(0) : undefined}
        />
      )}
      <Typography role="status">
        Value:{' '}
        {value?.isValid() ? value.format('YYYY-MM-DD HH:mm') : value ? 'Invalid date' : 'Empty'}.
        Last event: {event}.
      </Typography>
      {state !== 'default' && (
        <Button
          variant="outlined"
          disabled={disabled || readOnly}
          onClick={() => {
            setValue(null);
            setEvent('clear');
          }}
        >
          Clear value
        </Button>
      )}
    </Stack>
  );
}

const meta = {
  title: 'Inputs/Date scenarios',
  component: DateExample,
  tags: ['autodocs'],
  args: {
    kind: 'date',
    labelPosition: 'top',
    state: 'value',
    disabled: false,
    readOnly: false,
    required: false,
    constrained: false,
    customFormat: false,
  },
  argTypes: {
    kind: { control: 'select', options: ['date', 'dateTime', 'time'] },
    labelPosition: { control: 'radio', options: ['top', 'left'] },
    state: { control: 'select', options: ['value', 'empty', 'default', 'invalid'] },
  },
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Story />
      </LocalizationProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Dayjs examples use the fixed reference 12 October 2026, independent of the system clock. Hosts own locale, validation, controlled values and MUI X Pro licensing. The range entry always uses its single-input field and does not initialize or bypass a license. All popovers start closed.',
      },
    },
  },
  render: (args) => <DateExample key={`${args.kind}-${args.state}`} {...args} />,
} satisfies Meta<typeof DateExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const DatePlayground: Story = {};
export const DateTime: Story = { args: { kind: 'dateTime' } };
export const Time: Story = { args: { kind: 'time' } };
export const ControlledEmpty: Story = { args: { state: 'empty', required: true } };
export const UncontrolledDefault: Story = { args: { state: 'default' } };
export const LeftLabels: Story = { args: { labelPosition: 'left' } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const DateLimitsAndWeekdays: Story = { args: { constrained: true } };
export const InvalidDate: Story = { args: { state: 'invalid' } };
export const DateTimeLimits: Story = {
  args: { kind: 'dateTime', constrained: true, customFormat: true },
};
export const TimeLimitsAndSteps: Story = {
  args: { kind: 'time', constrained: true, customFormat: true },
};
export const CustomDateFormat: Story = { args: { customFormat: true } };

function VisibilityExample() {
  const [hidden, setHidden] = React.useState(false);
  return (
    <Stack spacing={2} sx={{ p: 3, maxWidth: '36rem' }}>
      <Button variant="outlined" onClick={() => setHidden((value) => !value)}>
        {hidden ? 'Show date field' : 'Hide date field'}
      </Button>
      <DatePicker
        label="Retained hidden date"
        hidden={hidden}
        defaultValue={REFERENCE}
        referenceDate={REFERENCE}
        slotProps={{
          textField: {
            fullWidth: true,
            helperText: 'The field stays mounted when hidden.',
            inputProps: { 'data-testid': 'hidden-date-field' },
          },
        }}
      />
      <Typography role="status">Field is {hidden ? 'hidden' : 'visible'}.</Typography>
    </Stack>
  );
}
export const HiddenFieldRetainsValue: Story = { render: () => <VisibilityExample /> };
export const BritishLocale: Story = {
  render: () => (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <Box sx={{ p: 3, maxWidth: '36rem' }}>
        <DatePicker
          label="British date format"
          defaultValue={REFERENCE}
          referenceDate={REFERENCE}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              helperText: 'Locale and format are supplied by the host.',
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  ),
};

function RangeExample({
  state = 'complete',
  disabled = false,
  readOnly = false,
  labelPosition = 'top',
}: {
  state?: 'empty' | 'partial' | 'complete' | 'invalid' | 'default';
  disabled?: boolean;
  readOnly?: boolean;
  labelPosition?: 'top' | 'left';
}) {
  const [range, setRange] = React.useState<[Dayjs | null, Dayjs | null]>(() =>
    state === 'empty'
      ? [null, null]
      : state === 'partial'
        ? [REFERENCE, null]
        : state === 'invalid'
          ? [MIN_DATE.subtract(1, 'day'), REFERENCE]
          : [REFERENCE, REFERENCE.add(4, 'day')],
  );
  const [event, setEvent] = React.useState('No range event');
  const [error, setError] = React.useState<string | null>(null);
  return (
    <Stack spacing={2} sx={{ p: 3, maxWidth: '40rem' }}>
      <Typography variant="body2">
        Optional MUI X Pro integration. A licensed host supplies its own license initialization.
      </Typography>
      <DateRangePicker
        label="Selected period"
        labelPosition={labelPosition}
        disabled={disabled}
        readOnly={readOnly}
        calendars={1}
        {...(state === 'default'
          ? { defaultValue: [REFERENCE, REFERENCE.add(4, 'day')] as [Dayjs, Dayjs] }
          : { value: range })}
        referenceDate={REFERENCE}
        minDate={MIN_DATE}
        maxDate={MAX_DATE}
        format="MM/DD/YYYY"
        onChange={(next) => {
          setRange(next);
          setEvent('change');
        }}
        onAccept={() => setEvent('accept')}
        onClose={() => setEvent('close')}
        onError={(errors) => setError(errors.filter(Boolean).join(', ') || null)}
        slotProps={{
          textField: {
            fullWidth: true,
            helperText: disabled
              ? undefined
              : error
                ? `Validation: ${error}`
                : 'Select a period from 5–23 October 2026.',
          },
          actionBar: { actions: ['clear', 'cancel', 'accept'] },
        }}
      />
      <Typography role="status">
        Range:{' '}
        {range
          .map((value) =>
            value?.isValid() ? value.format('YYYY-MM-DD') : value ? 'Invalid' : 'Empty',
          )
          .join(' → ')}
        . Last event: {event}.
      </Typography>
      {state !== 'default' && (
        <Button
          variant="outlined"
          disabled={disabled || readOnly}
          onClick={() => {
            setRange([null, null]);
            setEvent('clear');
          }}
        >
          Clear range
        </Button>
      )}
    </Stack>
  );
}
export const RangeComplete: Story = { render: () => <RangeExample /> };
export const RangeEmpty: Story = { render: () => <RangeExample state="empty" /> };
export const RangePartial: Story = { render: () => <RangeExample state="partial" /> };
export const RangeValidation: Story = { render: () => <RangeExample state="invalid" /> };
export const RangeUncontrolledDefault: Story = { render: () => <RangeExample state="default" /> };
export const RangeLeftLabels: Story = { render: () => <RangeExample labelPosition="left" /> };
export const RangeDisabled: Story = { render: () => <RangeExample disabled /> };
export const RangeReadOnly: Story = { render: () => <RangeExample readOnly /> };
export const StyledRoots: Story = {
  render: () => (
    <Stack spacing={3} sx={{ p: 3, maxWidth: '40rem' }}>
      <Typography variant="body2">
        The lower-level styled roots retain MUI X props. Hosts using them compose field slots and
        values directly.
      </Typography>
      <DatePickerRoot
        label="Date root"
        defaultValue={REFERENCE}
        referenceDate={REFERENCE}
        slotProps={{ textField: { fullWidth: true } }}
      />
      <DateTimePickerRoot
        label="Date and time root"
        defaultValue={REFERENCE}
        referenceDate={REFERENCE}
        slotProps={{ textField: { fullWidth: true } }}
      />
      <TimePickerRoot
        label="Time root"
        defaultValue={REFERENCE}
        referenceDate={REFERENCE}
        slotProps={{ textField: { fullWidth: true } }}
      />
      <DateRangePickerRoot
        defaultValue={[REFERENCE, REFERENCE.add(4, 'day')]}
        referenceDate={REFERENCE}
        calendars={1}
        localeText={{ start: 'Range root start', end: 'Range root end' }}
        slotProps={{
          textField: { fullWidth: true, sx: { minWidth: 0 } },
          fieldSeparator: { sx: { alignSelf: 'flex-end', pb: 1, px: 1 } },
        }}
      />
    </Stack>
  ),
};
