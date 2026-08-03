import { expect } from '@jest/globals';

// eslint-disable-next-line max-len
import { nullishAttributeConverter } from '../../../../src/components/ScDatePicker/helpers/nullish-attribute-converter.js';

describe(nullishAttributeConverter.name, () => {
  test.each<{
    $_value: string | undefined;
    value: unknown;
  }>([
    {
      $_value: undefined,
      value: null,
    },
    {
      $_value: undefined,
      value: undefined,
    },
    {
      $_value: undefined,
      value: '',
    },
    {
      $_value: 'test',
      value: 'test',
    },
  ])('returns normalized attribute value (value=$value)', ({
    $_value,
    value,
  }) => {
    const result = nullishAttributeConverter(value);

    expect(result).toBe($_value);
  });

});
