import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import { MuiDialog } from "./indexMuiV1";

describe("MUI Dialog component", () => {
  const onClose = jest.fn();
  const onResize = jest.fn();
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  it("default render", async () => {
 
    jest.useFakeTimers();
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
    fireEvent(
      resizeBtn,
      new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
      })
    );
    fireEvent(
      resizeBtn,
      new MouseEvent("mousemove", {
        clientX: 150,
        clientY: 5,
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );
    fireEvent(
      resizeBtn,
      new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
      })
    );
    jest.advanceTimersByTime(120);
    expect(onResize).toBeCalled();
  });
  it("open = false", async () => {
    jest.useFakeTimers();
    const { debug, getByTestId } = render(
      <MuiDialog open={false} onClose={onClose} />
    );
    jest.advanceTimersByTime(120);
  });
});
