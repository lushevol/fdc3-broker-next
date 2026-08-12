import { configureStore, createAction,createReducer } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { DataGrid } from "Import/ratancomponents";
import { useEffect } from "react";
import { Provider } from "react-redux";

import CashflowDataGrid from "./index";
jest.mock("../../services/index", () => {
  return {
    queryBlotter: jest.fn(async () => ({ data: {} })),
  };
});

describe("Grouping Blotter DataGrid component", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("defalut render", async () => {
    jest.useFakeTimers();
    jest.mocked(DataGrid).mockImplementation((props) => {
      const { onGridReady } = props;
      useEffect(() => {
        onGridReady?.({});
      }, []);
      return <section data-testid="mocked-datagrid"></section>;
    });
    const groupBlotter = {
      blotterGridEvent: {
        api: {
          exportDataAsCsv: jest.fn(),
        },
      },
    };
    const store = configureStore({
      reducer: {
        groupBlotter: createReducer(groupBlotter, (builder) => {
          builder.addCase(createAction("setBlotterGridEvent"), (state, action) => state);
        }),
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <CashflowDataGrid />
      </Provider>
    );
    expect(getByTestId("mocked-datagrid")).toBeInTheDocument();
  });
});
