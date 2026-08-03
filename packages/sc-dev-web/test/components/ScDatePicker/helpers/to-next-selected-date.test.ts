import { expect } from '@jest/globals';

import { toNextSelectedDate } from '../../../../src/components/ScDatePicker/helpers/to-next-selected-date.js';
import type { ToNextSelectedDateInit } from '../../../../src/components/ScDatePicker/helpers/typings';
import { getDate } from '../../../../src/components/ScDatePicker/helpers/get-date.js';

describe(toNextSelectedDate.name, () => {
  const defaultInit: ToNextSelectedDateInit = {
    currentDate: getDate('2020-02-02'),
    date: getDate('2020-02-02'),
    disabledDatesSet: new Set(),
    disabledDaysSet: new Set(),
    hasAltKey: false,
    key: 'ArrowRight',
    maxTime: +getDate('2020-01-01'),
    minTime: +getDate('2020-03-03'),
  };

  test.each<{
    $_value: Date;
    partialInit: Partial<ToNextSelectedDateInit>;
  }>([
    // all supported keys
    {
      $_value: defaultInit.date,
      partialInit: { key: ' ' },
    },
    {
      $_value: getDate('2020-02-09'),
      partialInit: { key: 'ArrowDown' },
    },
    {
      $_value: getDate('2020-02-01'),
      partialInit: { key: 'ArrowLeft' },
    },
    {
      $_value: getDate('2020-02-03'),
      partialInit: { key: 'ArrowRight' },
    },
    {
      $_value: getDate('2020-01-26'),
      partialInit: { key: 'ArrowUp' },
    },
    {
      $_value: getDate('2020-02-29'),
      partialInit: { key: 'End' },
    },
    {
      $_value: defaultInit.date,
      partialInit: { key: 'Enter' },
    },
    {
      $_value: getDate('2020-02-01'),
      partialInit: { key: 'Home' },
    },
    {
      $_value: getDate('2020-03-02'),
      partialInit: { key: 'PageDown' },
    },
    {
      $_value: getDate('2020-01-02'),
      partialInit: { key: 'PageUp' },
    },
    {
      $_value: getDate('2021-02-02'),
      partialInit: { hasAltKey: true, key: 'PageDown' },
    },
    {
      $_value: getDate('2019-02-02'),
      partialInit: { hasAltKey: true, key: 'PageUp' },
    },
    {
      $_value: getDate('2020-01-02'),
      partialInit: { key: 'PageUp' },
    },
    {
      $_value: defaultInit.date,
      partialInit: { key: 'Tab' },
    },

    // not in current month
    {
      $_value: getDate('2020-03-01'),
      partialInit: { currentDate: getDate('2020-03-03') },
    },

    // maxTime + next navigation key
    {
      $_value: getDate('2020-02-02'),
      partialInit: { key: 'ArrowRight', maxTime: +getDate('2020-02-02') },
    },

    // minTime + previous navigation key
    {
      $_value: getDate('2020-02-02'),
      partialInit: { key: 'ArrowLeft', minTime: +getDate('2020-02-02') },
    },

    // in leap year, 2020-01-31 to next month to 2020-02-29 from 2020-02-31
    {
      $_value: getDate('2020-02-29'),
      partialInit: { currentDate: getDate('2020-01-01'), date: getDate('2020-01-31'), key: 'PageDown' },
    },

    // in leap year, 2020-02-29 to next year to 2021-02-28 from 2021-02-29
    {
      $_value: getDate('2021-02-28'),
      partialInit: { 
        currentDate: getDate('2020-02-01'), 
        date: getDate('2020-02-29'), 
        hasAltKey: true, 
        key: 'PageDown', 
      },
    },
  ])('returns next selected date (partialInit=$partialInit)', ({
    $_value,
    partialInit,
  }) => {
    const result = toNextSelectedDate({
      ...defaultInit,
      ...partialInit,
    });

    expect(result).toEqual($_value);
  });

});
