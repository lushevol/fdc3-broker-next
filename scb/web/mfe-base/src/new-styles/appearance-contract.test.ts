import {
  createInitialAppearance,
  readStandaloneAppearance,
  resolveFederatedAppearance,
} from './appearance';

describe('appearance integration contract', () => {
  it('normalizes standalone flags without choosing a different workspace mode', () => {
    expect(readStandaloneAppearance('')).toEqual({ newStyles: true, loginAppearance: 'light' });
    expect(readStandaloneAppearance('?new-styles=true&login-theme=dark')).toEqual({
      newStyles: true,
      loginAppearance: 'dark',
    });
    expect(readStandaloneAppearance('?new-styles=false&login-theme=invalid')).toEqual({
      newStyles: false,
      loginAppearance: 'light',
    });
  });

  it('keeps embedded defaults and explicit appearance inputs', () => {
    expect(createInitialAppearance({ version: 'root' })).toEqual({
      rootVersion: 'root',
      newStyles: true,
      loginAppearance: undefined,
    });
    expect(createInitialAppearance({ newStyles: true, loginAppearance: 'dark' })).toEqual({
      rootVersion: undefined,
      newStyles: true,
      loginAppearance: 'dark',
    });
  });

  it('preserves an explicit embedded Legacy appearance', () => {
    expect(createInitialAppearance({ newStyles: false })).toEqual({
      rootVersion: undefined, newStyles: false, loginAppearance: undefined,
    });
  });

  it('forwards an explicit supported package appearance to remote hosts', () => {
    expect(resolveFederatedAppearance({ theme: 'light', newStyles: true })).toEqual({
      mode: 'light',
      designGeneration: 'webkit',
    });
    expect(resolveFederatedAppearance({ theme: 'dark' })).toEqual({
      mode: 'dark',
      designGeneration: 'legacy',
    });
    expect(resolveFederatedAppearance({})).toEqual({ mode: 'dark', designGeneration: 'legacy' });
  });
});
