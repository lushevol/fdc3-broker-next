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
  offset: 8,
  rightOffset: 12,
  pointer: 12,
  identityHeight: 72,
  logoutHeight: 44,
  footerHeight: 60,
  paddingBlock: 12,
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
            right: (t.size.avatar - menuLayout.pointer) / 2,
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
            paddingInline: `${t.space.md}px`,
            fontFamily: t.fontFamily,
            '&:hover, &.Mui-focusVisible': { background: colors.stripe },
            ...portalMotionStyles,
          },
        },
      }}
    >
      <MenuItem
        onClick={props.onProfile}
        sx={{
          '&&': { minHeight: menuLayout.identityHeight },
          paddingBlock: `${menuLayout.paddingBlock}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: `${t.space.xs}px`,
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
          '&&': { minHeight: menuLayout.logoutHeight },
          paddingBlock: `${t.space.sm}px`,
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
          padding: `${menuLayout.paddingBlock}px ${t.space.md}px`,
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
