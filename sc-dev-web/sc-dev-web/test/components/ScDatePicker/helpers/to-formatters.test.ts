import { expect } from '@jest/globals';

import { toFormatters } from '../../../../src/components/ScDatePicker/helpers/to-formatters.js';
import type { Formatters } from '../../../../src/components/ScDatePicker/typings';

describe(toFormatters.name, () => {
  it('returns formatters', () => {
    const locale = 'en-US';
    const result = toFormatters(locale);

    expect(result).toHaveProperty('locale', locale);

    const props: (keyof Omit<Formatters, 'locale'>)[] = [
      'dateFormat',
      'dayFormat',
      'fullDateFormat',
      'monthFormat',
      'monthYearFormat',
      'shortMonthYearFormat',
      'longWeekdayFormat',
      'narrowWeekdayFormat',
      'yearFormat',
    ];

    props.forEach(
      n =>
        expect(result).toHaveProperty(n)
    );
  });

});
