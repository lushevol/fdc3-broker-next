import {
  Component,
  createContext,
  useContext,
  type ErrorInfo,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import type { PlatformCapabilities } from '@fm/platform-contracts';
import * as ReactRouterDomModule from 'react-router-dom';
import { Button, Dialog, Loader, LoadingButton, Time } from 'ratan-design-origin/base-compat';
import {
  resolveRatanAppearance,
  type RatanAppearance,
  type RatanAppearanceInput,
} from 'ratan-design-origin';
import { createTheme } from '@mui/material/styles';

export { Button, Dialog, Loader, LoadingButton, Time };

interface BoundaryState {
  readonly error?: Error;
}

class PlatformErrorBoundary extends Component<PropsWithChildren, BoundaryState> {
  state: BoundaryState = {};

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `Cashflow CN render error\n${error.stack ?? error.message}\n${info.componentStack ?? ''}`,
    );
  }

  render(): ReactNode {
    if (this.state.error) {
      return <div role="alert">Cashflow CN could not be rendered: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

interface PlatformBridge {
  readonly token?: string;
  readonly theme: 'light' | 'dark';
  readonly designGeneration: RatanAppearance['designGeneration'];
  readonly user: {
    readonly id: string;
    readonly fullName: string;
    readonly entitlement: {
      readonly actions: readonly string[];
      readonly role: string;
    };
    readonly entitlements: Readonly<Record<string, unknown>>;
  };
}

function getHostTheme(): PlatformBridge['theme'] {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

let platformBridge: PlatformBridge = {
  theme: getHostTheme(),
  designGeneration: 'legacy',
  user: {
    id: 'portal-host',
    fullName: 'Portal Host User',
    entitlement: { actions: [], role: 'portal-host' },
    entitlements: {},
  },
};
let platformCapabilities: PlatformCapabilities | undefined;

type PlatformContextValue = readonly [PlatformBridge, (action: unknown) => void];

const PlatformContext = createContext<PlatformContextValue>([platformBridge, () => undefined]);

export function PlatformProvider({
  appearance,
  children,
}: PropsWithChildren<{ appearance?: RatanAppearanceInput }>) {
  const resolvedAppearance = resolveRatanAppearance(appearance, {
    mode: platformBridge.theme,
    designGeneration: platformBridge.designGeneration,
  });
  const bridge = {
    ...platformBridge,
    theme: resolvedAppearance.mode,
    designGeneration: resolvedAppearance.designGeneration,
  };
  return (
    <PlatformContext.Provider value={[bridge, () => undefined]}>
      {children}
    </PlatformContext.Provider>
  );
}

function usePlatformContext(): PlatformContextValue {
  return useContext(PlatformContext);
}

export function configurePlatformBridge(capabilities: PlatformCapabilities) {
  platformCapabilities = capabilities;
  const identity = capabilities.identity?.getSnapshot();
  const userId = identity?.state === 'authenticated' ? identity.userId : 'portal-host';
  const permissions = identity?.state === 'authenticated' ? identity.permissions : [];
  platformBridge = {
    theme: capabilities.appearance.getSnapshot().scheme,
    designGeneration: 'legacy',
    user: {
      id: userId,
      fullName: userId,
      entitlement: {
        actions: permissions,
        role: 'portal-host',
      },
      entitlements: {},
    },
  };
}

export function openRelatedApplication(path: string, label: string) {
  platformCapabilities?.telemetry.track('cashflow-cn.related-application.opened', {
    path,
    label,
  });
  platformCapabilities?.navigation.navigate(path);
}

function useDispatcher() {
  return {
    dispatchApiStatusList: (_items: readonly string[]) => undefined,
    dispatchVersionState: (_version: Readonly<Record<string, unknown>>) => undefined,
    dispatchSelectedMenu: (_menu: unknown) => undefined,
    dispacthLoading: (_loading: boolean) => undefined,
  };
}

async function parseResponse(response: Response) {
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  if (response.status === 204) return undefined;
  return response.json();
}

function request(method: string, url: string, body?: unknown, init?: RequestInit) {
  return fetch(url, {
    ...init,
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...init?.headers,
    },
  }).then(parseResponse);
}

const storage = (kind: 'local' | 'session') =>
  kind === 'local' ? window.localStorage : window.sessionStorage;

export const ErrorBoundry = { default: PlatformErrorBoundary };
export const Splash = { default: () => <div role="status">Loading Cashflow CN…</div> };
export const Provider = {
  default: PlatformProvider,
  useContext: usePlatformContext,
};
export const ReactRouterDom = ReactRouterDomModule;
export const Service = {
  service: {
    get: (url: string, init?: RequestInit) => request('GET', url, undefined, init),
    post: (url: string, body?: unknown, init?: RequestInit) => request('POST', url, body, init),
    put: (url: string, body?: unknown, init?: RequestInit) => request('PUT', url, body, init),
    delete: (url: string, init?: RequestInit) => request('DELETE', url, undefined, init),
  },
};
export const Hooks = {
  getHooks: () => ({ store: platformBridge }),
};
export const CommonUtil = {
  getEnv: () => 'portal-host',
  getLocalStorage: () => storage('local'),
  getSessionStorage: () => storage('session'),
  storeData: (key: string, value: string) => storage('local').setItem(key, value),
  showErrorMsg: (message: string) => console.error(message),
  showSuccessMsg: (message: string) => console.info(message),
  isDate: (value: unknown) => !Number.isNaN(Date.parse(String(value))),
  isNumber: (value: unknown) => value !== null && value !== '' && Number.isFinite(Number(value)),
  uuidv4: () =>
    globalThis.crypto?.randomUUID?.() ??
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
      const random = Math.floor(Math.random() * 16);
      const value = character === 'x' ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    }),
  formatDate: (value: unknown) => new Date(String(value)).toLocaleString(),
  formatDateToISO: (value: unknown) => new Date(String(value)).toISOString(),
};
export const ChannelUtil = {};
export const LoginUtil = {};
export const Dispatcher = { default: useDispatcher };
export const ThemeConfig = {
  default: (theme: { readonly palette?: { readonly mode?: 'light' | 'dark' } }) => ({
    config: createTheme({ palette: { mode: theme.palette?.mode ?? 'light' } }),
  }),
};
export const ThemeUtil = {
  getTheme: (theme: string | undefined) => ({
    palette: { mode: theme === 'dark' ? ('dark' as const) : ('light' as const) },
  }),
};
export const ExtendService = { extendToken: (_url?: string) => undefined };
export const Analytics = {
  default: () => ({ ButtonEvent: () => undefined }),
};
export const FDC3Agent = {
  default: {
    useIntentListener: (_intent: string, _handler: (context: unknown) => void) => undefined,
  },
};

export default {
  ErrorBoundry,
  Splash,
  Loader,
  Provider,
  ReactRouterDom,
  Service,
  Hooks,
  CommonUtil,
  ChannelUtil,
  LoginUtil,
  Dispatcher,
  ThemeConfig,
  ThemeUtil,
  Time,
  Button,
  LoadingButton,
  ExtendService,
  Analytics,
  FDC3Agent,
  Dialog,
};
