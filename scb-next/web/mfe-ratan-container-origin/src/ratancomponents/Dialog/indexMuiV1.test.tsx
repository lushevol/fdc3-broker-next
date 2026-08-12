import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import { MuiDialog } from "./indexMuiV1";

describe("MUI Dialog component", () => {
  const onClose = vi.fn();
  const onResize = vi.fn();
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });
  it("default render", async () => {
 
    vi.useFakeTimers();
    render(
      <MuiDialog
        open={true}
        onClose={onClose}
        enableResize={true}
        onResize={onResize}
      />
    );
    expect(screen).toBeDefined();
    const closeBtn = screen.getByTestId("dialog-close");
    closeBtn.click();
    expect(onClose).toBeCalled();

    const resizeBtn = screen.getByTestId("dialog-resize");
    resizeBtn.click();
    fireEvent.mouseDown(resizeBtn);
    fireEvent.mouseMove(resizeBtn, { clientX: 150, clientY: 5 });
    fireEvent.mouseUp(resizeBtn);
    vi.advanceTimersByTime(120);
    expect(onResize).toBeCalled();
  });
  it("open = false", async () => {
    vi.useFakeTimers();
    const { debug, getByTestId } = render(
      <MuiDialog open={false} onClose={onClose} />
    );
    vi.advanceTimersByTime(120);
  });
});
