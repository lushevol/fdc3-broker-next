import { getEnable } from './componentEnabling';

test('getEnable', () => {
  Object.defineProperty(window, 'ratanConfig', {
    value: {
      disabledFeature: []
    },
    writable: true
  });
  expect(getEnable('testFeature')).toEqual(true);
  Object.defineProperty(window, 'ratanConfig', {
    value: {
      disabledFeature: ['testFeature']
    },
    writable: true
  });
  expect(getEnable('testFeature')).toEqual(false);
});
