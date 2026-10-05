import { styled } from 'ratan-design-origin/theme';
import LegacyRoot, { classes } from '../pages/Home/common/style';
import { classes as appBar } from '../components/AppBar/common/style';
import { classes as tabItem } from '../components/TabItem/common/style';
import { classes as themeSwitch } from '../components/Switch/common/style';
import { classes as timeSwitch } from '../components/SwitchTime/common/style';
import { classes as newTile } from '../components/NewTile/common/style';
import { classes as avatar } from '../components/Avatar/common/style';
import pattern from '../theme/config/pattern.png';
import navyBackground from '../theme/config/background-light.png';
import { portalTokens as t, portalMotionStyles } from './portal-tokens';

/** Styling is scoped to the complete Portal appearance; the preview stays intact. */
export const PortalWorkspaceRoot = styled(LegacyRoot)(({ theme }) => {
  const colors = t.color[theme.palette.mode];
  const switchInset = (t.size.headerSwitchHeight - t.size.headerSwitchThumb) / 2;
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
    [`&&& .${themeSwitch.root}, &&& .switch-time-wrapper, &&& .${avatar.root}`]: { margin: 0 },
    [`&&& .switch-theme-wrapper .${themeSwitch.icon}, &&& .switch-time-wrapper span.switch-time-icon`]:
      {
        padding: 0,
        width: t.size.headerIconSize,
        height: t.size.headerIconSize,
        background: 'transparent',
        '& img': {
          width: t.size.headerIconSize,
          height: t.size.headerIconSize,
          filter: theme.palette.mode === 'dark' ? t.color.headerIconFilter : 'none',
        },
      },
    [`&&& .switch-theme-wrapper .${themeSwitch.label}, &&& .switch-time-wrapper .${timeSwitch.label}`]:
      {
        color: `${t.color.headerText} !important`,
        fontFamily: t.fontFamily,
        fontSize: t.size.headerLabelSize,
        lineHeight: '13px',
        marginBottom: t.space.xs,
      },
    '&&& .custom-switch': {
      width: t.size.control,
      height: t.size.headerSwitchHeight,
      padding: 0,
      border: 0,
      borderRadius: t.radius.pill,
      '& .MuiSwitch-switchBase, & .MuiSwitch-switchBase:hover': {
        padding: switchInset,
        transform: 'none',
        backgroundColor: 'transparent',
      },
      '& .MuiSwitch-input': {
        width: t.size.control,
        height: t.size.headerSwitchHeight,
        left: 0,
        top: 0,
      },
      '& .MuiSwitch-thumb': {
        width: t.size.headerSwitchThumb,
        height: t.size.headerSwitchThumb,
        borderRadius: t.radius.pill,
        background: `${colors.muted} !important`,
      },
      '& .MuiSwitch-track, & .MuiSwitch-switchBase:hover + .MuiSwitch-track': {
        background: `${t.color.primaryText} !important`,
        border: 'none !important',
      },
      '& .MuiSwitch-switchBase.Mui-checked, & .MuiSwitch-switchBase.Mui-checked:hover': {
        transform: `translateX(${t.size.headerSwitchTravel}px)`,
      },
      '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-input': {
        left: -t.size.headerSwitchTravel,
      },
      '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
        background: `${t.color.primaryText} !important`,
      },
      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track, & .MuiSwitch-switchBase.Mui-checked:hover + .MuiSwitch-track':
        {
          background: `${t.color.primary} !important`,
          border: 'none !important',
        },
      '& .MuiSwitch-switchBase.Mui-focusVisible .MuiSwitch-thumb': {
        boxShadow: `inset 0 0 0 ${switchInset}px ${t.color.primary}`,
      },
    },
    [`&&& .new-tile-icon-wrapper .${newTile.box}`]: {
      width: t.size.control,
      height: t.size.control,
      padding: t.size.headerControlPadding,
      borderRadius: t.radius.control,
      background: t.color.headerControl,
      boxShadow: 'none',
      transition: `background ${t.motion.feedback}`,
      '&:hover, &.selected': { background: t.color.headerControlHover },
      '& img': {
        filter: theme.palette.mode === 'dark' ? t.color.headerIconFilter : 'none',
      },
      ...portalMotionStyles,
    },
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
      '& .MuiTabs-scrollButtons': { color: t.color.headerMuted, flexShrink: 0 },
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
      minWidth: 0,
      maxWidth: t.size.tabMaxWidth,
      minHeight: t.size.tabHeight,
      padding: `${t.space.sm}px ${t.space.md}px`,
      opacity: 1,
      borderRadius: `${t.radius.panel}px ${t.radius.panel}px 0 0`,
      color: t.color.headerMuted,
      '&.Mui-selected': {
        background: colors.canvas,
        color: theme.palette.mode === 'light' ? t.color.primary : t.color.headerText,
      },
      [`& .${tabItem.root}`]: { minWidth: 0 },
      '& .MuiInput-root': { width: 'auto' },
      '& .MuiInput-input': {
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
    [`&& .${classes.box}`]: { height: '100%', boxShadow: 'none' },
    [`&& .${classes.tabpanel}, && .${classes.tabpanel} .tabmain`]: { height: '100%', minHeight: 0 },
    [`&& .${classes.tabpanel} .tabmain`]: { padding: 0, overflow: 'auto' },
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
