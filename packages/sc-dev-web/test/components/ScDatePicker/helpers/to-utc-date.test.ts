import { toUTCDate } from '../../../../src/components/ScDatePicker/helpers/to-utc-date.js';

describe('toUTCDate', () => {
  it.each([
    { year: 99, month: 0, day: 1 },
    { year: 9, month: 0, day: 1 },
    { year: 1, month: 0, day: 1 },
    { year: 0, month: 0, day: 1 },
    { year: -1, month: 0, day: 1 },
    { year: -9, month: 0, day: 1 },
    { year: -99, month: 0, day: 1 },
    { year: -999, month: 0, day: 1 },
    { year: -888, month: 0, day: 1 },
    { year: 19999, month: 0, day: 1 },
  ])('keeps full year %o', ({ year, month, day }) => {
    const date = toUTCDate(year, month, day);
    expect(date.getFullYear()).toBe(year);
  });

  it('keeps provided time values', () => {
    const date = toUTCDate(99, 5, 6, 7, 8, 9);
    expect(date.getFullYear()).toBe(99);
    expect(date.getMonth()).toBe(5);
    expect(date.getDate()).toBe(6);
    expect(date.getHours()).toBe(7);
    expect(date.getMinutes()).toBe(8);
    expect(date.getSeconds()).toBe(9);
  });
});
