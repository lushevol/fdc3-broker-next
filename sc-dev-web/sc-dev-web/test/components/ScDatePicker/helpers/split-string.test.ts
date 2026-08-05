import { expect } from '@jest/globals';

import { splitString } from '../../../../src/components/ScDatePicker/helpers/split-string.js';

describe(splitString.name, () => {
  const str = 'hello, world, everyone';
  const expected = str.split(/,\s*/);

  test.each<{
    $_value: string[];
    source: string;
  }>([
    {
      $_value: [],
      source: '',
    },
    {
      $_value: expected,
      source: str,
    },
  ])('splits string ($source)', ({
    $_value,
    source,
  }) => {
    const result = splitString(source);

    expect(result).toEqual($_value);
  });

});
