import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, {
  FC,
  PropsWithChildren,
  memo,
  useCallback,
  useEffect,
  useState,
  MouseEventHandler,
  useRef,
} from "react";
import {
  HighlightOffRounded as HighlightOffRoundedIcon,
  ZoomInMapRounded,
  ZoomOutMapRounded,
} from "@mui/icons-material";
import MfeThemeProvider from "../../Root/component/MfeThemeProvider";
import { DialogProps } from "./common/interface";
import StyledResizableMuiDialog from "./common/StyledResizableMuiDialog";
import { Button } from "../../Root/import";

/**
 * @auth Judy
 * @desc Dialog is no used after MuiDialog suit for all component
 */

export interface MuiDialogCustomProps extends DialogProps {
  enableMaximize?: boolean;
}
export const MuiDialog: FC<PropsWithChildren<MuiDialogCustomProps>> = memo(
  ({
    className,
    classes,
    testId = "MuiDialog",
    minWidth = 200,
    minHeight = 200,
    width = "auto",
    height = "auto",
    fullScreen,
    fullWidth = true,
    // maxWidth,
    scroll = "paper",
    disableEscapeKeyDown,
    open,
    onClose,
    enableResize = false,
    enableMaximize = false,
    title,
    // destoryWhenHidden = true,
    actions,
    children,
    onResize,
  }) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [isMove, setIsMove] = useState(false);
    const [startWidth, setStartWidth] = useState(0);
    const [startHeight, setStartHeight] = useState(0);
    const [nowWidth, setNowWidth] = useState(width);
    const [nowHeight, setNowHeight] = useState(height);
    const [max, setMax] = useState(false);

    const BootstrapDialog = useCallback(
      StyledResizableMuiDialog(Dialog, enableResize),
      [enableResize]
    );
    const handleCloseBtnClick = useCallback(() => {
      onClose();
    }, [onClose]);
    const handleNativeDialogClose = useCallback<
      (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    >(
      (_event, _reason) => {
        // disable native dialog close.
      },
      [onClose]
    );
    const handleMax = useCallback((isMax) => {
      const dialogPaper = dialogRef?.current?.getElementsByClassName(
        "MuiPaper-root"
      )[0] as HTMLElement | null;
      if (dialogPaper) {
        if (isMax) {
          dialogPaper.style.width = "95%";
          dialogPaper.style.height = "95%";
          setMax(true);
        } else {
          dialogPaper.style.width =
            typeof width === "number" ? `${width}px` : width;
          dialogPaper.style.height =
            typeof height === "number" ? `${height}px` : height;
          setMax(false);
        }
      }
    }, []);

    const resizeHandler = useCallback(() => {
      setTimeout(() => {
        if (typeof nowWidth === "string" || typeof nowHeight === "string") {
          const dialogPaper = dialogRef?.current?.getElementsByClassName(
            "MuiPaper-root"
          )[0] as HTMLElement | null;
          onResize &&
            onResize(dialogPaper?.offsetWidth, dialogPaper?.offsetHeight);
        } else {
          onResize && onResize(nowWidth, nowHeight);
        }
      }, 100);
    }, [onResize, dialogRef.current]);
    useEffect(() => {
      if (open) {
        resizeHandler();
      } else {
        setTimeout(() => {
          setNowWidth(width);
          setNowHeight(height);
        }, 100);
      }
    }, [open]);

    const startMove = (e: any) => {
      setStartX(e.pageX);
      setStartY(e.pageY);
      const dialogPaper = dialogRef?.current?.getElementsByClassName(
        "MuiPaper-root"
      )[0] as HTMLElement | null;
      if (dialogPaper) {
        setStartWidth(dialogPaper?.offsetWidth);
        setStartHeight(dialogPaper?.offsetHeight);
      }
      setIsMove(true);
    };

    const endMove = () => {
      if (isMove) {
        setIsMove(false);
        onResize && onResize(nowWidth, nowHeight);
      }
    };

    const moving: MouseEventHandler = (e) => {
      if (isMove) {
        const moveX = e.pageX;
        const moveY = e.pageY;
        const newWidth = startWidth + (moveX - startX) * 2;
        const newHeight = startHeight + (moveY - startY) * 2;
        const dialogPaper = dialogRef?.current?.getElementsByClassName(
          "MuiPaper-root"
        )[0] as HTMLElement | null;
        if (dialogPaper) {
          if (newWidth > minWidth) {
            dialogPaper.style.width = newWidth + "px";
          } else {
            dialogPaper.style.width = minWidth + "px";
          }
          if (newHeight > minHeight) {
            dialogPaper.style.height = newHeight + "px";
          } else {
            dialogPaper.style.height = minHeight + "px";
          }
        }
      }
    };

    return (
      <MfeThemeProvider>
        <BootstrapDialog
          className={className}
          aria-labelledby="mui-dialog-title"
          open={open}
          scroll={scroll}
          disableEscapeKeyDown={disableEscapeKeyDown}
          onClose={handleNativeDialogClose}
          fullScreen={fullScreen}
          fullWidth={fullWidth}
          classes={classes}
          maxWidth={false}
          onMouseUp={endMove}
          onMouseMove={moving}
          onMouseLeave={endMove}
          ref={dialogRef}
          PaperProps={{
            sx: {
              width,
              height,
            },
          }}
        >
          {title && <DialogTitle id="mui-dialog-title">{title}</DialogTitle>}
          <DialogContent>{children}</DialogContent>
          {actions && <DialogActions>{actions}</DialogActions>}
          {enableMaximize &&
            (max ? (
              <Button
                className="max-btn"
                startIcon={<ZoomInMapRounded />}
                data-testid={`${testId}-restore-btn`}
                onClick={() => handleMax(false)}
              >
                Restore
              </Button>
            ) : (
              <Button
                className="max-btn"
                startIcon={<ZoomOutMapRounded />}
                data-testid={`${testId}-max-btn`}
                onClick={() => handleMax(true)}
              >
                Maximize
              </Button>
            ))}
          <Button
            className="close-btn"
            startIcon={<HighlightOffRoundedIcon />}
            data-testid={`${testId}-close-btn`}
            onClick={handleCloseBtnClick}
          >
            Close
          </Button>

          {enableResize && (
            <div
              className="resize-btn"
              data-testid={`${testId}-resize-btn`}
              onMouseDown={startMove}
            >
              <div className="resize-btn-icon" />
            </div>
          )}
        </BootstrapDialog>
      </MfeThemeProvider>
    );
  }
);
