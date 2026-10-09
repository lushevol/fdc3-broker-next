import type { RootModel } from '../hooks/model/root';
import type { IAction } from '../hooks/reducer/util/ActionType';
import { LOCAL_PORTAL_GENERATION_ACTION } from './local-generation-contract';
import { isLocalStylingConsole } from './styling-console/settings';

/** Appearance policy stays here; the legacy reducer only delegates. */
export function reduceLocalPortalGeneration(store: RootModel, action: IAction): RootModel {
  if (
    import.meta.env.DEV &&
    action.type === LOCAL_PORTAL_GENERATION_ACTION &&
    isLocalStylingConsole(true, window.location.hostname) &&
    typeof action.data.newStyles === 'boolean'
  ) {
    return { ...store, newStyles: action.data.newStyles };
  }
  return store;
}
