import {
  createInitialAppearance,
  readStandaloneAppearance,
  resolveFederatedAppearance,
} from './appearance';

describe('appearance integration contract', () => {
  it('normalizes standalone flags without choosing a different workspace mode', () => {
    expect(readStandaloneAppearance('')).toEqual({ newStyles: false, loginAppearance: 'light' });
    expect(readStandaloneAppearance('?new-styles=true&login-theme=dark')).toEqual({
      newStyles: true,
      loginAppearance: 'dark',
    });
    expect(readStandaloneAppearance('?new-styles=TRUE&login-theme=invalid')).toEqual({
      newStyles: false,
      loginAppearance: 'light',
    });
  });

  it('keeps embedded defaults and explicit appearance inputs', () => {
    expect(createInitialAppearance({ version: 'root' })).toEqual({
      rootVersion: 'root',
      newStyles: false,
      loginAppearance: undefined,
    });
    expect(createInitialAppearance({ newStyles: true, loginAppearance: 'dark' })).toEqual({
      rootVersion: undefined,
      newStyles: true,
      loginAppearance: 'dark',
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
