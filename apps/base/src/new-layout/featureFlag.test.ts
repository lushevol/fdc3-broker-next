jest.mock('../LegacyExperience', () => ({ __esModule: true, default: () => null }));
jest.mock('./NewLayoutExperience', () => ({ __esModule: true, default: () => null }));

import { isNewLayoutEnabled } from './index';

describe('new-layout feature flag', () => {
  it.each([
    ['', false],
    ['?new-layout=false', false],
    ['?new-layout=1', false],
    ['?new-layout=true', true],
    ['?other=value&new-layout=true', true],
  ])('resolves %s to %s', (search, expected) => {
    expect(isNewLayoutEnabled(search)).toBe(expected);
  });
});
