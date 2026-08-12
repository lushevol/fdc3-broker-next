import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MainPanel from "./MainPanel";
import { ADVANCED_SEARCH_PREVIEW_DIALOG_SAVE_CREATE_BTN, ADVANCED_SEARCH_PREVIEW_DIALOG_SEARCH_BTN } from "../../../../packages/Analysis/const";
afterAll(() => {
  vi.clearAllMocks();
});

describe("MainPanel component", () => {
  it("should be in the document", async () => {
    const { getByTestId } = render(<MainPanel />);

    //Filterlist
    const newFilterBtn = getByTestId("new-filter-btn");
    userEvent.click(newFilterBtn);
    expect(newFilterBtn).toBeDefined();

    const createOrSaveBtn = getByTestId(ADVANCED_SEARCH_PREVIEW_DIALOG_SAVE_CREATE_BTN);
    userEvent.click(createOrSaveBtn);
    expect(createOrSaveBtn).toBeDefined();
    const searchBtn = getByTestId(ADVANCED_SEARCH_PREVIEW_DIALOG_SEARCH_BTN);
    userEvent.click(searchBtn);
    expect(searchBtn).toBeDefined();
    // const deleteBtn = getByTestId("deleteBtn");
    // expect(deleteBtn).toBeDefined();
  });
});
