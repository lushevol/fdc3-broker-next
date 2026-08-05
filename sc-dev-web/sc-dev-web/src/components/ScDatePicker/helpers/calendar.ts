import { getWeekNumber } from './get-week-number.js';
import { normalizeWeekday } from './normalize-weekday.js';
import { toUTCDate } from './to-utc-date.js';
import { toValidWeekday } from './to-valid-weekday.js';
import { getDate } from './get-date.js';

export function calendar(init: any) {
  const { 
    date, 
    dayFormat, 
    disabledDates = [], 
    disabledDays = [],
    firstDayOfWeek = 0, 
    fullDateFormat, 
    locale = 'en-US', 
    max, 
    min, 
    showWeekNumber = false, 
    weekNumberTemplate = 'Week %s', 
    weekNumberType = 'first-4-day-week', 
  } = init || {};
  const firstDayOfWeek2 = toValidWeekday(firstDayOfWeek);
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();
  const firstDateOfMonth = toUTCDate(dateYear, dateMonth, 1);
  const disabledDaysSet = new Set(disabledDays.map((n: any) => normalizeWeekday(n, firstDayOfWeek2, showWeekNumber)));
  const disabledDatesSet = new Set(disabledDates.map((n: any) => +n));

  const calendarKey = [
    firstDateOfMonth.toJSON(),
    firstDayOfWeek2,
    locale,
    null == max ? '' : max.toJSON(), // eslint-disable-line
    null == min ? '' : min.toJSON(), // eslint-disable-line
    Array.from(disabledDaysSet).join(','),
    Array.from(disabledDatesSet).join(','),
    weekNumberType,
  ].filter(Boolean).join(':');
  const firstDayOfWeekOffset = normalizeWeekday(firstDateOfMonth.getDay(), firstDayOfWeek2, showWeekNumber);
  const minTime = null == min ? +getDate('2000-01-01') : +min; // eslint-disable-line
  const maxTime = null == max ? +getDate('2100-12-31') : +max; // eslint-disable-line
  const colNum = showWeekNumber ? 8 : 7;
  const totalDays = toUTCDate(dateYear, 1 + dateMonth, 0).getDate();

  const rows = [];
  let cols = [];
  let calendarComplete = false;
  let curDay = 1;
  for (const row of [0, 1, 2, 3, 4, 5]) {
    for (const col of ([0, 1, 2, 3, 4, 5, 6].concat(colNum === 7 ? [] : [7]))) {
      const idx = col + (row * colNum);
      if (!calendarComplete && showWeekNumber && col === 0) {
        const weekNumberOffset = row < 1 ? firstDayOfWeek2 : 0;
        const weekNumber = getWeekNumber(weekNumberType, toUTCDate(dateYear, dateMonth, curDay - weekNumberOffset));
        const weekLabel = weekNumberTemplate.replace('%s', String(weekNumber));
        cols.push({
          fullDate: null,
          label: weekLabel,
          value: `${weekNumber}`,
          key: `${calendarKey}:${weekLabel}`,
          disabled: true,
        });
        continue;
      }
      if (calendarComplete || idx < firstDayOfWeekOffset) {
        cols.push({
          fullDate: null,
          label: '',
          value: '',
          key: `${calendarKey}:${idx}`,
          disabled: true,
        });

        continue;
      }
      const curDate = toUTCDate(dateYear, dateMonth, curDay);
      const curTime = +curDate;
      const isDisabledDay = disabledDaysSet.has(col) ||
              disabledDatesSet.has(curTime) ||
              (curTime < minTime || curTime > maxTime);
      if (isDisabledDay)

        disabledDatesSet.add(curTime);
      cols.push({
        fullDate: curDate,
        label: fullDateFormat(curDate),
        value: dayFormat(curDate),
        key: `${calendarKey}:${curDate.toJSON()}`,
        disabled: isDisabledDay,
      });
      curDay += 1;
      if (curDay > totalDays)
        calendarComplete = true;
    }
    rows.push(cols);
    cols = [];
  }
  return {
    disabledDatesSet,
    calendar: rows,
    disabledDaysSet: new Set(disabledDays.map((n: any) => toValidWeekday(n))),
    key: calendarKey,
  };
}