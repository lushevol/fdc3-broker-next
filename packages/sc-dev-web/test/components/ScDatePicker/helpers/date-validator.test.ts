import { expect } from '@jest/globals';
import dayjs from 'dayjs/esm/index.js';
import { dateValidator } from '../../../../src/components/ScDatePicker/helpers/date-validator.js';
import type { DateValidatorResult, MaybeDate } from '../../../../src/components/ScDatePicker/helpers/typings';
import { getDate } from '../../../../src/components/ScDatePicker/helpers/get-date.js';

describe(dateValidator.name, () => {
  const date1 = dayjs(1).toDate();

  test.each<{
    $_value: DateValidatorResult;
    defaultDate: Date;
    value: MaybeDate;
  }>([
    {
      $_value: {
        date: getDate('2020-02-02'),
        isValid: false,
      },
      defaultDate: getDate('2020-02-02'),
      value: null,
    },
    {
      $_value: {
        date: getDate('2020-02-02'),
        isValid: true,
      },
      defaultDate: getDate('2020-02-02'),
      value: '2020-02-02',
    },
    {
      $_value: {
        date: getDate(0),
        isValid: true,
      },
      defaultDate: getDate(0),
      value: '0',
    },
    {
      $_value: {
        date: date1,
        isValid: true,
      },
      defaultDate: date1,
      value: '1',
    },
    {
      $_value: {
        date: getDate(0),
        isValid: true,
      },
      defaultDate: getDate(0),
      value: 0,
    },
    {
      $_value: {
        date: date1,
        isValid: true,
      },
      defaultDate: date1,
      value: 1,
    },
    {
      $_value: {
        date: getDate('2020-02-02'),
        isValid: true,
      },
      defaultDate: getDate('2020-02-02'),
      value: getDate('2020-02-02').getTime(),
    },
    {
      $_value: {
        date: getDate('2020-02-02'),
        isValid: true,
      },
      defaultDate: getDate('2020-02-02'),
      value: getDate('2020-02-02'),
    },
    {
      $_value: {
        date: getDate('2020-02-02'),
        isValid: true,
      },
      defaultDate: getDate('2020-02-02'),
      value: getDate('2020-02-02').toJSON(),
    },
  ])('validates date (value=$value, defaultDate=$defaultDate)', ({
    $_value,
    defaultDate,
    value,
  }) => {
    const result = dateValidator(value, defaultDate);
  
    expect(result).toEqual($_value);
  });

});
