import React, { ReactElement } from "react";
import { hooksBase } from "../HooksBase";
import { RootModel, ProviderPropsDefault, initialData } from "../model/root";
import { reducers } from "../reducer";
import { ActionType, IAction } from "../reducer/util/ActionType";
import {
  getSessionGeneration,
  invalidateSession,
} from "../service/util/session";

export const emptyFunction = () => {
  console.info("AppContext");
};

export const AppContext = React.createContext<
  [RootModel, React.Dispatch<IAction>]
>([initialData, emptyFunction]);
export const useContext = (): [RootModel, React.Dispatch<IAction>] =>
  React.useContext(AppContext);

const Provider: React.FC<ProviderPropsDefault> = (
  props: ProviderPropsDefault
): ReactElement => {
  const [store, reducerDispatch] = React.useReducer(reducers, {
    ...initialData,
    ...props.data,
  });
  const dispatch = React.useCallback((action: IAction) => {
    const endsSession =
      action.type === ActionType.CLEAR ||
      (action.type === ActionType.SET_IS_ON_LOGOUT && action.data.isOnLogout);
    if (endsSession) invalidateSession();
    // Tag queued updates too. A response can dispatch just before logout starts.
    // Always apply logout/clear, even if a new login starts before React renders.
    reducerDispatch(
      endsSession
        ? action
        : {
            ...action,
            sessionGeneration: getSessionGeneration(),
          }
    );
  }, []);
  React.useEffect(() => {
    hooksBase.setBaseDispatch(dispatch);
    hooksBase.setStore(store);
  }, []);
  const data: any = React.useMemo(() => [store, dispatch], [store, dispatch]);
  return (
    <AppContext.Provider value={data}>{props.children}</AppContext.Provider>
  );
};

export default Provider;
