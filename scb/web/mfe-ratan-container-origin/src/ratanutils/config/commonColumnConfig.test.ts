import { getDateColumnCommonDefs } from './commonColumnConfig';

test("getDateColumnCommonDefs", () => {
  const sort = getDateColumnCommonDefs('field1');
  const result = sort.comparator('2023 May 5', '2023 Aug 23');
  expect(result).toEqual(-9504000000);
})