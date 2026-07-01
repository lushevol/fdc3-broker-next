type BaseModule = Record<string, unknown>;

declare global {
  interface Window {
    __FM_BASE_MODULE__?: BaseModule;
  }
}

const getBaseModule = (): BaseModule => {
  const baseModule = window.__FM_BASE_MODULE__;

  if (!baseModule) {
    throw new Error('@fm/base module is not initialized for Module Federation remotes');
  }

  return baseModule;
};

const getExport = <T = unknown>(name: string): T => getBaseModule()[name] as T;

const baseModule = getBaseModule();

export const ErrorBoundry = getExport('ErrorBoundry');
export const Splash = getExport('Splash');
export const Provider = getExport('Provider');
export const ReactRouterDom = getExport('ReactRouterDom');
export const Service = getExport('Service');
export const Hooks = getExport('Hooks');
export const CommonUtil = getExport('CommonUtil');
export const ChannelUtil = getExport('ChannelUtil');
export const Dispatcher = getExport('Dispatcher');
export const ThemeConfig = getExport('ThemeConfig');
export const ThemeUtil = getExport('ThemeUtil');
export const Time = getExport('Time');
export const Button = getExport('Button');
export const ExtendService = getExport('ExtendService');
export const LoadingButton = getExport('LoadingButton');
export const Analytics = getExport('Analytics');

export default baseModule;
