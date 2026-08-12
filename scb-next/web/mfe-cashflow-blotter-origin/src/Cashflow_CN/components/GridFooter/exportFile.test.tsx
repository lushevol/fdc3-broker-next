import { configureStore, createAction,createReducer } from "@reduxjs/toolkit";
import {
  fireEvent,
  render,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MuiDialog,useViewName } from "Import/ratancomponents";
import { Provider } from "react-redux";
import { CASHFLOW_BLOTTER_EXPORT_FILE_BTN, CASHFLOW_BLOTTER_EXPORT_FILE_CONFIRM_BTN } from "src/Root/analysis/const";

import { ExportFile } from "./ExportFile";
vi.mock("Import/ratancomponents", () => {
  const useViewName = vi.fn(),
    MuiDialog = vi.fn();
  return {
    useViewName,
    MuiDialog,
  };
});

describe("ExportFile component", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("default render", async () => {
    vi.useFakeTimers();
    const cashflowGridEvent = {
      api: {
        exportDataAsCsv: vi.fn(),
      },
    };
    vi.mocked(MuiDialog).mockImplementation((props) => {
      const { children, open, actions } = props;
      return (
        <section>
          {open && <div data-testid="mocked-opend">{JSON.stringify(open)}</div>}
          {children}
          {actions}
        </section>
      );
    });
    vi.mocked(useViewName).mockImplementation(() => ({
      viewName: "mocked view name",
    }));
    const store = configureStore({
      reducer: {
        cashflowGridEvent: createReducer(cashflowGridEvent, (builder) => {
          builder.addCase(
            createAction("SET_INIT_PARAMS"),
            (state, action) => state
          );
        }),
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <ExportFile />
      </Provider>
    );

    expect(MuiDialog).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Export File", open: false }),
      expect.anything()
    );

    const exportFileBtn = getByTestId(CASHFLOW_BLOTTER_EXPORT_FILE_BTN);
    expect(exportFileBtn).toBeInTheDocument();
    fireEvent.click(exportFileBtn);

    //File Name
    const exportFileName = getByTestId("exportFileName");
    expect(exportFileName).toBeInTheDocument();
    userEvent.type(exportFileName, "cashflow_24-06-23");

    //Format
    const formatBtn = getByTestId("exportFileFormat");
    expect(formatBtn).toBeInTheDocument();

    const exportBtn = getByTestId(CASHFLOW_BLOTTER_EXPORT_FILE_CONFIRM_BTN);
    expect(exportBtn).toBeInTheDocument();
    fireEvent.click(exportBtn);
    expect(cashflowGridEvent.api.exportDataAsCsv).toHaveBeenCalled();
  });
});
