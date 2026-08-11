import { expect } from '@jest/globals';

import { isInCurrentMonth } from '../../../../src/components/ScDatePicker/helpers/is-in-current-month.js';

describe(isInCurrentMonth.name, () => {
  test.each<{
    $_value: boolean;
    source: Date;
    target: Date;
  }>([
    {
      $_value: true,
      source: new Date('2020-02-12'),
      target: new Date('2020-02-02'),
    },
    {
      $_value: false,
      source: new Date('2020-03-12'),
      target: new Date('2020-02-02'),
    },
  ])('returns if $target is current month of $source', ({
    $_value,
    source,
    target,
  }) => {
    const result = isInCurrentMonth(target, source);

    expect(result).toBe($_value);
  });

});
