//@ts-expect-error from systemjs
import * as Container from '@fm/base';
export const ErrorBoundry = Container.ErrorBoundry.default;
export const Splash = Container.Splash.default;
export const Loader = Container.Loader.default;
export const ContainerProvider = Container.Provider;
export const ReactRouterDom = Container.ReactRouterDom;
export const Service = Container.Service;
export const Provider = Container.Provider;
export const Hooks = Container.Hooks;
export const CommonUtil = Container.CommonUtil;
export const ChannelUtil = Container.ChannelUtil;
export const LoginUtil = Container.LoginUtil;
export const useContainerDispatcher = Container.Dispatcher.default;
export const ThemeConfig = Container.ThemeConfig.default;
export const ThemeUtil = Container.ThemeUtil;
export const { Time } = Container.Time;
export const LoadingButton = Container.LoadingButton.default;
export const Button = Container.Button.default;
export const ExtendTokenService = Container.ExtendService.extendToken;
export const Dialog = Container.Dialog.default;
export const useAnalytics = Container.Analytics.default;
// Chatbot exports
export const ChatbotSidebar = Container.ChatbotSidebar;
export const ChatbotProvider = Container.ChatbotProvider;
export const useChatbot = Container.useChatbot;
export default Container;
