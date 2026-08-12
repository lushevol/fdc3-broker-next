import * as filteringData from './filteringData';

test('convertDate', () => {
  expect(filteringData.convertDate(1594006198764)).toEqual(1594006198764);

  const timeString = new Date('2020-09-23');
  expect(filteringData.convertDate('2020-09-23')).toEqual(timeString);
});

test('operating', () => {
  expect(filteringData.operating(123, 'EQ', 123)).toEqual(true);
  expect(filteringData.operating(123, 'NE', 1234)).toEqual(true);
  expect(filteringData.operating('1234', 'LIKE', '123')).toEqual(true);
  expect(filteringData.operating(123, 'LTE', 1234)).toEqual(true);
  expect(filteringData.operating(1234, 'GTE', 123)).toEqual(true);
  expect(filteringData.operating(1594006198764, 'BET', [1594006198000, 1594006199000])).toEqual(true);
  expect(filteringData.operating(1594006198764, 'ONORBEFORE', 1594006199000)).toEqual(true);
  expect(filteringData.operating(1594006199000, 'ONORLATER', 1594006198764)).toEqual(true);
  expect(filteringData.operating('123', 'IN', '1234')).toEqual(true);
  expect(filteringData.operating('1234', 'NOTIN', '123')).toEqual(true);
  expect(filteringData.operating(1234, 'LIMIT', 123)).toEqual(true);
});

test('filtering', () => {
  expect(filteringData.filtering(['a'], [])).toEqual(['a']);
  const data = [{ a: 'test' }];
  expect(
    JSON.stringify(filteringData.filtering(data, [{ field: 'a', operator: 'EQ', values: 'test' }]))
  ).toEqual(JSON.stringify(data));
  expect(
    JSON.stringify(filteringData.filtering(data, [{ field: 'a', operator: 'EQ', values: 'test2' }]))
  ).toEqual('[]');
});
