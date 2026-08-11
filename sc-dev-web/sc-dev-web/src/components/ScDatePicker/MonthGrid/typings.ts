import type { ChangedProperties, DatePickerProperties, Formatters, SupportedKey } from '../typings.js';

type PickDatePickerProperties = Pick<DatePickerProperties, 'selectedMonthLabel' | 'tomonthLabel'>;
type PickMonthGridData = Pick<MonthGridData, 'date' | keyof PickDatePickerProperties>;

export interface ToNextSelectableMonthInit {
  key: SupportedKey;
  month: number;
}

export type MonthGridChangedProperties = ChangedProperties<MonthGridProperties>;

export interface MonthGridData extends PickDatePickerProperties {
  date: Date;
  min?: Date;
  max?: Date;
  picker?: string;
  currentDate?: Date;
  formatters?: Formatters
}

export interface MonthGridProperties {
  data?: MonthGridData;
}

export interface MonthGridRenderButtonInit extends Omit<HTMLElement, 'part'>, PickMonthGridData {
  focusingMonth: number;
  label: string;
  part: string;
  month: string;
  monthValue: number;
}
