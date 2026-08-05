import { expect } from '@jest/globals';

import { toNextSelectableDate } from '../../../../src/components/ScDatePicker/helpers/to-next-selectable-date.js';
import type { ToNextSelectableDateInit } from '../../../../src/components/ScDatePicker/helpers/typings';
import { getDate } from '../../../../src/components/ScDatePicker/helpers/get-date.js';

describe(toNextSelectableDate.name, () => {
  const defaultInit: ToNextSelectableDateInit = {
    date: getDate('2020-02-02'),
    disabledDatesSet: new Set(),
    disabledDaysSet: new Set(),
    key: 'ArrowRight',
    maxTime: +getDate('2020-03-03'),
    minTime: +getDate('2020-01-01'),
  };

  test.each<{
    $_value: Date;
    partialInit: Partial<ToNextSelectableDateInit>;
  }>([
    {
      $_value: getDate('2020-02-02'),
      partialInit: {},
    },
    {
      $_value: getDate('2020-02-02'),
      partialInit: {
        maxTime: +getDate('2020-02-02'),
        minTime: +getDate('2020-02-02'),
      },
    },
  ])('returns next selectable date for non-disabled date ($partialInit)', ({
    $_value,
    partialInit,
  }) => {
    const result = toNextSelectableDate({
      ...defaultInit,
      ...partialInit,
    });

    expect(result).toEqual($_value);
  });

  test.each<{
    $_value: Date;
    partialInit: Partial<ToNextSelectableDateInit>;
  }>([
    // disabled dates to non-disabled dates
    {
      $_value: getDate('2020-02-01'),
      partialInit: {
        disabledDatesSet: new Set([+getDate('2020-02-02')]),
        key: 'ArrowLeft',
      },
    },
    {
      $_value: getDate('2020-02-03'),
      partialInit: {
        disabledDatesSet: new Set([+getDate('2020-02-02')]),
        key: 'ArrowRight',
      },
    },

    // > 1 disabled dates to non-disabled dates
    {
      $_value: getDate('2020-01-31'),
      partialInit: {
        disabledDatesSet: new Set([
          +getDate('2020-02-01'),
          +getDate('2020-02-02'),
        ]),
        key: 'ArrowLeft',
      },
    },
    {
      $_value: getDate('2020-02-04'),
      partialInit: {
        disabledDatesSet: new Set([
          +getDate('2020-02-02'),
          +getDate('2020-02-03'),
        ]),
        key: 'ArrowRight',
      },
    },

    // > 1 disabled dates to non-disabled dates with min/ max dates
    {
      $_value: getDate('2020-01-31'),
      partialInit: {
        disabledDatesSet: new Set([
          +getDate('2020-02-01'),
          +getDate('2020-02-02'),
        ]),
        key: 'ArrowLeft',
        minTime: +getDate('2020-01-31'),
      },
    },
    {
      $_value: getDate('2020-02-04'),
      partialInit: {
        disabledDatesSet: new Set([
          +getDate('2020-02-02'),
          +getDate('2020-02-03'),
        ]),
        key: 'ArrowRight',
        maxTime: +getDate('2020-02-04'),
      },
    },

    // disabled date before min to min
    {
      $_value: getDate(defaultInit.minTime),
      partialInit: {
        date: getDate('2019-02-02'),
        key: 'ArrowLeft',
      },
    },
    {
      $_value: getDate(defaultInit.minTime),
      partialInit: {
        date: getDate('2019-02-02'),
        key: 'ArrowRight',
      },
    },

    // disabled date after max to max
    {
      $_value: getDate(defaultInit.maxTime),
      partialInit: {
        date: getDate('2020-04-03'),
        key: 'ArrowRight',
      },
    },
    {
      $_value: getDate(defaultInit.maxTime),
      partialInit: {
        date: getDate('2020-04-03'),
        key: 'ArrowLeft',
      },
    },

    // disabled min/ max to non-disabled date after/ before min/ max
    {
      $_value: getDate('2020-02-02'),
      partialInit: {
        date: getDate('2020-02-01'),
        disabledDatesSet: new Set([
          +getDate('2020-02-01'),
        ]),
        key: 'ArrowLeft',
        minTime: +getDate('2020-02-01'),
      },
    },
    {
      $_value: getDate('2020-04-02'),
      partialInit: {
        date: getDate('2020-04-03'),
        disabledDatesSet: new Set([
          +getDate('2020-04-03'),
        ]),
        key: 'ArrowRight',
        maxTime: +getDate('2020-04-03'),
      },
    },

    // disabled max to non-disabled min
    {
      $_value: getDate('2020-04-02'),
      partialInit: {
        date: getDate('2020-04-03'),
        disabledDatesSet: new Set([
          +getDate('2020-04-03'),
        ]),
        key: 'ArrowRight',
        maxTime: +getDate('2020-04-03'),
        minTime: +getDate('2020-04-02'),
      },
    },
  ])('returns next selectable date for disabled date ($partialInit)', ({
    $_value,
    partialInit,
  }) => {
    const result = toNextSelectableDate({
      ...defaultInit,
      ...partialInit,
    });

    expect(result).toEqual($_value);
  });

});
