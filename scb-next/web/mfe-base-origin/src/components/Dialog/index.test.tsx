import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Dialog from ".";
import { PREFIX } from "./common/style";
import { Button, Typography, SnackbarCloseReason } from 'ratan-design-origin/primitives';
import useController from "./common/useController";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { darkBg, lightBg, setBg } from "./common/DialogTitle";
import { DialogProps } from "./common/types";

const workspaces = [{ "id": "21a6d709-842d-4a16-a44d-ef14969d7cce", "label": "Drawer Category ", "isActive": false, "containers": [{ "id": "e635e409-3212-4ac6-83cd-ceeac5209c02", "container": "@fm/base", "module": "/category", "tile": "/category", "title": "Drawer Category ", "emailSupport": "", "panelId": "", "tabId": "", "leftPosition": "calc(50% - 45px)", "topPossition": "8px" }] }, { "id": "0460fe39-26ba-458c-b255-3e12814d3d29", "label": "Mapping Query ", "isActive": false, "containers": [{ "id": "bda45e98-2b0a-4162-9a14-6133ac4ff045", "container": "@fm/stamp_container", "module": "/stamp", "tile": "/stamp-mappingquery", "title": "Mapping Query ", "emailSupport": "MLS_BAU@sc.com", "panelId": "", "tabId": "", "leftPosition": "calc(50% - 45px)", "topPossition": "8px" }] }]
const DialogComp = () => {
  const {
    hideOverflow,
    setheight,
    getPosition,
    setZIndex,
    hide,
    handleModalEvent,
  } = useController({ isResizeble: true } as DialogProps);
  const [openDialog, setOpenDialog] = React.useState(true)
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDialog(false);
    setZIndex({ id: "a", setAttribute: () => { } }, "a")
    setZIndex({ id: "b", setAttribute: () => { } }, "a")
    hide({ id: "a", setAttribute: () => { } }, true, true);
    hide({ id: "a", setAttribute: () => { } }, false, true);
    hide({ id: "a", setAttribute: () => { } }, true, false);
    hide({ id: "a", setAttribute: () => { } }, false, false);
  };
  React.useEffect(() => {
    hideOverflow({ setAttribute: () => { } }, true);
    hideOverflow({ setAttribute: () => { } }, false);
    setheight(undefined, undefined)
    setheight({ scrollHeight: 200 }, { setAttribute: () => { } })
    getPosition(undefined, undefined)
    getPosition({ current: 200 }, { current: 200 })
    handleModalEvent(workspaces, "21a6d709-842d-4a16-a44d-ef14969d7cce")
    handleModalEvent(workspaces, "1234")
  }, []);
  return (<Dialog
    open={openDialog}
    onClose={handleClose}
    id="DialogCompId"
    titleComponents="Title"
    isDraggable
    isResizeble
    dividers={true}
    disablePortal={false}
    hideBackdrop={false}
    actionComponents={<Button onClick={handleClose}>Close</Button>}
  >
    <Typography gutterBottom style={{ height: "200vh" }}>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
      dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros.
    </Typography>
  </Dialog>)
};

const DialogComp2 = () => {
  useController({ isResizeble: false, defaultWidth: 800, defaultHeight: 200 } as DialogProps);
  const [openDialog] = React.useState(true)
  return (<Dialog
    open={openDialog}
    id="DialogCompId2"
  >
    <Typography gutterBottom>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
      dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros.
    </Typography>
  </Dialog>)
};

const DialogComp3 = () => {
  useController({ isResizeble: false } as DialogProps);
  const [openDialog, setOpenDialog] = React.useState(true)
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDialog(false);
  };
  return (<Dialog
    open={openDialog}
    id="DialogCompId"
    titleComponents="Title"
    isDraggable={false}
    isResizeble={false}
    dividers={true}
    actionComponents={<Button onClick={handleClose}>Close</Button>}
  >
    <Typography gutterBottom>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
      dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros.
    </Typography>
  </Dialog>)
};

const DialogComp4 = () => {
  useController({ isResizeble: true } as DialogProps);
  const [openDialog, setOpenDialog] = React.useState(true)
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDialog(false);
  };
  return (<Dialog
    open={openDialog}
    id="DialogCompId"
    titleComponents="Title"
    isDraggable={true}
    isResizeble={true}
    dividers={true}
    disablePortal={true}
    hideBackdrop={true}
    actionComponents={<Button data-testid="action-close" onClick={handleClose}>Close</Button>}
  >
    <Typography gutterBottom>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
      dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros.
    </Typography>
  </Dialog>)
};

const DialogComp5 = () => {
  useController({ isResizeble: true } as DialogProps);
  const [openDialog, setOpenDialog] = React.useState(true)
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDialog(false);
  };
  return (<Dialog
    open={openDialog}
    id="DialogCompId"
    titleComponents="Title"
    isDraggable={true}
    isResizeble={true}
    dividers={true}
    disablePortal={true}
    hideBackdrop={true}
    defaultX={100}
    defaultY={200}
    actionComponents={<Button data-testid="action-close" onClick={handleClose}>Close</Button>}
  >
    <Typography gutterBottom>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
      dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros.
    </Typography>
  </Dialog>)
};

