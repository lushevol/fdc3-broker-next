import type { ElementMixinProperties } from '../mixins/typings.js';
import type { 
  CustomEventDetail, 
  DatePickerProperties, 
  Formatters, 
  SupportedKey,
  Calendar, 
  CalendarInit, 
  CalendarWeekday,
} from '../typings.js';
import type { OmitKey } from '../utility-typings.js';

export interface DateValidatorResult {
  date: Date;
  isValid: boolean;
}

export type MaybeDate = Date | null | number | string;

export interface MultiCalendars extends Omit<Calendar, 'calendar'> {
  calendars: Pick<Calendar, 'calendar' | 'key'>[];
  weekdays: CalendarWeekday[];
}

export interface SlotDatePickerInit extends OmitKey<DatePickerProperties, keyof ElementMixinProperties> {
  onDatePickerDateUpdated(event: CustomEvent<CustomEventDetail['sc-change']['detail']>): Promise<void> | void;
  onDatePickerFirstUpdated(event: CustomEvent<CustomEventDetail['sc-first-updated']['detail']>): Promise<void> | void;
}

export interface ToMultiCalendarsInit extends
Pick<Formatters, 'dayFormat' | 'fullDateFormat' | 'longWeekdayFormat' | 'narrowWeekdayFormat'>,
Partial<Pick<
  DatePickerProperties, 'firstDayOfWeek' | 'showWeekNumber' | 'weekLabel' | 'weekNumberType'
>>,
Pick<DatePickerProperties, 'locale'>,
Pick<CalendarInit, 'disabledDates' | 'disabledDays' | 'max' | 'min'> {
  count?: number;
  currentDate: CalendarInit['date'];
}

export interface ToNextSelectableDateInit {
  date: Date;
  disabledDatesSet: Set<number>;
  disabledDaysSet: Set<number>;
  key: SupportedKey;
  maxTime: number;
  minTime: number;
}

export interface ToNextSelectedDateInit {
  currentDate: Date;
  date: Date;
  disabledDatesSet: Set<number>;
  disabledDaysSet: Set<number>;
  hasAltKey: boolean;
  key: SupportedKey;
  maxTime: number;
  minTime: number;
}
