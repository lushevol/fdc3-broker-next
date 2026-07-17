import { APPEARANCE_CONTRACT_VERSION } from '@fm/platform-contracts-poc';
import {
  APPEARANCE_STORAGE_KEY,
  DEFAULT_APPEARANCE,
  persistAppearance,
  readStoredAppearance,
} from './appearance';

describe('host appearance persistence', () => {
  it('uses deterministic defaults for missing, invalid, and incompatible values', () => {
    expect(readStoredAppearance({ getItem: () => null })).toEqual(DEFAULT_APPEARANCE);
    expect(readStoredAppearance({ getItem: () => '{broken' })).toEqual(DEFAULT_APPEARANCE);
    expect(readStoredAppearance({ getItem: () => JSON.stringify({ scheme: 'sepia' }) })).toEqual(
      DEFAULT_APPEARANCE,
    );
  });

  it('reads and writes a valid complete snapshot', () => {
    const appearance = {
      ...DEFAULT_APPEARANCE,
      scheme: 'light' as const,
      preference: 'light' as const,
      density: 'comfortable' as const,
      contractVersion: APPEARANCE_CONTRACT_VERSION,
    };
    expect(readStoredAppearance({ getItem: () => JSON.stringify(appearance) })).toEqual(appearance);
    const setItem = jest.fn();
    persistAppearance({ setItem }, appearance);
    expect(setItem).toHaveBeenCalledWith(APPEARANCE_STORAGE_KEY, JSON.stringify(appearance));
  });
});
