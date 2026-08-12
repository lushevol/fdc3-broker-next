import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { fireEvent, render } from "@testing-library/react";
import { MuiDialog, useViewName } from "Import/ratancomponents";
import { Provider } from "react-redux";
import {
  UTILIZATION_STATIC_BLOTTER_EXPORT_FILE_BTN,
  UTILIZATION_STATIC_BLOTTER_EXPORT_FILE_CONFIRM_BTN,
} from "src/Root/analysis/const";

import { ExportFileEntry } from "./index";

jest.mock("Import/ratancomponents", () => {
  const useViewName = jest.fn(),
    MuiDialog = jest.fn();
  return {
    useViewName,
    MuiDialog,
  };
});

describe("ExportFile component", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("default render", async () => {
    jest.useFakeTimers();
    const aggrid = {
      aggridEvent: {
        api: {
          exportDataAsCsv: jest.fn(),
          exportDataAsExcel: jest.fn(),
        },
      },
    };
    jest.mocked(MuiDialog).mockImplementation((props) => {
      const { children, open, actions } = props;
      return (
        <section>
          {open && <div data-testid="mocked-opend">{JSON.stringify(open)}</div>}
          {children}
          {actions}
        </section>
      );
    });
    jest.mocked(useViewName).mockImplementation(() => ({
      viewName: "mocked view name",
    }));
    const store = configureStore({
      reducer: {
        aggrid: createReducer(aggrid, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <ExportFileEntry />
      </Provider>
    );

    expect(MuiDialog).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Export File", open: false }),
      expect.anything()
    );

    const exportFileBtn = getByTestId(
      UTILIZATION_STATIC_BLOTTER_EXPORT_FILE_BTN
    );
    expect(exportFileBtn).toBeInTheDocument();

    const exportBtn = getByTestId(
      UTILIZATION_STATIC_BLOTTER_EXPORT_FILE_CONFIRM_BTN
    );
    expect(exportBtn).toBeInTheDocument();
    fireEvent.click(exportBtn);
  });
});
