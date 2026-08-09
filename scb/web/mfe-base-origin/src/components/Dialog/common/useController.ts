import React, { useRef, useState } from "react";
import { useContext } from "../../../hooks/provider";
import { v4 } from "uuid";
import { DialogProps } from "./types";
import { classes } from "./style";
import useAnalytics from "../../../analytics";
import { Workspace } from "../../../hooks/model/workspaces";

const useController = (props: DialogProps) => {
  const [store] = useContext();
  const {
    isResizeble,
    defaultWidth = 400,
    defaultHeight = 400,
    hideBackdrop,
    onClose,
  } = props;
  const { ButtonEvent, ModalEvent } = useAnalytics();
  const idTitle = React.useMemo(() => `title-${v4()}`, []);
  const idModal = React.useMemo(() => `modal-${v4()}`, []);
  const [isMax, setIsMax] = useState(false);
  const [container, setContainer] = useState("base");
  const [tile, setTile] = useState("home");
  const [title, setTitle] = useState("dialog");
  const dialogRef = useRef<HTMLDivElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const width = useRef<undefined | number>(defaultWidth);
  const height = useRef<undefined | number>(defaultHeight);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const endWidth = useRef<number>(defaultWidth);
  const endHeight = useRef<number>(defaultHeight);
  const startResize = useRef<boolean>(false);

  const onResize = () => {
    setIsMax((v) => {
      ButtonEvent("click", {
        name: "modal maximize",
        value: `${!v}`,
        container,
        tile,
      });
      return !v;
    });
  };

  const closeDialog = () => {
    ButtonEvent("click", { name: "modal close", container, tile });
    ModalEvent("close", { name: title, container, tile });
    if (onClose) {
      onClose();
    }
  };

  const initDrag = (e) => {
    const dialogPaper = dialogRef?.current?.getElementsByClassName(
      "MuiPaper-root"
    )[0] as HTMLElement | null;
    //@ts-ignore
    const a = document.defaultView.getComputedStyle(dialogPaper);
    width.current = parseInt(a?.width, 10);
    height.current = parseInt(a?.height, 10);
    startX.current = e.clientX;
    startY.current = e.clientY;
    startResize.current = true;
    ButtonEvent("click", { name: "modal drag", container, tile });
  };

  function doDrag(e) {
    if (isResizeble && startResize.current) {
      const w = width.current + e.clientX - startX.current;
      const h = height.current + e.clientY - startY.current;
      const dialogPaper = dialogRef?.current?.getElementsByClassName(
        "MuiPaper-root"
      )[0] as HTMLElement | null;
      //@ts-ignore
      dialogPaper.style.width = `${w}px`;
      //@ts-ignore
      dialogPaper.style.height = `${h}px`;
      endWidth.current = w;
      endHeight.current = h;
    }
  }

  function stopDrag() {
    startResize.current = false;
    width.current = endWidth.current;
    height.current = endHeight.current;
  }

  const hideOverflow = (parent, hideScroll: boolean) => {
    parent?.setAttribute(
      "style",
      hideScroll
        ? "position: relative; overflow: hidden;"
        : "position: relative;"
    );
  };
  const hide = (parent, open: boolean, max: boolean) => {
    if (open && max) {
      hideOverflow(parent, true);
    }
  };
  React.useEffect(() => {
    const parent = dialogRef?.current?.closest(
      `.${process.env.MFE_APP_PREFIX_STYLE}_home-tabpanel`
    ) as HTMLElement;
    hide(parent, props.open, isMax);
    return () => {
      hideOverflow(parent, false);
    };
  }, [props.open, isMax]);
  const setheight = (parent, MuiBackdrop) => {
    if (parent && MuiBackdrop) {
      MuiBackdrop?.setAttribute("style", `height: ${parent.scrollHeight}px`);
    }
  };
  const handleModalEvent = (workspaces, tabid) => {
    let conatiner_ = "base";
    let tile_ = "home";
    let title_ = "modal";
    const index = workspaces.findIndex(
      (_workspace: Workspace) => _workspace.id === tabid
    );
    if (index >= 0) {
      const workspace = workspaces[index];
      conatiner_ = workspace.containers[0].module.replace("/", "");
      tile_ = workspace.containers[0].tile.replace("/", "");
      title_ = workspace.containers[0].title;
      setContainer(conatiner_);
      setTile(tile_);
      setTitle(title_);
      ModalEvent("open", {
        name: title_,
        container: conatiner_,
        tile: tile_,
      });
    }
  };
  const handleModalOpen = (parent) => {
    if (parent && store.workspaces) {
      const tabid = parent.getAttribute("tabid");
      if (tabid) {
        handleModalEvent(store.workspaces, tabid);
      }
    }
  };
  React.useEffect(() => {
    if (props.open) {
      onMouseDown();
      const parent = dialogRef?.current?.closest(
        `.${process.env.MFE_APP_PREFIX_STYLE}_home-tabpanel`
      ) as HTMLElement;
      const MuiBackdrop = dialogRef?.current?.getElementsByClassName(
        "MuiBackdrop-root"
      )[0] as HTMLElement | null;
      setheight(parent, MuiBackdrop);
      handleModalOpen(parent);
    }
  }, [props.open]);
  const getPosition = (width_, height_) => {
    const { body } = document;
    if (props.open) {
      const top_ = (body.clientHeight - height_.current - 114) / 2;
      const left_ = (body.clientWidth - width_.current) / 2;
      return { top: top_, left: left_ };
    } else {
      return { top: -body.clientHeight, left: -body.clientWidth };
    }
  };
  const { top, left } = React.useMemo(
    () => getPosition(width, height),
    [props.open]
  );
  const setZIndex = (modal, id) => {
    if (modal.id === id) {
      modal.setAttribute("style", "z-index:1200;");
    } else {
      modal.setAttribute("style", "z-index:1199;");
    }
  };
  const onMouseDown = () => {
    if (hideBackdrop) {
      const modals: any = document.getElementsByClassName(classes.hideBackdrop);
      for (let element of modals) {
        setZIndex(element, idModal);
      }
      ButtonEvent("click", { name: "modal focus", container, tile });
    }
  };
  return {
    dialogRef,
    idTitle,
    width,
    height,
    initDrag,
    stopDrag,
    doDrag,
    idModal,
    onResize,
    isMax,
    dialogContentRef,
    hideOverflow,
    setheight,
    getPosition,
    top,
    left,
    onMouseDown,
    setZIndex,
    hide,
    closeDialog,
    handleModalEvent,
  };
};

export default useController;
