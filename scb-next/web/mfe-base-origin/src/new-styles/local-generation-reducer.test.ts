import { getHooksBase } from '../hooks/HooksBase';
import { initialData } from '../hooks/model/root';
import { reducers } from '../hooks/reducer';
import { ActionType } from '../hooks/reducer/util/ActionType';
import { LOCAL_PORTAL_GENERATION_ACTION } from './local-generation-contract';

describe('local appearance state integration', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it.each([true, false])('switches only appearance and forwards newStyles=%s to existing bridges', (newStyles) => {
    const before = {
      ...initialData, newStyles: !newStyles, token: 'existing-session', refreshToken: 'existing-refresh',
      user: { id: 'existing-user' }, expiredIn: 3600, iat: 12345, userLoginTime: new Date(),
      theme: 'dark', timeType: 'utc',
    };
    const result = reducers(before, {
      type: LOCAL_PORTAL_GENERATION_ACTION,
      data: { newStyles, token: 'unrelated-value' },
    });
    expect(result).toEqual({ ...before, newStyles });
    expect(getHooksBase().store).toEqual(result);
    expect(before.newStyles).toBe(!newStyles);
  });

  it('preserves existing action semantics and ignores an incomplete appearance request', () => {
    const before = { ...initialData, newStyles: true };
    expect(reducers(before, { type: LOCAL_PORTAL_GENERATION_ACTION, data: {} })).toEqual(before);
    expect(reducers(before, { type: ActionType.SET_THEME, data: { theme: 'light', newStyles: false } }))
      .toEqual({ ...before, theme: 'light' });
  });

  it('ignores local actions in production', () => {
    vi.stubEnv('DEV', false);
    const before = { ...initialData, newStyles: false };
    expect(reducers(before, { type: LOCAL_PORTAL_GENERATION_ACTION, data: { newStyles: true } }))
      .toEqual(before);
  });

  it('ignores local actions on nonlocal development hosts', () => {
    vi.stubGlobal('window', new Proxy(window, {
      get(target, key) {
        return key === 'location' ? new URL('https://portal.example.com/') : Reflect.get(target, key, target);
      },
    }));
    const before = { ...initialData, newStyles: false };
    expect(reducers(before, { type: LOCAL_PORTAL_GENERATION_ACTION, data: { newStyles: true } }))
      .toEqual(before);
  });
});
