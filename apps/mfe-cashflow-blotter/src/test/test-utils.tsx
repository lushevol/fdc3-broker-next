import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { render, RenderOptions } from "@testing-library/react";
import { Context, PropsWithChildren, ReactElement } from "react";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducer from "src/Cashflow_CN/Main/store/reducers";

export const fn = jest.fn;
export const mock = jest.mock;

function customRender(ui: React.ReactElement, options: RenderOptions = {}) {
  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options,
  });
}

export function ContextWrapper<T>(MyContext: Context<T>, value: T) {
  return ({ children }: PropsWithChildren) => (
    <MyContext.Provider value={value}>{children}</MyContext.Provider>
  );
}

export function ReduxProviderWrapper(store) {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
// override render export
export { customRender as render };

const middleware = [thunk];

const setupStore = function (preloadedState?: PreloadedState<any>) {
  return configureStore({
    reducer,
    preloadedState,
    middleware,
  });
};

export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState,
    store,
    ...renderOptions
  }: { preloadedState?: any; store?: any } = {}
) => {
  const finalstore = store ?? setupStore(preloadedState);
  const wrapper = ReduxProviderWrapper(finalstore);
  return {
    store: finalstore,
    ...render(ui, { wrapper, ...renderOptions }),
  };
};
