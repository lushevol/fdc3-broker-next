import React from 'react';
import { Box, Menu, MenuItem, Typography } from 'ratan-design-origin/primitives';
import { useTheme } from 'ratan-design-origin/theme';
import { portalMotionStyles, portalTokens as t } from './portal-tokens';
import { useProfileReducedMotion } from './profile-motion';

export interface PrototypeAvatarMenuProps {
  anchorEl: HTMLElement | null;
  name: string;
  rootVersion?: string;
  baseVersion?: string;
  onProfile: () => void;
  onLogout: () => void;
  onClose: () => void;
}

const menuLayout = {
  offset: 15,
  rightOffset: 12,
  pointer: 16,
  pointerRight: 20,
  identityHeight: 88,
  logoutHeight: 59,
  footerHeight: 85,
  border: 1,
  transitionMs: 180,
} as const;

export default function PrototypeAvatarMenu(props: PrototypeAvatarMenuProps) {
  const theme = useTheme();
  const colors = t.color[theme.palette.mode];
  const reducedMotion = useProfileReducedMotion();
  return (
    <Menu
      open={Boolean(props.anchorEl)}
      anchorEl={props.anchorEl}
      onClose={props.onClose}
      transitionDuration={reducedMotion ? 0 : menuLayout.transitionMs}
      marginThreshold={menuLayout.rightOffset}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        'data-testid': 'portal-prototype-avatar-menu',
        sx: {
          marginTop: `${menuLayout.offset}px`,
          marginLeft: `${menuLayout.rightOffset}px`,
          width: t.size.menuWidth,
          maxWidth: `calc(100vw - ${t.space.lg}px)`,
          borderRadius: `${t.radius.panel}px`,
          background: colors.canvas,
          color: colors.text,
          backgroundImage: 'none',
          overflow: 'visible',
          fontFamily: t.fontFamily,
          ...portalMotionStyles,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -menuLayout.pointer / 2,
            right: menuLayout.pointerRight,
            width: menuLayout.pointer,
            height: menuLayout.pointer,
            background: colors.canvas,
            transform: 'rotate(45deg)',
          },
          '& .MuiMenu-list': {
            padding: 0,
            maxHeight: `calc(100dvh - ${t.size.headerMobileHeight + t.space.lg}px)`,
            overflowY: 'auto',
          },
          '& .MuiMenuItem-root': {
            marginInline: 0,
            textTransform: 'none',
            whiteSpace: 'normal',
            paddingInline: `${t.space.lg}px`,
            fontFamily: t.fontFamily,
            '&:first-of-type': { minHeight: menuLayout.identityHeight },
            '&:nth-of-type(2)': { minHeight: menuLayout.logoutHeight },
            '&:hover, &.Mui-focusVisible': { background: colors.stripe },
            ...portalMotionStyles,
          },
          [`@media (max-width: ${t.breakpoint.mobile}px)`]: { marginLeft: 0 },
        },
      }}
    >
      <MenuItem
        onClick={props.onProfile}
        sx={{
          paddingBlock: `${t.space.md}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          borderBottom: `${menuLayout.border}px solid ${colors.divider}`,
        }}
      >
        <Typography
          sx={{
            fontFamily: t.fontFamily,
            ...t.typography.body,
            fontWeight: 500,
            overflowWrap: 'anywhere',
          }}
        >
          {props.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: t.fontFamily,
            ...t.typography.caption,
            color: colors.muted,
            textTransform: 'capitalize',
          }}
        >
          Click to view user profile
        </Typography>
      </MenuItem>
      <MenuItem
        onClick={props.onLogout}
        sx={{
          ...t.typography.body,
          borderBottom: `${menuLayout.border}px solid ${colors.divider}`,
        }}
      >
        Logout
      </MenuItem>
      <Box
        component="li"
        role="presentation"
        sx={{
          minHeight: menuLayout.footerHeight,
          padding: `${t.space.md}px ${t.space.lg}px`,
          boxSizing: 'border-box',
          color: colors.muted,
          fontFamily: t.fontFamily,
          ...t.typography.caption,
          overflowWrap: 'anywhere',
          listStyle: 'none',
        }}
      >
        <div>Root Config Version: {props.rootVersion}</div>
        <div>Base Container Version: {props.baseVersion}</div>
      </Box>
    </Menu>
  );
}
