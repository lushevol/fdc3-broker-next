import { toResolvedDate } from './helpers/to-resolved-date.js';
import { 
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
} from '../../shared/key-values.js';

export const confirmKeySet = new Set([keyEnter, keySpace]);
export const { DateTimeFormat } = Intl;
export const labelChooseMonth = 'Choose month' as const;
export const labelChooseYear = 'Choose year' as const;
export const labelNextMonth = 'Next month' as const;
export const labelPreviousMonth = 'Previous month' as const;
export const labelSelectedDate = 'Selected date' as const;
export const labelSelectedMonth = 'Selected month' as const;
export const labelSelectedYear = 'Selected year' as const;
export const labelShortWeek = 'Wk' as const;
export const labelToday = 'Today' as const;
export const labelTomonth = 'Tomonth' as const;
export const labelToyear = 'Toyear' as const;
export const labelWeek = 'Week' as const;
export const MAX_DATE = new Date(8640000000000000);
export const MIN_DATE = new Date(-8640000000000000);
export const navigationKeyListNext = [keyArrowDown, keyPageDown, keyEnd];
export const navigationKeyListPrevious = [keyArrowUp, keyPageUp, keyHome];
export const navigationKeySetDayNext = new Set([...navigationKeyListNext, keyArrowRight]);
export const navigationKeySetDayPrevious = new Set([...navigationKeyListPrevious, keyArrowLeft]);
export const navigationKeySetGrid = new Set([...navigationKeySetDayNext, ...navigationKeySetDayPrevious]);
export const startViews = ['calendar', 'yearGrid', 'monthGrid'] as const;
export const picker = ['calendar', 'year', 'month'] as const;
export const weekNumberTemplate = 'Week %s' as const;
export const maxMonthDays = 31;
export const YEAR = 'year';
export const MONTH = 'month';