describe("DialogComp component", () => {
  it("DialogComp should be in the document", () => {
    const randomUUID = vi.spyOn(globalThis.crypto, "randomUUID");
    render(<DialogComp />);
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    expect(randomUUID).toHaveBeenCalled();

    const content = screen.getByTestId(`${PREFIX}-content`);
    fireEvent.scroll(content, { currentTarget: { scrollLeft: 10, scrollTop: 10 } })

    const spyScrollTo = vi.fn();
    Object.defineProperty(content, 'scrollTo', { value: spyScrollTo });

    expect(setBg({ palette: { mode: "dark" } })).toEqual(darkBg);
    expect(setBg({ palette: { mode: "light" } })).toEqual(lightBg);

    const header = screen.getByTestId(`${PREFIX}-header`);
    expect(header).toBeInTheDocument();
    header.click();

    fireEvent.mouseDown(header);
    fireEvent.mouseMove(header, {
      clientX: 16,
      clientY: 16,
    })

    fireEvent.mouseUp(header)

    const resize = screen.getByTestId(`${PREFIX}-resize`);
    expect(resize).toBeInTheDocument();
    resize.click();

    fireEvent.mouseDown(resize);
    fireEvent.mouseMove(resize, {
      clientX: 16,
      clientY: 16,
    })

    fireEvent.mouseUp(resize)

    const maximize = screen.getByTestId(`${PREFIX}-maximize`);
    expect(maximize).toBeInTheDocument();
    maximize.click();

    const close = screen.getByTestId(`${PREFIX}-close`);
    expect(close).toBeInTheDocument();
    close.click();
  });
  it("DialogComp2 should be in the document", () => {
    render(<Provider data={{ workspaces, theme: "light", token: undefined, user: undefined }}>
      <ThemeProvider>
        {/*@ts-ignore*/}
        <section tabid="21a6d709-842d-4a16-a44d-ef14969d7cce">
          <DialogComp2 />
        </section>
      </ThemeProvider>
    </Provider>);
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
  });
  it("DialogComp3 should be in the document", () => {
    render(<Provider data={{ workspaces, theme: "dark", token: undefined, user: undefined }}>
      <ThemeProvider>
        {/*@ts-ignore*/}
        <section tabid="21a6d709-842d-4a16-a44d-ef14969d7cce">
          <DialogComp3 />
        </section>
      </ThemeProvider>
    </Provider>);
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
  });
  it("DialogComp4 should be in the document", () => {
    render(<DialogComp4 />);
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();

    const content = screen.getByTestId(`${PREFIX}-content`);
    fireEvent.scroll(content, { currentTarget: { scrollLeft: 10, scrollTop: 10 } })

    const spyScrollTo = vi.fn();
    Object.defineProperty(content, 'scrollTo', { value: spyScrollTo });

    expect(setBg({ palette: { mode: "dark" } })).toEqual(darkBg);
    expect(setBg({ palette: { mode: "light" } })).toEqual(lightBg);

    const header = screen.getByTestId(`${PREFIX}-header`);
    expect(header).toBeInTheDocument();
    header.click();

    fireEvent.mouseDown(header);
    fireEvent.mouseMove(header, {
      clientX: 16,
      clientY: 16,
    })

    fireEvent.mouseUp(header)

    const resize = screen.getByTestId(`${PREFIX}-resize`);
    expect(resize).toBeInTheDocument();
    resize.click();

    fireEvent.mouseDown(resize);
    fireEvent.mouseMove(resize, {
      clientX: 16,
      clientY: 16,
    })

    fireEvent.mouseUp(resize)

    const maximize = screen.getByTestId(`${PREFIX}-maximize`);
    expect(maximize).toBeInTheDocument();
    maximize.click();

    const close = screen.getByTestId(`action-close`);
    expect(close).toBeInTheDocument();
    close.click();
  });
  it("DialogComp5 should be in the document", () => {
    render(<>
      <DialogComp4 />
      <DialogComp5 />
    </>);
    const id = screen.getAllByTestId(PREFIX);
    expect(id[0]).toBeInTheDocument();
    expect(id[1]).toBeInTheDocument();

    const content = screen.getAllByTestId(`${PREFIX}-content`);
    fireEvent.scroll(content[0], { currentTarget: { scrollLeft: 10, scrollTop: 10 } })
    fireEvent.scroll(content[1], { currentTarget: { scrollLeft: 20, scrollTop: 20 } })

    const spyScrollTo = vi.fn();
    Object.defineProperty(content, 'scrollTo', { value: spyScrollTo });

    expect(setBg({ palette: { mode: "dark" } })).toEqual(darkBg);
    expect(setBg({ palette: { mode: "light" } })).toEqual(lightBg);

    const header = screen.getAllByTestId(`${PREFIX}-header`);
    expect(header[0]).toBeInTheDocument();
    header[0].click();
    header[1].click();

    fireEvent.mouseDown(header[0]);
    fireEvent.mouseMove(header[0], {
      clientX: 16,
      clientY: 16,
    })

    fireEvent.mouseUp(header[0])

    fireEvent.mouseDown(header[1]);
    fireEvent.mouseMove(header[1], {
      clientX: 26,
      clientY: 26,
    })

    fireEvent.mouseUp(header[1])

    const close = screen.getAllByTestId(`action-close`);
    expect(close[0]).toBeInTheDocument();
    close[0].click();
    close[1].click();
  });
});
