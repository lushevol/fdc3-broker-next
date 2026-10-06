import {
  DEFAULT_STYLE_SETTINGS,
  STYLE_STORAGE_KEY,
  isLocalStylingConsole,
  normalizeStyleSettings,
  readStyleSettings,
  saveStyleSettings,
} from './settings';

describe('local development style settings', () => {
  beforeEach(() => sessionStorage.clear());

  it.each(['localhost', '127.0.0.1', '[::1]', '::1'])('allows local development on %s', (host) => {
    expect(isLocalStylingConsole(true, host)).toBe(true);
    expect(isLocalStylingConsole(false, host)).toBe(false);
  });

  it('excludes nonlocal hosts even in development', () => {
    expect(isLocalStylingConsole(true, 'portal.example.com')).toBe(false);
    expect(isLocalStylingConsole(true, 'localhost.example.com')).toBe(false);
  });

  it('starts with Portal application off and preserves safe partial values', () => {
    expect(readStyleSettings(sessionStorage)).toEqual(DEFAULT_STYLE_SETTINGS);
    expect(normalizeStyleSettings({ fontSize: 18, primaryColor: '#123ABC' })).toEqual({
      ...DEFAULT_STYLE_SETTINGS, fontSize: 18, primaryColor: '#123abc',
    });
  });

  it('bounds numeric values and rejects unsupported or nonfinite values', () => {
    expect(normalizeStyleSettings({ fontSize: 100, radius: -5 })).toMatchObject({ fontSize: 20, radius: 0 });
    expect(normalizeStyleSettings({ fontSize: 1, radius: 100 })).toMatchObject({ fontSize: 10, radius: 16 });
    expect(normalizeStyleSettings({
      fontSize: NaN, radius: Infinity, primaryColor: 'red', fontFamily: 'url(bad)',
      mode: 'sepia', designGeneration: 'unknown', applyToPortal: 'yes', controlSize: 'huge',
    })).toEqual(DEFAULT_STYLE_SETTINGS);
    expect(normalizeStyleSettings(null)).toEqual(DEFAULT_STYLE_SETTINGS);
  });

  it('reloads only the separate versioned style settings', () => {
    sessionStorage.setItem('theme', 'dark');
    sessionStorage.setItem('workspaces', '["existing"]');
    const settings = { ...DEFAULT_STYLE_SETTINGS, applyToPortal: true, fontSize: 16 };
    saveStyleSettings(sessionStorage, settings);
    expect(readStyleSettings(sessionStorage)).toEqual(settings);
    saveStyleSettings(sessionStorage, DEFAULT_STYLE_SETTINGS);
    expect(sessionStorage.getItem(STYLE_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem('theme')).toBe('dark');
    expect(sessionStorage.getItem('workspaces')).toBe('["existing"]');
  });

  it.each(['broken json', '{"version":2,"settings":{"fontSize":18}}'])('ignores corrupt or obsolete storage %s', (raw) => {
    sessionStorage.setItem(STYLE_STORAGE_KEY, raw);
    expect(readStyleSettings(sessionStorage)).toEqual(DEFAULT_STYLE_SETTINGS);
  });

  it('stays usable when browser storage is blocked', () => {
    const blocked = {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
      removeItem: () => { throw new Error('blocked'); },
    };
    expect(readStyleSettings(blocked)).toEqual(DEFAULT_STYLE_SETTINGS);
    expect(() => saveStyleSettings(blocked, { ...DEFAULT_STYLE_SETTINGS, fontSize: 18 })).not.toThrow();
    expect(() => saveStyleSettings(blocked, DEFAULT_STYLE_SETTINGS)).not.toThrow();
  });
});
