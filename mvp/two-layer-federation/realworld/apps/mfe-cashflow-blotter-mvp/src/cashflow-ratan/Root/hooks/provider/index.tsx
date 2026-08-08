import React, { ReactElement } from "react";
import { ProviderPropsDefault, RootModel, initialData } from "../model/root";
import { reducers } from "../reducer";
import { hooks } from "..";
import { IAction } from "../reducer/actions/ActionType";

export const emptyFunction = () => {
  console.info("AppContext");
};

export const AppContext = React.createContext<
  [RootModel, React.Dispatch<IAction>]
>([initialData, emptyFunction]);

export const useContext = (): [RootModel, React.Dispatch<IAction>] =>
  React.useContext(AppContext);

const RatanProvider: React.FC<ProviderPropsDefault> = (
  props: ProviderPropsDefault
): ReactElement => {
  const [store, dispatch] = React.useReducer(reducers, {
    ...initialData,
    ...props.data,
  });
  React.useEffect(() => {
    hooks.setRatanDispatch(dispatch);
    hooks.setStore(store);
  }, []);
  return (
    <AppContext.Provider value={[store, dispatch]}>
      {props.children}
    </AppContext.Provider>
  );
};

export default RatanProvider;
