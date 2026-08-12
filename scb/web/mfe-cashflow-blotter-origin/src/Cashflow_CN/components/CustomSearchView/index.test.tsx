import { configureStore, createAction,createReducer } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import {
  getBusinessFieldsFromCache,
} from "Import/ratanutils";
import { Provider } from "react-redux";

import CustomSearchView from "./index";

jest.mock("Import/ratancomponents", () => {
  const FilterSelector = (props) => {
    const { searchFunction } = props;
    searchFunction?.([["operator", ["ONORBEFORE"]]], Function);
    return (
      <button
        data-testid="search-function-btn"
        onClick={props.searchFunction}
      />
    );
  };

  const ViewSelector = jest.fn();
  return {
    FilterSelector,
    ViewSelector,
    MuiDialog: (props) => {
      const {
        children,
        destoryWhenHidden,
        open,
        onClose,
        testId = "mui-dialog",
        ...rest
      } = props;
      return (
        <section
          {...rest}
          open={true}
          data-testid={testId}
        >
          <button data-testid="MuiDialog-close-btn" onClick={onClose} />
          {children}
          {props.actions && <div>{props.actions}</div>}
        </section>
      );
    },
  };
});

jest.mock("../AdvancedSearch", () => {
  const NewFilterBuilder = jest.fn();
  return {
    NewFilterBuilder,
  };
});

describe("CustomSearchView component", () => {
  it("defalut render", async () => {
    const cashflowGridEvent = {
      api: {
        autoSizeAllColumns: jest.fn(),
      },
    };
    const store = configureStore({
      reducer: {
        cashflowGridEvent: createReducer(cashflowGridEvent, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
        switchSearch: createReducer(false, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
    });
    const promise = Promise.resolve({
      cashflowFields: [],
      cashflowAndTradeFields: [],
    });
    jest
      .mocked(getBusinessFieldsFromCache)
      .mockImplementation((workspace, customField) => {
        return promise;
      });

    render(
      <Provider store={store}>
        <CustomSearchView />
      </Provider>
    );
  });
});
