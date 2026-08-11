import type { LitElement, PropertyValues } from 'lit';
import type { picker, startViews } from './constants.js';
import type { ScDatePicker as DatePicker } from './DatePicker/ScDatePicker.js';
import type { 
  keyArrowDown, 
  keyArrowLeft, 
  keyArrowRight, 
  keyArrowUp, 
  keyEnd, 
  keyEnter, 
  keyHome, 
  keyPageDown, 
  keyPageUp, 
  keySpace, 
  keyTab, 
} from '../../shared/key-values.js';
import type { 
  DatePickerMinMaxProperties, 
  DatePickerMixinProperties, 
  ElementMixinProperties, 
} from './mixins/typings.js';
import type { Constructor } from './utility-typings.js';

export interface Calendar {
  calendar: CalendarDay[][];
  disabledDatesSet: Set<number>;
  disabledDaysSet: Set<number>;
  key: string;
}
export interface CalendarDay extends CalendarWeekday {
  disabled: boolean;
  fullDate: Date | null;
  key: string;
}
export interface CalendarInit extends CalendarInitBase {
  date: Date;
  dayFormat: DateTimeFormatter;
  disabledDates?: Date[];
  disabledDays?: number[];
  fullDateFormat: DateTimeFormatter;
  locale: string;
  max?: Date;
  min?: Date;
  weekNumberType?: WeekNumberType;
}
export interface CalendarInitBase {
  firstDayOfWeek?: number;
  showWeekNumber?: boolean;
  weekNumberTemplate?: string;
}
export interface CalendarWeekday {
  label: string;
  value: string;
}
export declare type DateTimeFormatter = Intl.DateTimeFormat['format'];
export declare type WeekNumberType = 'first-4-day-week' | 'first-day-of-year' | 'first-full-week';

export type ChangedProperties<T = Record<string, unknown>> = PropertyValues & Map<keyof T, T[keyof T]>;

export interface CustomEventAction<T extends string, CustomEventDetail> {
  detail: CustomEventDetail;
  type: T;
}

export interface CustomEventDetail {
  ['sc-change']: CustomEventAction<'sc-change', CustomEventDetailDateUpdated>;
  ['sc-first-updated']: CustomEventAction<'sc-first-updated', CustomEventDetailFirstUpdated>;
  ['sc-year-updated']: CustomEventAction<'sc-year-updated', CustomEventDetailYearUpdated>;
  ['sc-month-updated']: CustomEventAction<'sc-month-updated', CustomEventDetailMonthUpdated>;
}

interface CustomEventDetailDateUpdated extends KeyEvent, DatePickerValues {}

interface CustomEventDetailFirstUpdated extends DatePickerValues {
  focusableElements: HTMLElement[];
}

/**
 * NOTE: No `KeyEvent` is needed as native `button` element will dispatch `click` event on keypress.
 */
interface CustomEventDetailMonthUpdated {
  monthValue: number;
  month: string;
}

interface CustomEventDetailYearUpdated {
  year: number;
}
export interface DatePickerProperties extends
  DatePickerMinMaxProperties,
  DatePickerMixinProperties,
  ElementMixinProperties {}

type DatePickerValues = Required<Pick<DatePicker, 'value' | 'valueAsDate' | 'valueAsNumber'>>;

export interface Formatters extends Pick<DatePicker, 'locale'> {
  dateFormat: DateTimeFormatter;
  dayFormat: DateTimeFormatter;
  fullDateFormat: DateTimeFormatter;
  monthFormat: DateTimeFormatter;
  monthYearFormat: DateTimeFormatter;
  shortMonthYearFormat: DateTimeFormatter;
  longWeekdayFormat: DateTimeFormatter;
  narrowWeekdayFormat: DateTimeFormatter;
  yearFormat: DateTimeFormatter;
}

export type InferredFromSet<SetType> = SetType extends Set<infer T> ? T : never;

interface KeyEvent {
  isKeypress: boolean;
  key?: SupportedKey;
}

export type LitConstructor = Constructor<LitElement>;

export type StartView = StartViewTuple[number];

export type StartViewTuple = typeof startViews;

export type Picker = PickerTuple[number];

export type PickerTuple = typeof picker;

export type SupportedKey =
  | typeof keyArrowDown
  | typeof keyArrowLeft
  | typeof keyArrowRight
  | typeof keyArrowUp
  | typeof keyEnd
  | typeof keyEnter
  | typeof keyHome
  | typeof keyPageDown
  | typeof keyPageUp
  | typeof keySpace
  | typeof keyTab;

export interface ValueUpdatedEvent extends KeyEvent {
  value: string;
  clickType?: string;
}

export type RangeValue = {
  start?: string | Date;
  end?: string | Date;
}
