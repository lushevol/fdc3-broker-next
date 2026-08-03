import { getDate } from '../../../../src/components/ScDatePicker/helpers/get-date.js';

describe('getDate', () => {
  it.each([
    { input: '0099-06-06', expectedYear: 99 },
    { input: '0009-01-01', expectedYear: 9 },
    { input: '0001-01-01', expectedYear: 1 },
    { input: '0000-01-01', expectedYear: 0 },
    { input: '-0001-01-01', expectedYear: -1 },
    { input: '-0009-01-01', expectedYear: -9 },
    { input: '-0099-01-01', expectedYear: -99 },
    { input: '-0999-01-01', expectedYear: -999 },
    { input: '-0888-01-01', expectedYear: -888 },
    { input: '19999-01-01', expectedYear: 19999 },
  ])('parses year correctly: $input', ({ input, expectedYear }) => {
    const date = getDate(input);
    expect(date.getFullYear()).toBe(expectedYear);
  });

  it.each([
    { input: '19999', expectedYear: 19999 },
    { input: '99', expectedYear: 99 },
    { input: '9', expectedYear: 9 },
    { input: '1', expectedYear: 1 },
    { input: '0', expectedYear: 0 },
    { input: '-1', expectedYear: -1 },
    { input: '-9', expectedYear: -9 },
    { input: '-99', expectedYear: -99 },
    { input: '-999', expectedYear: -999 },
    { input: '-888', expectedYear: -888 },
  ])('parses year-only correctly: $input', ({ input, expectedYear }) => {
    const date = getDate(input);
    expect(date.getFullYear()).toBe(expectedYear);
  });

  it.each([
    { input: '08 Jul 1000 04:00:00', expectedYear: 1000 },
    { input: '08 Jul 0999 04:00:00', expectedYear: 999 },
    { input: '08 Jul 0088 04:00:00', expectedYear: 88 },
    { input: '08 Jul 0006 04:00:00', expectedYear: 6 },
    { input: '08 Jul 0000 04:00:00', expectedYear: 0 },
    { input: '08 Jul -0001 04:00:00', expectedYear: -1 },
    { input: '08 Jul -0022 04:00:00', expectedYear: -22 },
    { input: '08 Jul -0333 04:00:00', expectedYear: -333 },
    { input: '08 Jul -1234 04:00:00', expectedYear: -1234 },
    { input: '08 Jul -12345 04:00:00', expectedYear: -12345 },
  ])('parses display show-time value correctly: $input', ({ input, expectedYear }) => {
    const date = getDate(input);
    expect(date.getFullYear()).toBe(expectedYear);
  });

  it.each([
    { input: '2026-07-16 03:00', expectedHour: 3, expectedMinute: 0, expectedSecond: 0 },
    { input: '16 Jul 2026 03:00', expectedHour: 3, expectedMinute: 0, expectedSecond: 0 },
  ])('preserves HH:mm without seconds: $input', ({ input, expectedHour, expectedMinute, expectedSecond }) => {
    const date = getDate(input);
    expect(date.getHours()).toBe(expectedHour);
    expect(date.getMinutes()).toBe(expectedMinute);
    expect(date.getSeconds()).toBe(expectedSecond);
  });
});
