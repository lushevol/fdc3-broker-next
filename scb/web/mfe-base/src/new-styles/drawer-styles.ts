import { portalMotionStyles, portalPresentationTokens as t } from './portal-tokens';
import darkUpper from './assets/drawer-pattern-dark-upper-right.png';
import darkLower from './assets/drawer-pattern-dark-lower-right.png';
import lightUpper from './assets/drawer-pattern-light-upper-right.png';
import lightLower from './assets/drawer-pattern-light-lower-right.png';

export type DrawerMode = 'dark' | 'light';

export const drawerLayout = {
  bodyLight: '#dce3f0',
  bodyDark: '#1e2632',
  accentGreen: '#38d200',
  accentDark: '#737373',
  scrollbarLight: '#999999',
  scrollbarDark: '#666666',
  padding: 32,
  shellGap: 4,
  headerIconGap: 12,
  cardLightInset: 12,
  categoryGap: 20,
  cardPadding: 16,
  cardAccent: 3,
  cardRadius: 6,
  icon: 18,
  titleIcon: 25,
  closeIcon: 16,
  border: 1,
  focusWidth: 2,
  scrollbar: 12,
  twoColumns: 870,
  oneColumn: 580,
  gridGap: 16,
  backdropZIndex: 1199,
  backdropDark: 'rgba(0, 0, 0, 0.22)',
} as const;

const shellOffset = `calc(var(--portal-shell-height, ${t.size.headerHeight}px) + ${drawerLayout.shellGap}px)`;

export const drawerPaperStyles = (mode: DrawerMode) => ({
  width: t.size.drawerWidth,
  maxWidth: '100vw',
  top: shellOffset,
  height: `calc(100dvh - ${shellOffset})`,
  boxSizing: 'border-box' as const,
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden',
  background: t.color[mode].canvas,
  backgroundImage: 'none',
  color: t.color[mode].text,
  borderLeft: `${drawerLayout.border}px solid ${t.color[mode].divider}`,
  fontFamily: t.fontFamily,
  boxShadow: 'none',
  letterSpacing: 0,
  [`@media (max-width: ${t.breakpoint.mobile}px)`]: {
    top: `calc(var(--portal-shell-height, ${t.size.headerMobileHeight}px) + ${drawerLayout.shellGap}px)`,
    height: `calc(100dvh - var(--portal-shell-height, ${t.size.headerMobileHeight}px) - ${drawerLayout.shellGap}px)`,
    width: '100vw',
  },
});

export const drawerBackdropStyles = (mode: DrawerMode) => ({
  position: 'fixed' as const,
  inset: `${shellOffset} 0 0`,
  padding: 0,
  border: 0,
  background: mode === 'dark' ? drawerLayout.backdropDark : 'transparent',
  zIndex: drawerLayout.backdropZIndex,
  [`@media (max-width: ${t.breakpoint.mobile}px)`]: {
    top: `calc(var(--portal-shell-height, ${t.size.headerMobileHeight}px) + ${drawerLayout.shellGap}px)`,
  },
});

export const drawerHeaderStyles = (mode: DrawerMode) => ({
  flex: `0 0 ${t.size.drawerHeaderHeight}px`,
  display: 'flex',
  alignItems: 'center',
  gap: `${drawerLayout.headerIconGap}px`,
  paddingInline: `${drawerLayout.padding}px`,
  '& h2': {
    flex: 1,
    margin: 0,
    ...t.typography.sectionHeading,
    fontWeight: 400,
    color: t.color[mode].muted,
  },
  '& > svg': {
    width: drawerLayout.titleIcon,
    height: drawerLayout.titleIcon,
    '& path': { fill: t.color[mode].muted },
  },
  '& .MuiIconButton-root': {
    width: t.size.control,
    height: t.size.control,
    marginRight: `-${t.space.sm}px`,
    color: mode === 'dark' ? t.color.headerMuted : t.color.light.selectedText,
    '& svg': { fontSize: drawerLayout.closeIcon },
    '&:focus-visible': {
      outline: `${drawerLayout.focusWidth}px solid ${t.color.primary}`,
      outlineOffset: drawerLayout.focusWidth,
    },
    ...portalMotionStyles,
  },
  [`@media (max-width: ${t.breakpoint.mobile}px)`]: {
    '& .MuiIconButton-root': { width: t.size.touchControl, height: t.size.touchControl },
  },
});

export const drawerBodyStyles = (mode: DrawerMode) => ({
  flex: 1,
  minHeight: 0,
  overflowY: 'scroll' as const,
  overflowX: 'hidden' as const,
  scrollbarGutter: 'stable',
  padding: `${drawerLayout.padding}px`,
  backgroundColor: mode === 'dark' ? drawerLayout.bodyDark : drawerLayout.bodyLight,
  // These are unobscured native crops, not a reconstructed full pattern.
  backgroundImage: `url(${mode === 'dark' ? darkUpper : lightUpper}), url(${mode === 'dark' ? darkLower : lightLower})`,
  backgroundPosition: `right ${drawerLayout.scrollbar}px top, right ${drawerLayout.scrollbar}px bottom`,
  backgroundRepeat: 'no-repeat',
  '&::-webkit-scrollbar': { width: drawerLayout.scrollbar },
  '&::-webkit-scrollbar-thumb': {
    border: `${drawerLayout.cardAccent}px solid transparent`,
    backgroundClip: 'padding-box',
    backgroundColor: mode === 'dark' ? drawerLayout.scrollbarDark : drawerLayout.scrollbarLight,
    borderRadius: `${t.radius.pill}px`,
  },
  '& > section + section': { marginTop: `${drawerLayout.categoryGap}px` },
  '& h3': {
    margin: `0 0 ${drawerLayout.categoryGap}px`,
    ...t.typography.sectionHeading,
    fontWeight: 500,
    overflowWrap: 'anywhere' as const,
  },
  '& .tile-grid': {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: `${drawerLayout.gridGap}px`,
  },
  [`@media (max-width: ${drawerLayout.twoColumns}px)`]: {
    '& .tile-grid': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    padding: `${t.space.lg}px`,
  },
  [`@media (max-width: ${drawerLayout.oneColumn}px)`]: {
    '& .tile-grid': { gridTemplateColumns: 'minmax(0, 1fr)' },
    padding: `${t.space.md}px`,
  },
});

