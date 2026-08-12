import React, { FC, PropsWithChildren, memo } from "react";
import cn from "classnames";
import MfeThemeProvider from "../../Root/component/MfeThemeProvider";
import { DialogProps } from "./common/interface";
import Dialog, { dialogClasses } from "./styles";

export interface MuiDialogCustomProps extends DialogProps {
  enableMaximize?: boolean;
  dividers?: boolean;
  inside?: boolean;
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
    title = "",
    // destoryWhenHidden = true,
    actions,
    children,
    onResize,
    disablePortal = true,
    dividers,
    inside,
    ...rest
  }) => {
    return (
      <MfeThemeProvider>
        <Dialog
          className={cn(className, { [dialogClasses.inDialog]: inside })}
          aria-labelledby="mui-dialog-title"
          open={open}
          scroll={scroll}
          disableEscapeKeyDown={disableEscapeKeyDown}
          onClose={() => onClose()}
          fullScreen={fullScreen}
          fullWidth={fullWidth}
          classes={classes}
          maxWidth={false}
          PaperProps={{
            sx: {
              width: width || minWidth,
              height: height || minHeight,
            },
          }}
          titleComponents={title}
          actionComponents={actions}
          defaultWidth={width}
          defaultHeight={height}
          isResizeble={enableResize || enableMaximize}
          onResize={onResize}
          disablePortal={disablePortal}
          dividers={dividers}
          {...rest}
        >
          {children}
        </Dialog>
      </MfeThemeProvider>
    );
  }
);
