import React from 'react';
import Box, { type BoxProps } from '@mui/material/Box';
import Backdrop, { type BackdropProps } from '@mui/material/Backdrop';

export interface LoadingOverlayProps extends BoxProps {
  open: boolean;
  backdropProps?: Omit<BackdropProps, 'open' | 'children'>;
}

export function LoadingOverlay({
  open,
  children,
  backdropProps,
  style,
  ...rootProps
}: LoadingOverlayProps) {
  return (
    <Box
      component="section"
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...rootProps}
      style={{
        ...style,
        pointerEvents: open ? style?.pointerEvents : 'none',
      }}
    >
      <Backdrop
        aria-hidden={!open}
        sx={{
          color: 'common.white',
          backgroundColor: 'rgb(0 0 0 / 62%)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        {...backdropProps}
        open={open}
      >
        {open && <div role="status">{children}</div>}
      </Backdrop>
    </Box>
  );
}
