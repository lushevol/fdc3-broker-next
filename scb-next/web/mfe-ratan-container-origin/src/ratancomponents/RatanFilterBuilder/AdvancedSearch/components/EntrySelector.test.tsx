import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EntrySelector } from "./EntrySelector";
import { ADVANCED_SEARCH_ENTRY_CLEAR_BTN, ADVANCED_SEARCH_ENTRY_SETTING_BTN } from "../../../../packages/Analysis/const";
const { mockFilterContext } = vi.hoisted(() => ({ mockFilterContext: {
  appliedFilter: [],
  onClearAppliedFilter: vi.fn(),
  classifiedFilterList: [
    { key: "public", options: [{ name: "Option 1", rowKey: "1" }, { name: "Option 2", rowKey: "2" }] },
    { key: "private", options: [{ name: "Option 3", rowKey: "3" }, { name: "Option 4", rowKey: "4" }] },
  ],
  onApplyFilterByKey: vi.fn(),
} }));
vi.mock('../hooks/useContext', () => ({
  useFilterList: vi.fn(),
  useFilterBuilderContext: vi.fn(() => mockFilterContext),
}));
afterAll(() => {
  vi.clearAllMocks();
});
vi.mock("../../../../LazyAntd/Select", () => {
  const mockComponent = vi.fn((c) => {
    const { onChange } = c;
    onChange({ value: "a,b" });
    return <section data-testid="select-fliter">{c.children}</section>;
  });
  const mockOption = vi.fn((props) => {
    const { key, value } = props;
    return <div data-testId={key}>{value}</div>;
  });
  return {
    __esModule: true,
    default: mockComponent,
    Option: mockOption,
  };
});

describe("EntrySelector component", () => {
  it("should be in the document", async () => {
    const onOpenSetting = vi.fn();
    const { getByTestId } = render(
      <EntrySelector onOpenSetting={onOpenSetting} />
    );
    const clearBtn = getByTestId(ADVANCED_SEARCH_ENTRY_CLEAR_BTN);
    expect(clearBtn).toBeDefined();
    const selector = screen.getByTestId("select-fliter");
    expect(selector).toBeInTheDocument();
    const SettingBtn = getByTestId(ADVANCED_SEARCH_ENTRY_SETTING_BTN);
    expect(SettingBtn).toBeDefined();
    userEvent.click(SettingBtn);
    expect(onOpenSetting).toBeCalledTimes(1);
  });
});
