import {
  APPEARANCE_CONTRACT_VERSION,
  appearanceSnapshotSchema,
  type AppearanceSnapshot,
} from '@fm/platform-contracts';

export const APPEARANCE_STORAGE_KEY = 'fm.portal.appearance';
export const DEFAULT_APPEARANCE: AppearanceSnapshot = {
  scheme: 'dark', preference: 'dark', density: 'compact', locale: 'en-US', direction: 'ltr',
  contractVersion: APPEARANCE_CONTRACT_VERSION,
};

export function readStoredAppearance(storage: Pick<Storage, 'getItem'>): AppearanceSnapshot {
  const stored = storage.getItem(APPEARANCE_STORAGE_KEY);
  if (!stored) return DEFAULT_APPEARANCE;
  try {
    const result = appearanceSnapshotSchema.safeParse(JSON.parse(stored));
    return result.success ? result.data : DEFAULT_APPEARANCE;
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function persistAppearance(storage: Pick<Storage, 'setItem'>, value: AppearanceSnapshot) {
  storage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(value));
}
