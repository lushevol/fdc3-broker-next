import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { triggerSearch } from "src/Cashflow_Group_Management/Main/store/slice";
import { render } from "src/test/test-utils";

import { BLOTTER_PAGE_SIZE } from "../../Main/store/state";
import GridFooter from ".";

vi.mock("src/Cashflow_Group_Management/Main/store/slice", () => {
  return {
    triggerSearch: vi.fn(() => vi.fn(() => Promise.resolve())),
  };
});

describe("LoadNext", () => {
  it("click event", () => {
    vi.mocked(triggerSearch);
    const groupBlotter = {
      blotterGridEvent: {
        api: {
          autoSizeAllColumns: vi.fn(),
          getDisplayedRowCount: vi.fn().mockReturnValue(0),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        },
      },
      blotterPagination: {
        lastPage: false,
        totalHits: 0,
        pageNo: 1,
        pageSize: BLOTTER_PAGE_SIZE,
      },
      blotterDatas: [],
    };
    const store = configureStore({
      reducer: {
        groupBlotter: createReducer(groupBlotter, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <GridFooter />
      </Provider>
    );
    const loadBtn = getByTestId("CASHFLOW_GROUP_BLOTTER_AUTO_LOAD_NEXT_BTN");
    expect(loadBtn).toBeInTheDocument();
    fireEvent.click(loadBtn);
    expect(triggerSearch).toHaveBeenCalled();
  });
  it("renders and triggers load next", () => {
    vi.mocked(triggerSearch);
    const groupBlotter = {
      blotterGridEvent: {
        api: {
          autoSizeAllColumns: vi.fn(),
          getDisplayedRowCount: vi.fn().mockReturnValue(0),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        },
      },
      blotterPagination: {
        lastPage: false,
        totalHits: 0,
        pageNo: 1,
        pageSize: BLOTTER_PAGE_SIZE,
      },
      blotterDatas: [],
    };
    const store = configureStore({
      reducer: {
        groupBlotter: createReducer(groupBlotter, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <GridFooter />
      </Provider>
    );
    expect(screen).toBeDefined();
    const loadBtn = getByTestId("CASHFLOW_GROUP_BLOTTER_AUTO_LOAD_NEXT_BTN");
    expect(loadBtn).toBeInTheDocument();
    fireEvent.click(loadBtn);
    expect(triggerSearch).toHaveBeenCalledWith("next");
  });
});

