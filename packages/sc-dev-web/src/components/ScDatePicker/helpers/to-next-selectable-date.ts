import { toUTCDate } from './to-utc-date.js';

import { navigationKeySetDayNext, navigationKeySetDayPrevious } from '../constants.js';
import type { InferredFromSet } from '../typings.js';
import { toDayDiffInclusive } from './to-day-diff-inclusive.js';
import type { ToNextSelectableDateInit } from './typings.js';
import { getDate } from './get-date.js';

export function toNextSelectableDate({
  date,
  disabledDatesSet,
  disabledDaysSet,
  key,
  maxTime,
  minTime,
}: ToNextSelectableDateInit): Date {
  // Bail when there is no valid date range (<= 1 day).
  if (toDayDiffInclusive(minTime, maxTime) <= 1) return date;

  const focusedDateTime = +date;

  let isBeforeMinTime = focusedDateTime < minTime;
  let iaAfterMaxTime = focusedDateTime > maxTime;
  let isDisabledDay =
    isBeforeMinTime ||
    iaAfterMaxTime ||
    disabledDaysSet.has((date as Date).getDay()) ||
    disabledDatesSet.has(focusedDateTime);

  if (!isDisabledDay) return date;

  let newSelectableDate = isBeforeMinTime === iaAfterMaxTime ?
    date : getDate(isBeforeMinTime ? minTime - 864e5 : 864e5 + maxTime);
  let newSelectableDateTime = +newSelectableDate;

  const fy = newSelectableDate.getFullYear();
  const m = newSelectableDate.getMonth();
  let d = newSelectableDate.getDate();

  while (isDisabledDay) {
    if (isBeforeMinTime || (
      !iaAfterMaxTime && navigationKeySetDayNext.has(key as InferredFromSet<typeof navigationKeySetDayNext>))
    ) d += 1;
    if (iaAfterMaxTime || (
      !isBeforeMinTime && navigationKeySetDayPrevious.has(key as InferredFromSet<typeof navigationKeySetDayPrevious>))
    ) d -= 1;

    newSelectableDate = toUTCDate(fy, m, d);
    newSelectableDateTime = +newSelectableDate;

    if (!isBeforeMinTime) {
      isBeforeMinTime = newSelectableDateTime < minTime;

      if (isBeforeMinTime) {
        newSelectableDate = getDate(minTime);
        d = newSelectableDate.getDate();
      }
    }

    if (!iaAfterMaxTime) {
      iaAfterMaxTime = newSelectableDateTime > maxTime;

      if (iaAfterMaxTime) {
        newSelectableDate = getDate(maxTime);
        d = newSelectableDate.getDate();
      }
    }

    isDisabledDay =
      disabledDaysSet.has(newSelectableDate.getDay()) ||
      disabledDatesSet.has(+newSelectableDate);
  }

  return newSelectableDate;
}
