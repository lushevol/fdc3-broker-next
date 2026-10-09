import type { Dispatch } from 'react';
import type { IAction } from '../../hooks/reducer/util/ActionType';
import { LOCAL_PORTAL_GENERATION_ACTION } from '../local-generation-contract';
import { saveStyleSettings, type StyleSettings } from './settings';

export type PortalGeneration = StyleSettings['designGeneration'];

export function createPortalGenerationUrl(href: string, generation: PortalGeneration): string {
  const url = new URL(href);
  url.searchParams.set('new-styles', String(generation === 'webkit'));
  url.searchParams.delete('new-layout');
  return url.href;
}

interface PortalGenerationEnvironment {
  href: string;
  history: Pick<History, 'state' | 'replaceState'>;
  dispatch: Dispatch<IAction>;
  storage: Pick<Storage, 'setItem' | 'removeItem'> | null;
}

/** Change the shared host flag without interrupting the current authenticated session. */
export function switchPortalGeneration(
  generation: PortalGeneration,
  settings: StyleSettings,
  { href, history, dispatch, storage }: PortalGenerationEnvironment,
): StyleSettings {
  const next = { ...settings, applyToPortal: false, designGeneration: generation };
  if (storage) saveStyleSettings(storage, next);
  history.replaceState(history.state, '', createPortalGenerationUrl(href, generation));
  dispatch({ type: LOCAL_PORTAL_GENERATION_ACTION, data: { newStyles: generation === 'webkit' } });
  return next;
}
