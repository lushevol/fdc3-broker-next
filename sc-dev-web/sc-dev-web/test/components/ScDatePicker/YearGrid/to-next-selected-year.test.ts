import { expect } from '@jest/globals';
import dayjs from 'dayjs/esm/index.js';

import { toNextSelectedYear } from '../../../../src/components/ScDatePicker/YearGrid/to-next-selected-year.js';
import type { ToNextSelectableYearInit } from '../../../../src/components/ScDatePicker/YearGrid/typings';

describe(toNextSelectedYear.name, () => {
  const defaultInit: ToNextSelectableYearInit = {
    key: 'ArrowUp',
    max: dayjs('2021-01-02').toDate(),
    min: dayjs('2019-01-02').toDate(),
    year: 2020,
  };
  const defaultInitWithGrid: ToNextSelectableYearInit = {
    key: 'ArrowUp',
    max: dayjs('2032-01-02').toDate(),
    min: dayjs('2017-01-02').toDate(),
    year: 2022,
  };

  test.each<{
    $_value: number;
    partialInit: Partial<ToNextSelectableYearInit>;
  }>([
    // cap at min or max
    {
      $_value: defaultInit.min.getFullYear(),
      partialInit: {},
    },
    {
      $_value: defaultInit.max.getFullYear(),
      partialInit: { key: 'ArrowDown' },
    },
    {
      $_value: defaultInit.min.getFullYear(),
      partialInit: { key: 'ArrowLeft' },
    },
    {
      $_value: defaultInit.max.getFullYear(),
      partialInit: { key: 'ArrowRight' },
    },
    {
      $_value: defaultInit.max.getFullYear(),
      partialInit: { key: 'End' },
    },
    {
      $_value: defaultInit.min.getFullYear(),
      partialInit: { key: 'Home' },
    },
    {
      $_value: defaultInit.year,
      partialInit: { key: ' ' },
    },

    // within min and max
    {
      $_value: defaultInitWithGrid.year - 4,
      partialInit: { ...defaultInitWithGrid },
    },
    {
      $_value: defaultInitWithGrid.year + 4,
      partialInit: { ...defaultInitWithGrid, key: 'ArrowDown' },
    },
    {
      $_value: defaultInitWithGrid.year - 1,
      partialInit: { ...defaultInitWithGrid, key: 'ArrowLeft' },
    },
    {
      $_value: defaultInitWithGrid.year + 1,
      partialInit: { ...defaultInitWithGrid, key: 'ArrowRight' },
    },
    {
      $_value: defaultInitWithGrid.max.getFullYear(),
      partialInit: { ...defaultInitWithGrid, key: 'End' },
    },
    {
      $_value: defaultInitWithGrid.min.getFullYear(),
      partialInit: { ...defaultInitWithGrid, key: 'Home' },
    },
    {
      $_value: defaultInitWithGrid.year,
      partialInit: { ...defaultInitWithGrid, key: ' ' },
    },
  ])('returns next selected year (init=$partialInit)', ({
    $_value,
    partialInit,
  }) => {
    const result = toNextSelectedYear({
      ...defaultInit,
      ...partialInit,
    });

    expect(result).toBe($_value);
  });

});
