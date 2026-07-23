import type { Container } from '../../../hooks/model/workspaces';

export const SINGLE_VIEW_QUERY_PARAM = 'singleView';
const SINGLE_VIEW_STORAGE_PREFIX = 'mfe-base:single-view:';
const SINGLE_VIEW_VERSION = 1;
const SINGLE_VIEW_TTL_MS = 24 * 60 * 60 * 1000;
const SINGLE_VIEW_WIDTH = 1200;
const SINGLE_VIEW_HEIGHT = 800;
const POPUP_FEATURES = `popup=yes,width=${SINGLE_VIEW_WIDTH},height=${SINGLE_VIEW_HEIGHT},resizable=yes,scrollbars=yes`;

export interface SingleViewHandoff {
  version: number;
  expiresAt: number;
  container: Container;
}

type OpenFinPlatform = {
  createWindow: (options: {
    name: string;
    url: string;
    defaultWidth: number;
    defaultHeight: number;
    autoShow: boolean;
    customData: { singleViewHandoff: SingleViewHandoff };
  }) => Promise<unknown>;
};

type OpenFinWindow = {
  getOptions: () => Promise<{ customData?: { singleViewHandoff?: unknown } }>;
};

export class SingleViewLaunchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SingleViewLaunchError';
  }
}

const handoffKey = (id: string) => `${SINGLE_VIEW_STORAGE_PREFIX}${id}`;

const isContainer = (value: unknown): value is Container => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Container>;
  return [candidate.id, candidate.container, candidate.module, candidate.tile, candidate.title].every(
    (field) => typeof field === 'string' && field.length > 0,
  );
};

const isHandoff = (value: unknown): value is SingleViewHandoff => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<SingleViewHandoff>;
  return (
    candidate.version === SINGLE_VIEW_VERSION &&
    typeof candidate.expiresAt === 'number' &&
    isContainer(candidate.container)
  );
};

export const isSingleViewRequest = (search = window.location.search): boolean =>
  Boolean(new URLSearchParams(search).get(SINGLE_VIEW_QUERY_PARAM));

export const buildSingleViewUrl = (id: string, location = window.location): string => {
  const url = new URL(location.href);
  url.searchParams.set(SINGLE_VIEW_QUERY_PARAM, id);
  return url.toString();
};

export const cleanExpiredSingleViewHandoffs = (
  storage: Storage = window.localStorage,
  now = Date.now(),
): void => {
  for (let index = storage.length - 1; index >= 0; index -= 1) {
    const key = storage.key(index);
    if (!key?.startsWith(SINGLE_VIEW_STORAGE_PREFIX)) continue;
    try {
      const value = JSON.parse(storage.getItem(key) ?? 'null') as unknown;
      if (!isHandoff(value) || value.expiresAt <= now) storage.removeItem(key);
    } catch {
      storage.removeItem(key);
    }
  }
};

export const getSingleViewHandoff = (
  id: string | null,
  storage: Storage = window.localStorage,
  now = Date.now(),
): SingleViewHandoff | null => {
  if (!id) return null;
  try {
    const value = JSON.parse(storage.getItem(handoffKey(id)) ?? 'null') as unknown;
    if (!isHandoff(value) || value.expiresAt <= now) {
      storage.removeItem(handoffKey(id));
      return null;
    }
    return value;
  } catch {
    storage.removeItem(handoffKey(id));
    return null;
  }
};

const getOpenFinPlatform = (): OpenFinPlatform | null => {
  if (typeof window.fin === 'undefined') return null;
  try {
    const platform = window.fin.Platform?.getCurrentSync?.();
    return platform && typeof platform.createWindow === 'function'
      ? (platform as unknown as OpenFinPlatform)
      : null;
  } catch {
    return null;
  }
};

export const getOpenFinSingleViewHandoff = async (): Promise<SingleViewHandoff | null> => {
  if (typeof window.fin === 'undefined') return null;
  try {
    const currentWindow = window.fin.Window?.getCurrentSync?.() as unknown as OpenFinWindow;
    const handoff = (await currentWindow.getOptions()).customData?.singleViewHandoff;
    return isHandoff(handoff) && handoff.expiresAt > Date.now() ? handoff : null;
  } catch {
    return null;
  }
};

export const launchSingleView = async (
  container: Container,
  dependencies: {
    storage?: Storage;
    createId?: () => string;
    now?: () => number;
    openWindow?: Window['open'];
    getPlatform?: () => OpenFinPlatform | null;
  } = {},
): Promise<string> => {
  const storage = dependencies.storage ?? window.localStorage;
  const createId = dependencies.createId ?? (() => crypto.randomUUID());
  const now = dependencies.now ?? Date.now;
  const id = createId();
  const url = buildSingleViewUrl(id);
  const handoff: SingleViewHandoff = {
    version: SINGLE_VIEW_VERSION,
    expiresAt: now() + SINGLE_VIEW_TTL_MS,
    container,
  };

  cleanExpiredSingleViewHandoffs(storage, now());
  storage.setItem(handoffKey(id), JSON.stringify(handoff));

  try {
    const platform = (dependencies.getPlatform ?? getOpenFinPlatform)();
    if (platform) {
      await platform.createWindow({
        name: `mfe-base-single-view-${id}`,
        url,
        defaultWidth: SINGLE_VIEW_WIDTH,
        defaultHeight: SINGLE_VIEW_HEIGHT,
        autoShow: true,
        customData: { singleViewHandoff: handoff },
      });
    } else {
      const popup = (dependencies.openWindow ?? window.open)(url, '_blank', POPUP_FEATURES);
      if (!popup) throw new SingleViewLaunchError('Your browser blocked the single-view popup.');
      popup.focus();
    }
    return id;
  } catch (error) {
    storage.removeItem(handoffKey(id));
    if (error instanceof SingleViewLaunchError) throw error;
    throw new SingleViewLaunchError('Unable to open the tile in a single-view window.');
  }
};
