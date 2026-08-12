import { configureStore, createAction,createReducer } from "@reduxjs/toolkit";
import {
  render,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { showOrHideCashflowSearchBar } from "src/Cashflow_CN/Main/store/actions";

import ToggleVisibleDivider from "./index";

jest.mock("src/Cashflow_CN/Main/store/actions");

const mockShowOrHideFn = jest
  .mocked(showOrHideCashflowSearchBar)
  .mockImplementation((data) => {
    return {
      type: "SHOW_HIDE_CASHFLOW_SEARCH_BAR",
      data: data,
    };
  });

describe("ToggleVisibleDivider component", () => {
  it("hide search rendner", () => {
    const store = configureStore({
      reducer: {
        showCashflowSearchBar: createReducer(false, (builder) => {
          builder.addCase(
            createAction<boolean>("SHOW_HIDE_CASHFLOW_SEARCH_BAR"),
            (state, action: any) => {
              return action.data;
            }
          );
        }),
      },
      preloadedState: {
        showCashflowSearchBar: false,
      },
    });

    const { getByRole } = render(
      <Provider store={store}>
        <ToggleVisibleDivider />
      </Provider>
    );
    const button = getByRole("button");
    expect(button).toHaveTextContent("Show Search Bar");
    userEvent.click(button);
    expect(mockShowOrHideFn).toHaveBeenCalledWith(true);
  });

  it("show search rendner", () => {
    const store = configureStore({
      reducer: {
        showCashflowSearchBar: createReducer(true, (builder) => {
          builder.addCase(
            createAction<boolean>("SHOW_HIDE_CASHFLOW_SEARCH_BAR"),
            (state, action: any) => {
              return action.data;
            }
          );
        }),
      },
      preloadedState: {
        showCashflowSearchBar: true,
      },
    });

    const { getByRole } = render(
      <Provider store={store}>
        <ToggleVisibleDivider />
      </Provider>
    );
    const button = getByRole("button");
    expect(button).toHaveTextContent("Hide Search Bar");
    userEvent.click(button);
    expect(mockShowOrHideFn).toHaveBeenCalledWith(false);
  });
});
