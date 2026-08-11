import type { LitConstructor, Picker, StartView, WeekNumberType } from '../typings.js';
import type { Constructor } from '../utility-typings.js';
import { CUSTOM_EVENTS_TYPE } from '../../../shared/sc-custom-events.js';
export interface DatePickerMinMaxProperties {
  max?: string;
  min?: string;
  minYear?: number;
  maxYear?: number;
}

export interface DatePickerMixinProperties {
  chooseMonthLabel: string;
  chooseYearLabel: string;
  disabledDates: any[];
  disabledDays: any[];
  firstDayOfWeek: number;
  locale: string;
  format?: string;
  nextMonthLabel: string;
  previousMonthLabel: string;
  selectedDateLabel: string;
  selectedMonthLabel?: string;
  selectedYearLabel: string;
  shortWeekLabel: string;
  showWeekNumber: boolean;
  showTime?: boolean;
  seconds?: boolean;
  timeValue?: any;
  defaultTimeValue?: string;
  _timeFormat?: string;
  startView: StartView;
  picker?: Picker;
  todayLabel: string;
  tomonthLabel?: string;
  toyearLabel: string;
  value?: any;
  weekLabel: string;
  weekNumberTemplate: string;
  weekNumberType: WeekNumberType;
  range?: boolean;
  open?: boolean;
  rangeDays?: number;
  positionType?: string;
  showActionBar?: boolean;
  quickSelector?: boolean;
  quickSelectorItems?: any[];
  hoist?: boolean;
  updateTimeValue?(): void;
  getDateString?(date: Date): string;
}

export interface ElementMixinProperties {
  emit<T extends string & keyof CUSTOM_EVENTS_TYPE>(name: T, options?: any): void;
  query<T extends HTMLElement>(selector: string): T | null;
  queryAll<T extends HTMLElement>(selector: string): T[];
  root: ShadowRoot;
}

export type MixinReturnType<
  BaseConstructor extends LitConstructor,
  Mixin
> = BaseConstructor & Constructor<Mixin>;
