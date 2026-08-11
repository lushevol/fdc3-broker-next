import { expect } from '@jest/globals';
import dayjs from 'dayjs/esm/index.js';

import { toDateString } from '../../../../src/components/ScDatePicker/helpers/to-date-string.js';

describe(toDateString.name, () => {
  it('returns date string', () => {
    const testDateStr = '2020-02-02';
    const result = toDateString(dayjs(testDateStr).toDate());
    expect(result).toBe(testDateStr);

    const result2 = toDateString(dayjs(testDateStr).toDate(), 'year');
    expect(result2).toBe('2020');

    const result3 = toDateString(dayjs(testDateStr).toDate(), 'month');
    expect(result3).toBe('2020-02');

  });

  it.each([
    { year: -38, expected: '-38-04-09' },
    { year: -8, expected: '-8-04-09' },
    { year: -1, expected: '-1-04-09' },
    { year: 0, expected: '0-04-09' },
    { year: 1, expected: '1-04-09' },
    { year: 8, expected: '8-04-09' },
    { year: 28, expected: '28-04-09' },
  ])('serializes extended year correctly ($year)', ({ year, expected }) => {
    const date = new Date(0, 3, 9);
    date.setFullYear(year);

    expect(toDateString(date)).toBe(expected);
  });

  it.each([
    { year: 1000, expected: '08 Jul 1000 04:00:00' },
    { year: 999, expected: '08 Jul 0999 04:00:00' },
    { year: 88, expected: '08 Jul 0088 04:00:00' },
    { year: 6, expected: '08 Jul 0006 04:00:00' },
    { year: 0, expected: '08 Jul 0000 04:00:00' },
    { year: -1, expected: '08 Jul -0001 04:00:00' },
    { year: -22, expected: '08 Jul -0022 04:00:00' },
    { year: -333, expected: '08 Jul -0333 04:00:00' },
    { year: -1234, expected: '08 Jul -1234 04:00:00' },
    { year: -12345, expected: '08 Jul -12345 04:00:00' },
  ])('formats show-time with exact year correctly ($year)', ({ year, expected }) => {
    const date = new Date(0, 6, 8, 4, 0, 0);
    date.setFullYear(year);

    expect(toDateString(date, undefined, true, { format: 'DD MMM YYYY HH:mm:ss' })).toBe(expected);
  });
  it('returns valid time string when showTime is enabled', () => {
    const date = dayjs('2026-07-06 03:00:00', 'YYYY-MM-DD HH:mm:ss').toDate();
    const result = toDateString(date, 'calendar', true, { format: 'YYYY-MM-DD HH:mm:ss' });

    expect(result).toBe('2026-07-06 03:00:00');
  });

});
