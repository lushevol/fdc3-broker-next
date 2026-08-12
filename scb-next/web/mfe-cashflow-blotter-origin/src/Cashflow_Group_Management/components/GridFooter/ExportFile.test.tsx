import { configureStore, createAction,createReducer } from "@reduxjs/toolkit";
import { fireEvent,render } from "@testing-library/react";
import { MuiDialog,useViewName } from "Import/ratancomponents";
import { Provider } from "react-redux";
import { GROUP_BLOTTER_EXPORT_FILE_BTN, GROUP_BLOTTER_EXPORT_FILE_CONFIRM_BTN } from "src/Root/analysis/const";

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
    const groupBlotter = {
      blotterGridEvent: {
        api: {
          exportDataAsCsv: vi.fn(),
        },
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
        groupBlotter: createReducer(groupBlotter, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
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

    const exportFileBtn = getByTestId(GROUP_BLOTTER_EXPORT_FILE_BTN);
    expect(exportFileBtn).toBeInTheDocument();

    const exportBtn = getByTestId(GROUP_BLOTTER_EXPORT_FILE_CONFIRM_BTN);
    expect(exportBtn).toBeInTheDocument();
    fireEvent.click(exportBtn);
  });
});
