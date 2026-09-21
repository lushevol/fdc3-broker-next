import React from "react";
import Box, { type BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Backdrop, { type BackdropProps } from "@mui/material/Backdrop";

export interface EmptyStateProps extends Omit<BoxProps, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  illustration?: React.ReactNode;
  action?: React.ReactNode;
  wrapperProps?: BoxProps;
  contentProps?: BoxProps;
}

export function EmptyState({
  title, description, illustration, action, wrapperProps, contentProps, ...rootProps
}: EmptyStateProps) {
  return <Box component="section" {...rootProps}>
    <Box {...wrapperProps}>
      <Box component="section" {...contentProps}>
        {illustration}
        <Typography variant="body1" gutterBottom>{title}</Typography>
        {description !== undefined && description !== null && <Typography variant="body2" gutterBottom>{description}</Typography>}
        {action}
      </Box>
    </Box>
  </Box>;
}

export interface ErrorFallbackProps extends Omit<BoxProps, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function ErrorFallback({ title, description, action, ...rootProps }: ErrorFallbackProps) {
  return <Box component="section" sx={{ width: "100%", p: 2 }} {...rootProps}>
    <Stack spacing={2} direction="column">
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {description !== undefined && description !== null && <Typography variant="body1" gutterBottom>{description}</Typography>}
      {action !== undefined && action !== null && <div>{action}</div>}
    </Stack>
  </Box>;
}

export interface LoadingOverlayProps extends BoxProps {
  open: boolean;
  backdropProps?: Omit<BackdropProps, "open" | "children">;
}

export function LoadingOverlay({
  open,
  children,
  backdropProps,
  style,
  ...rootProps
}: LoadingOverlayProps) {
  return <Box component="section" sx={{
    position: "absolute", inset: 0, width: "100%", height: "100%",
    display: "flex", alignItems: "center", justifyContent: "center",
  }} {...rootProps} style={{
    ...style,
    pointerEvents: open ? style?.pointerEvents : "none",
  }}>
    <Backdrop aria-hidden={!open} sx={{
      color: "common.white",
      backgroundColor: "rgb(0 0 0 / 62%)",
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
      {...backdropProps} open={open}>
      {open && <div role="status">{children}</div>}
    </Backdrop>
  </Box>;
}
