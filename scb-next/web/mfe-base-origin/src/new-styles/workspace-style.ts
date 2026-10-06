import { styled } from 'ratan-design-origin/theme';
import { Box } from 'ratan-design-origin/primitives';
import { classes } from '../pages/Home/common/style';
import { classes as appBar } from '../components/AppBar/common/style';
import { classes as tabItem } from '../components/TabItem/common/style';
import { classes as avatar } from '../components/Avatar/common/style';
import pattern from '../theme/config/pattern.png';
import navyBackground from '../theme/config/background-light.png';
import { portalTokens as t } from './portal-tokens';

/** Styling is scoped to the complete Portal appearance; the preview stays intact. */
export const PortalWorkspaceRoot = styled(Box)(({ theme }) => {
  const colors = t.color[theme.palette.mode];
  return {
    '&&': {
      '--portal-shell-height': `${t.size.headerHeight}px`,
      marginTop: 0,
      height: '100dvh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: t.fontFamily,
      background: colors.canvas,
    },
    '&& .portal-shell-header': {
      position: 'relative',
      flex: '0 0 var(--portal-shell-height)',
      height: 'var(--portal-shell-height)',
      backgroundColor:
        theme.palette.mode === 'dark'
          ? t.color.headerBackgroundDark
          : t.color.headerBackgroundLight,
      backgroundImage: `url(${pattern}), url(${pattern}), ${theme.palette.mode === 'dark' ? `radial-gradient(ellipse 33% 150% at 83% 45%, ${t.color.headerBackgroundDarkGlow}, ${t.color.headerBackgroundDark} 80%)` : `url(${navyBackground})`}`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto 100%, auto 100%, cover',
      backgroundPosition: 'left center, right center, center',
      color: t.color.headerText,
    },
    '&& .portal-shell-logo': {
      position: 'absolute',
      top: t.size.logoBoxTop,
      left: t.size.logoBoxLeft,
      width: t.size.logoWidth,
      height: t.size.logoHeight,
      objectFit: 'contain',
      objectPosition: 'left center',
    },
    [`&& .app-bar-wrapper.${appBar.root}`]: {
      position: 'absolute',
      top: t.space.lg,
      right: t.space.lg,
      width: 'auto',
      minWidth: 0,
      height: t.size.control,
      zIndex: 2,
    },
    [`&& .${appBar.toolbar}`]: { padding: 0, minHeight: t.size.control },
    [`&& .${appBar.right}`]: {
      minWidth: 0,
      minHeight: t.size.control,
      padding: 0,
      gap: t.space.lg,
    },
    [`&&& .${avatar.root}`]: { margin: 0 },
    [`&& .${avatar.img}`]: {
      width: t.size.avatar,
      height: t.size.avatar,
      boxSizing: 'border-box',
      border: `1px solid ${t.color.primaryText}`,
      boxShadow: 'none',
    },
    '&& .portal-workspace-navigation': {
      position: 'absolute',
      bottom: 0,
      left: t.space.lg,
      width: `calc(100% - ${t.space.lg * 2}px)`,
      height: t.size.tabHeight,
      display: 'flex',
      alignItems: 'center',
      zIndex: 1,
    },
    [`&& .${classes.tabs}`]: {
      flex: '0 1 auto',
      minWidth: 0,
      height: t.size.tabHeight,
      minHeight: t.size.tabHeight,
      alignSelf: 'auto',
      '& .MuiTabs-flexContainer': { alignItems: 'center', height: '100%' },
      '& .MuiTabs-indicator': { display: 'none' },
      '& .MuiTabs-scrollButtons': {
        color: t.color.headerMuted,
        flexShrink: 0,
        '&.Mui-disabled': { display: 'none' },
      },
      [`@media (min-width: ${t.breakpoint.mobile + 1}px)`]: {
        '&:has(.MuiTabs-scrollButtons:not(.Mui-disabled)) .MuiTabs-scrollButtons.Mui-disabled': {
          display: 'inline-flex',
          opacity: 0,
        },
      },
    },
    [`&& .${classes.firsttab}`]: { display: 'none' },
    [`&&& .${classes.tabs} .${classes.tab}`]: {
      width: 'auto',
      userSelect: 'none',
      minWidth: 0,
      maxWidth: t.size.tabMaxWidth,
      minHeight: t.size.tabHeight,
      padding: `${t.space.sm}px ${t.space.md}px`,
      opacity: 1,
      zIndex: 1,
      borderRadius: `${t.radius.panel}px ${t.radius.panel}px 0 0`,
      color: t.color.headerMuted,
      '&.Mui-selected': {
        background: colors.canvas,
        color: theme.palette.mode === 'light' ? t.color.primary : t.color.headerText,
      },
      [`& .${tabItem.root}`]: { minWidth: 0 },
      '& .MuiTouchRipple-root': { display: 'none' },
      '& .MuiInput-root': { width: 'auto', transition: 'none', userSelect: 'none' },
      '& .MuiInput-root::before, & .MuiInput-root::after': { border: '0 !important' },
      '& .MuiInput-input': {
        padding: 0,
        margin: 0,
        cursor: 'pointer',
        userSelect: 'none',
        fontFamily: t.fontFamily,
        fontSize: t.size.tabFontSize,
        fontWeight: 400,
        color: `${t.color.headerMuted} !important`,
        width: 'var(--portal-tab-name-width, 12ch)',
        minWidth: t.space.xs * 10,
        '@supports (field-sizing: content)': { fieldSizing: 'content', width: 'auto !important' },
      },
      '&.Mui-selected .MuiInput-input': {
        color: `${theme.palette.mode === 'light' ? t.color.primary : t.color.headerText} !important`,
      },
      '& svg': { color: `${t.color.headerMuted} !important` },
      '&.Mui-selected svg': {
        color: `${theme.palette.mode === 'light' ? t.color.primary : t.color.headerText} !important`,
      },
    },
    [`&& .${classes.lasttab}`]: { padding: `0 ${t.space.md}px`, flexShrink: 0 },
    [`&& .${classes.addtab}`]: {
      width: t.size.control,
      height: t.size.control,
      minWidth: t.size.control,
      minHeight: t.size.control,
      padding: t.space.xs,
      color: t.color.headerMuted,
      background: t.color.headerControl,
      borderRadius: t.space.xs,
      boxShadow: 'none',
      '& svg': { width: t.space.lg, height: t.space.lg },
      '&:hover': { color: t.color.headerText, background: t.color.headerControlHover },
    },
    [`&& .${classes.main}`]: { flex: '1 1 auto', minHeight: 0, marginTop: 0 },
    [`&& .${classes.box}`]: {
      height: '100%',
      boxShadow: 'none',
      [`&:has(> .${classes.cachedAdminPanel})`]: { position: 'relative' },
    },
    [`&& .${classes.tabpanel}`]: {
      height: '100%',
      minHeight: 0,
      overflow: 'hidden',
      padding: 0,
      margin: 0,
    },
    [`&& .${classes.tabpanel} .tabmain`]: {
      height: '100%',
      minHeight: 0,
      padding: 0,
      overflow: 'auto',
      position: 'relative',
      '& > :is(section, div):first-of-type:not(:where(:not(style) ~ *))': {
        height: 'auto !important',
      },
    },
    [`&& .${classes.cachedAdminPanel}`]: {
      '&[hidden]': {
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        visibility: 'hidden !important',
        pointerEvents: 'none',
      },
      '& .tabmain[hidden]': { display: 'block', pointerEvents: 'none' },
      '&[hidden] *, & .tabmain[hidden], & .tabmain[hidden] *': {
        visibility: 'hidden !important',
      },
    },
    '&& button:focus-visible, && input:focus-visible': {
      outline: `2px solid ${t.color.headerMuted}`,
      outlineOffset: 2,
    },
    [`@media (max-width: ${t.breakpoint.mobile}px)`]: {
      '&&': { '--portal-shell-height': `${t.size.headerMobileHeight}px` },
      [`&& .app-bar-wrapper.${appBar.root}`]: {
        top: t.size.headerToolbarHeight,
        right: t.space.md,
        left: t.space.md,
      },
      [`&& .${appBar.right}`]: { width: '100%', justifyContent: 'flex-end', gap: t.space.md },
      '&& .portal-shell-logo': { left: t.space.md },
      '&& .portal-workspace-navigation': {
        left: t.space.sm,
        width: `calc(100% - ${t.space.md}px)`,
      },
    },
  };
});
