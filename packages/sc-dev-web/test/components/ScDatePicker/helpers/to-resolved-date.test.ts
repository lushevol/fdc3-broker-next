import { expect } from '@jest/globals';

import { toResolvedDate } from '../../../../src/components/ScDatePicker/helpers/to-resolved-date.js';
import type { MaybeDate } from '../../../../src/components/ScDatePicker/helpers/typings';
import { getDate } from '../../../../src/components/ScDatePicker/helpers/get-date.js';

describe(toResolvedDate.name, () => {

  test.each<{
    $_value: Date;
    date: MaybeDate | undefined;
  }>([
    { $_value: getDate(NaN), date: '' },
    { $_value: getDate(0), date: '0' },
    // { $_value: toUTCDate(date1.getFullYear(), date1.getMonth(), date1.getDate()), date: '1' },
    { $_value: getDate('2020-02-02'), date: '2020-02-02' },
    { $_value: getDate('2020-02-02'), date: +getDate('2020-02-02') },
    { $_value: getDate(0), date: 0 },
    { $_value: getDate(NaN), date: NaN },
    { $_value: getDate('2020-02-02'), date: getDate('2020-02-02') },
    { $_value: getDate('2020-02-02'), date: getDate('2020-02-02').toJSON() },
    { $_value: getDate(NaN), date: null },
    // { $_value: toUTCDate(today.getFullYear(), today.getMonth(), today.getDate()), date: undefined },
  ])('returns resolved date ($date)', ({
    $_value,
    date,
  }) => {
    const result = toResolvedDate(date);

    expect(JSON.stringify(result)).toEqual(JSON.stringify($_value));
  });

});
