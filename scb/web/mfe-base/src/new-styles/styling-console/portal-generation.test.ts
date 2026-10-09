import { describe, expect, it, vi } from 'vitest';
import { createPortalGenerationUrl, switchPortalGeneration } from './portal-generation';
import { LOCAL_PORTAL_GENERATION_ACTION } from '../local-generation-contract';
import { DEFAULT_STYLE_SETTINGS, readStyleSettings, STYLE_STORAGE_KEY } from './settings';

describe('complete local Portal generation switching', () => {
  it.each(['legacy', 'webkit'] as const)('selects %s without losing unrelated URL state', (generation) => {
    const result = new URL(createPortalGenerationUrl(
      'http://localhost:8001/?show_normal_login=Y&survey=no&new-layout=true&new-styles=true#workspace',
      generation,
    ));
    expect(result.origin).toBe('http://localhost:8001');
    expect(result.searchParams.get('new-styles')).toBe(String(generation === 'webkit'));
    expect(result.searchParams.has('new-layout')).toBe(false);
    expect(result.searchParams.get('show_normal_login')).toBe('Y');
    expect(result.searchParams.get('survey')).toBe('no');
    expect(result.hash).toBe('#workspace');
  });

  it('disables preview and updates URL/state live without reloading the document', () => {
    const history = { state: { router: 'preserved' }, replaceState: vi.fn() };
    const dispatch = vi.fn(() => {
      expect(readStyleSettings(sessionStorage)).toEqual({
        ...DEFAULT_STYLE_SETTINGS, fontSize: 18, designGeneration: 'legacy', applyToPortal: false,
      });
    });
    const next = switchPortalGeneration('legacy', {
      ...DEFAULT_STYLE_SETTINGS, fontSize: 18, applyToPortal: true,
    }, { href: 'http://localhost:8001/?new-styles=true', history, dispatch, storage: sessionStorage });
    expect(history.replaceState).toHaveBeenCalledExactlyOnceWith(history.state, '', 'http://localhost:8001/?new-styles=false');
    expect(dispatch).toHaveBeenCalledExactlyOnceWith({ type: LOCAL_PORTAL_GENERATION_ACTION, data: { newStyles: false } });
    expect(next).toEqual(readStyleSettings(sessionStorage));
    sessionStorage.clear();
  });

  it('still switches when browser storage is unavailable or rejects writes', () => {
    const environment = {
      href: 'http://127.0.0.1:8001/',
      history: { state: null, replaceState: vi.fn() },
      dispatch: vi.fn(), storage: null,
    };
    switchPortalGeneration('webkit', DEFAULT_STYLE_SETTINGS, environment);
    expect(environment.history.replaceState).toHaveBeenCalledWith(null, '', 'http://127.0.0.1:8001/?new-styles=true');
    expect(environment.dispatch).toHaveBeenCalledWith({ type: LOCAL_PORTAL_GENERATION_ACTION, data: { newStyles: true } });
    const blocked = {
      setItem: vi.fn(() => { throw new Error('blocked'); }),
      removeItem: vi.fn(() => { throw new Error('blocked'); }),
    };
    switchPortalGeneration('legacy', DEFAULT_STYLE_SETTINGS, { ...environment, storage: blocked });
    expect(environment.dispatch).toHaveBeenCalledTimes(2);
    expect(blocked.setItem).toHaveBeenCalledWith(STYLE_STORAGE_KEY, expect.any(String));
    switchPortalGeneration('webkit', DEFAULT_STYLE_SETTINGS, { ...environment, storage: blocked });
    expect(environment.dispatch).toHaveBeenCalledTimes(3);
    expect(blocked.removeItem).toHaveBeenCalledWith(STYLE_STORAGE_KEY);
  });
});