export const drawerTileActionStyles = (mode: DrawerMode) => ({
  fontFamily: t.fontFamily,
  ...t.typography.body,
  fontWeight: 400,
  textTransform: 'none' as const,
  minWidth: 0,
  color: mode === 'dark' ? t.color.headerMuted : t.color.light.selectedText,
  letterSpacing: 0,
  cursor: 'pointer',
  transition: `background ${t.motion.feedback}, color ${t.motion.feedback}`,
  '&:disabled': { cursor: 'default' },
  '&:focus-visible': {
    outline: `${drawerLayout.focusWidth}px solid ${t.color.primary}`,
    outlineOffset: -drawerLayout.focusWidth,
  },
  ...portalMotionStyles,
});

export const drawerTileStyles = (mode: DrawerMode) => ({
  position: 'relative' as const,
  minWidth: 0,
  minHeight: t.size.tileHeight,
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden',
  borderRadius: `${drawerLayout.cardRadius}px`,
  backgroundColor: t.color[mode].canvas,
  '&::after': {
    content: '""',
    position: 'absolute' as const,
    bottom: 0,
    height: drawerLayout.cardAccent,
    left: 0,
    right: 0,
    background:
      mode === 'dark'
        ? drawerLayout.accentDark
        : `linear-gradient(90deg, ${drawerLayout.accentGreen}, ${t.color.primary})`,
    pointerEvents: 'none' as const,
  },
  '&[data-disabled="true"]': { opacity: 0.5 },
  '& .tile-art': {
    position: 'absolute' as const,
    right: 0,
    bottom: 0,
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    pointerEvents: 'none' as const,
  },
  '& .tile-art[data-pattern="rings"]': { top: t.space.sm, right: t.space.sm, bottom: 'auto' },
  '& .tile-launch': {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
    minHeight: t.size.tileHeight - drawerLayout.cardAccent,
    padding: `${drawerLayout.cardPadding}px ${mode === 'light' ? drawerLayout.cardLightInset : drawerLayout.cardPadding}px`,
    textAlign: 'left' as const,
    border: 0,
    background: t.color[mode].canvas,
    backgroundColor: 'transparent',
    '&:hover:not(:disabled)': { backgroundColor: 'transparent' },
    '&:hover:not(:disabled) .tile-plus': { background: t.color[mode].selected },
    '& .tile-name': {
      ...t.typography.body,
      color: t.color[mode].text,
      overflowWrap: 'anywhere' as const,
      maxWidth: '100%',
      paddingBottom: `${t.space.sm}px`,
    },
    '& .tile-subtitle': {
      display: 'block',
      marginTop: `${t.space.xs}px`,
      ...t.typography.caption,
    },
    '& .tile-plus': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: t.size.control,
      height: t.size.control,
      flex: `0 0 ${t.size.control}px`,
      boxSizing: 'border-box' as const,
      border: `${drawerLayout.border}px solid ${t.color[mode].divider}`,
      borderRadius: `${t.radius.pill}px`,
      color: mode === 'dark' ? t.color.headerMuted : t.color.light.selectedText,
      '& svg': { fontSize: drawerLayout.icon },
    },
  },
  '&[data-options="true"] .tile-launch': {
    minHeight: t.size.tileHeight - t.size.control - drawerLayout.cardPadding,
    paddingBottom: `${t.space.sm}px`,
  },
  '& .tile-options': {
    position: 'relative' as const,
    paddingInline: `${drawerLayout.cardPadding}px`,
    marginBottom: `${drawerLayout.cardPadding}px`,
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: `${t.space.sm}px`,
    '& button': {
      minHeight: t.size.control,
      minWidth: 0,
      padding: `${t.space.xs}px ${t.space.md}px`,
      maxWidth: '100%',
      overflowWrap: 'anywhere' as const,
      border: `${drawerLayout.border}px solid ${t.color[mode].divider}`,
      borderRadius: `${t.radius.pill}px`,
      background: t.color[mode].canvas,
      '&:hover:not(:disabled)': { background: t.color[mode].selected },
    },
  },
  [`@media (max-width: ${t.breakpoint.mobile}px)`]: {
    '& .tile-plus': {
      width: t.size.touchControl,
      height: t.size.touchControl,
      flexBasis: `${t.size.touchControl}px`,
    },
    '& .tile-options button': { minHeight: t.size.touchControl },
    '&[data-options="true"] .tile-launch': {
      minHeight: t.size.tileHeight - t.size.touchControl - drawerLayout.cardPadding,
    },
  },
});
