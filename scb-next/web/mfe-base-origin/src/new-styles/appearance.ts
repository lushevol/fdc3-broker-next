import type { RatanAppearance } from 'ratan-design-origin';
import { useContext } from '../hooks/provider';
import type { RootModel } from '../hooks/model/root';

export type PortalAppearance = 'legacy' | 'layout-preview' | 'prototype';

/** One appearance policy for embedded hosts and the standalone Portal. */
export const resolvePortalAppearance = (newStyles = false, search = ''): PortalAppearance => {
  if (newStyles) return 'prototype';
  return new URLSearchParams(search).get('new-layout') === 'true' ? 'layout-preview' : 'legacy';
};

export const useIsNewLayout = () => {
  const [store] = useContext();
  return resolvePortalAppearance(store.newStyles, window.location.search) !== 'legacy';
};

export const readStandaloneAppearance = (search: string) => {
  const params = new URLSearchParams(search);
  return {
    newStyles: params.get('new-styles') === 'true',
    loginAppearance: params.get('login-theme') === 'dark' ? ('dark' as const) : ('light' as const),
  };
};

interface AppearanceInput {
  version?: string;
  newStyles?: boolean;
  loginAppearance?: RatanAppearance['mode'];
}

export const createInitialAppearance = (props: AppearanceInput) => ({
  rootVersion: props.version,
  newStyles: props.newStyles ?? false,
  loginAppearance: props.loginAppearance,
});

export const resolveFederatedAppearance = (
  store: Pick<RootModel, 'theme' | 'newStyles'>,
): RatanAppearance => ({
  mode: store.theme === 'light' ? 'light' : 'dark',
  designGeneration: store.newStyles ? 'webkit' : 'legacy',
});
