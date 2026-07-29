import { getFormatter } from '../helpers/get-formatter.js';

import { DateTimeFormat } from '../constants.js';
import type { Formatters } from '../typings.js';

export function toFormatters(locale: string, timeZone?: string): Formatters {
  const dateFmt = DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone,
    weekday: 'short',
  });
  const dayFmt = DateTimeFormat(locale, { day: 'numeric', timeZone });
  const fullDateFmt = DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone,
    year: 'numeric',
  });
  const monthYearFmt = DateTimeFormat(locale, {
    month: 'long',
    timeZone,
    year: 'numeric',
  });
  const shortMonthYearFmt = DateTimeFormat(locale, {
    month: 'short',
    timeZone,
    year: 'numeric',
  });
  const longWeekdayFmt = DateTimeFormat(locale, { timeZone, weekday: 'long' });
  const monthFmt = DateTimeFormat(locale, { month: 'short', timeZone });
  const narrowWeekdayFmt = DateTimeFormat(locale, { timeZone, weekday: 'narrow' });
  const yearFmt = DateTimeFormat(locale, { timeZone, year: 'numeric' });

  return {
    dateFormat: getFormatter(dateFmt),
    dayFormat: getFormatter(dayFmt),
    fullDateFormat: getFormatter(fullDateFmt),
    locale,
    monthFormat: getFormatter(monthFmt),
    monthYearFormat: getFormatter(monthYearFmt),
    shortMonthYearFormat: getFormatter(shortMonthYearFmt),
    longWeekdayFormat: getFormatter(longWeekdayFmt),
    narrowWeekdayFormat: getFormatter(narrowWeekdayFmt),
    yearFormat: getFormatter(yearFmt),
  };
}
