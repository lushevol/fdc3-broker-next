import {
  addListener,
  configureStore,
  ListenerEffectAPI,
  TypedAddListener,
  TypedStartListening,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import thunk from "redux-thunk";
import { apiErrorHandlingMiddleware } from "src/Root/rtk-query/apiErrorHandlingMiddleware";
import { apiPerfMonitorMiddleware } from "src/Root/rtk-query/apiPerfMonitorMiddleware";
import { apiSessionExtendMiddleware } from "src/Root/rtk-query/apiSessionExtendMiddleware";
import { graphqlApi } from "src/Root/rtk-query/baseGraphQLApi";

import reducer from "./reducers";
import preloadedState from "./state";

// we not have to pass the preloadState, then it will use the default value in reducer as the state
const create = () =>
  configureStore({
    reducer,
    middleware: (gDM) =>
      gDM()
        .concat(thunk)
        .concat(graphqlApi.middleware)
        .concat(apiSessionExtendMiddleware.middleware)
        .concat(apiPerfMonitorMiddleware.middleware)
        .concat(apiErrorHandlingMiddleware.middleware),
    devTools: process.env.NODE_ENV !== "production",
    preloadedState,
  });

const store = create();

export default create;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
export type AppDispatch = typeof store.dispatch;

export type AppListenerEffectAPI = ListenerEffectAPI<RootState, AppDispatch>;

// @see https://redux-toolkit.js.org/api/createListenerMiddleware#typescript-usage
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export type AppAddListener = TypedAddListener<RootState, AppDispatch>;

export const addAppListener = addListener as AppAddListener;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
