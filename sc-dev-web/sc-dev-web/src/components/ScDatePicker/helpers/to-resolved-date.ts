import type { MaybeDate } from './typings.js';
import dayjs from 'dayjs/esm/index.js';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat/index.js';
import { getDate } from './get-date.js';

dayjs.extend(customParseFormat);

export function toResolvedDate(date?: MaybeDate): Date {
  /**
   * NOTE: Only allow undefined `date` so that calling function without any parameter will
   * always return today's date. Return `Invalid Date` object for all falsy values.
   *
   * Chrome returns valid date for new Date('0') while Firefox returns `Invalid Date`.
   * There's no problem parsing a number in both platforms. Try to parse input as number and
   * use that to construct date before proceeding to use original value.
   */
  const tryDate =
    typeof date === 'string' && date && !Number.isNaN(Number(date)) ?
      Number(date) :
      date;

  if (typeof tryDate === 'string') {
    return getDate(tryDate);
  }
  /**
   * FIXME(motss): Temporarily disabling the code coverage for this line as it is caused by
   * `wtr` not being able to generate the correct coverage report for this line which might be
   * caused by wrong sourcemap generated during the tests. But it is 100% covered by all the
   * written tests.
   */
  /* c8 ignore start */
  const dateDate = tryDate === undefined ?
  /* c8 ignore stop */
    dayjs(new Date().getTime()) :
    dayjs(tryDate === 0 ? 0 : tryDate === 1 ? 1 : (tryDate || NaN));

  return dateDate.toDate();
}