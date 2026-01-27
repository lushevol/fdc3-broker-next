/**
 * @fileoverview Application State Provider
 *
 * Provides the global state management context for the application using
 * React's Context API and useReducer pattern. This is the core state
 * management solution for the application.
 *
 * Usage:
 * - Wrap your app with <Provider> to enable global state
 * - Use useContext() hook to access [store, dispatch] tuple
 *
 * @module hooks/provider
 */

import React, { type ReactElement } from 'react';
import { hooksBase } from '../HooksBase';
import { initialData, type ProviderPropsDefault, type RootModel } from '../model/root';
import { reducers } from '../reducer';
import type { IAction } from '../reducer/util/ActionType';

/**
 * Empty function placeholder for context default value.
 * Used as the initial dispatch function before provider mounts.
 */
export const emptyFunction = () => {
  console.info('AppContext');
};

/**
 * Application Context
 *
 * React context containing the application state and dispatch function.
 * The context value is a tuple: [store, dispatch]
 *
 * @type {React.Context<[RootModel, React.Dispatch<IAction>]>}
 */
export const AppContext = React.createContext<[RootModel, React.Dispatch<IAction>]>([
  initialData,
  emptyFunction,
]);

/**
 * Custom hook to access the application context.
 *
 * @returns A tuple containing [store, dispatch]
 *
 * @example
 * const [store, dispatch] = useContext();
 * // Access state
 * console.log(store.user);
 * // Dispatch action
 * dispatch({ type: ActionType.SET_USER, data: { user: newUser } });
 */
export const useContext = (): [RootModel, React.Dispatch<IAction>] => React.useContext(AppContext);

/**
 * Application State Provider Component
 *
 * Wraps the application with the global state context. Uses useReducer
 * for state management and syncs the store with the hooksBase singleton
 * for access from non-React code.
 *
 * @param props - Provider properties
 * @param props.children - Child components to wrap
 * @param props.data - Initial data to merge with default state
 * @returns Provider wrapped children
 *
 * @example
 * <Provider data={{ rootVersion: '1.0.0' }}>
 *   <App />
 * </Provider>
 */
const Provider: React.FC<ProviderPropsDefault> = (props: ProviderPropsDefault): ReactElement => {
  // Initialize reducer with merged initial data
  const [store, dispatch] = React.useReducer(reducers, {
    ...initialData,
    ...props.data,
  });

  // Sync store and dispatch with hooksBase singleton for non-React access
  React.useEffect(() => {
    hooksBase.setBaseDispatch(dispatch);
    hooksBase.setStore(store);
    // biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally run only on mount
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const data: any = React.useMemo(() => [store, dispatch], [store, dispatch]);

  return <AppContext.Provider value={data}>{props.children}</AppContext.Provider>;
};

export default Provider;
