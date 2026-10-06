import { Box, Switch } from 'ratan-design-origin/primitives';
import { styled } from 'ratan-design-origin/theme';
import { classes as themeSwitch } from '../components/Switch/common/style';
import { classes as timeSwitch } from '../components/SwitchTime/common/style';
import { classes as newTile } from '../components/NewTile/common/style';
import { classes as appBar } from '../components/AppBar/common/style';
import { classes as tabItem } from '../components/TabItem/common/style';
import { portalMotionStyles, portalPresentationTokens as t } from './portal-tokens';

const headerLayout = {
  gap: 6,
  labelHeight: 13,
  timeWidth: 60,
  timeMinWidth: 55,
  border: 1,
  workspaceAction: 22,
  newTileIcon: 18,
} as const;

export const PortalHeaderSwitch = styled(Switch)(({ theme }) => {
  const colors = t.color[theme.palette.mode];
  const inset = (t.size.headerSwitchHeight - t.size.headerSwitchThumb) / 2;
  return {
    '&&': {
      width: t.size.control,
      height: t.size.headerSwitchHeight,
      padding: 0,
      border: 0,
      borderRadius: t.radius.pill,
      display: 'flex',
    },
    '&& .MuiSwitch-switchBase, && .MuiSwitch-switchBase:hover': {
      padding: inset,
      transform: 'none',
      backgroundColor: 'transparent',
    },
    '&& .MuiSwitch-input': {
      width: t.size.control,
      height: t.size.headerSwitchHeight,
      left: 0,
      top: 0,
    },
    '&& .MuiSwitch-thumb': {
      width: t.size.headerSwitchThumb,
      height: t.size.headerSwitchThumb,
      borderRadius: t.radius.pill,
      background: colors.muted,
      boxShadow: 'none',
    },
    '&& .MuiSwitch-track': {
      opacity: 1,
      borderRadius: t.radius.pill,
      background: t.color.primaryText,
      border: 0,
    },
    '&& .MuiSwitch-switchBase.Mui-checked, && .MuiSwitch-switchBase.Mui-checked:hover': {
      transform: `translateX(${t.size.headerSwitchTravel}px)`,
    },
    '&& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-input': {
      left: -t.size.headerSwitchTravel,
    },
    '&& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
      background: t.color.primaryText,
    },
    '&& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      background: t.color.primary,
      border: 0,
      opacity: 1,
    },
    '&& .MuiSwitch-switchBase.Mui-focusVisible .MuiSwitch-thumb': {
      boxShadow: `inset 0 0 0 ${inset}px ${t.color.primary}`,
    },
  };
});

const headerLabel = {
  fontFamily: t.fontFamily,
  fontSize: t.size.headerLabelSize,
  fontWeight: 500,
  lineHeight: `${headerLayout.labelHeight}px`,
  height: headerLayout.labelHeight,
  marginBottom: t.space.xs,
  color: t.color.headerText,
};

const headerIcon = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: t.size.headerIconSize,
  height: t.size.headerIconSize,
  padding: 0,
  margin: 0,
  background: 'transparent',
};

export const PortalThemeSwitchRoot = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: headerLayout.gap,
  margin: 0,
  [`& .${themeSwitch.icon}`]: {
    ...headerIcon,
    '& img': {
      width: t.size.headerIconSize,
      height: t.size.headerIconSize,
      filter: theme.palette.mode === 'dark' ? t.color.headerIconFilter : 'none',
    },
  },
  [`& .${themeSwitch.label}`]: {
    ...headerLabel,
    display: 'inline-block',
    textTransform: 'capitalize',
  },
  [`& .${themeSwitch.switch}, & .${themeSwitch.switch} > div`]: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const PortalTimeSwitchRoot = styled(Box)(({ theme }) => ({
  margin: 0,
  minWidth: headerLayout.timeMinWidth,
  display: 'flex',
  alignItems: 'center',
  '& > div': { display: 'inline-flex', alignItems: 'center', gap: headerLayout.gap },
  '& .switch-time-icon': {
    ...headerIcon,
    '& img': {
      width: t.size.headerIconSize,
      height: t.size.headerIconSize,
      filter: theme.palette.mode === 'dark' ? t.color.headerIconFilter : 'none',
    },
  },
  [`& .${timeSwitch.form}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    margin: 0,
    width: headerLayout.timeWidth,
    whiteSpace: 'nowrap',
  },
  [`&& .${timeSwitch.label}`]: headerLabel,
}));

export const PortalNewTileRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: t.size.headerToolbarHeight,
  padding: 0,
  margin: 0,
  border: `${headerLayout.border}px solid transparent`,
  cursor: 'pointer',
  [`& .${newTile.box}`]: {
    width: t.size.control,
    height: t.size.control,
    padding: t.size.headerControlPadding,
    margin: 0,
    borderRadius: t.radius.control,
    background: t.color.headerControl,
    boxShadow: 'none',
    transition: `background ${t.motion.feedback}`,
    '&:hover, &.selected': { background: t.color.headerControlHover },
    '& img': {
      width: headerLayout.newTileIcon,
      height: headerLayout.newTileIcon,
      filter: theme.palette.mode === 'dark' ? t.color.headerIconFilter : 'none',
    },
    '& .new-tile-icon-hover, & .new-tile-icon-selected': { display: 'none' },
    '&:hover .new-tile-icon, &:hover .new-tile-icon-selected': { display: 'none' },
    '&:hover .new-tile-icon-hover': { display: 'block' },
    '&.selected .new-tile-icon, &.selected .new-tile-icon-hover': { display: 'none' },
    '&.selected .new-tile-icon-selected': { display: 'block' },
    ...portalMotionStyles,
  },
}));

export const PortalAppBarRoot = styled(Box)({
  width: 'auto',
  minWidth: 0,
  userSelect: 'none',
  '& *': { userSelect: 'none' },
  '& .MuiAppBar-root': {
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    border: 0,
    boxShadow: 'none',
    justifyContent: 'center',
    position: 'static',
  },
  [`& .${appBar.toolbar}`]: { padding: 0, minHeight: t.size.control },
  [`& .${appBar.right}`]: {
    minWidth: 0,
    minHeight: t.size.control,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 0,
    gap: t.space.lg,
  },
});

export const PortalTabItemRoot = styled(Box)({
  padding: 0,
  margin: 0,
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minWidth: 0,
  [`& .${tabItem.textBoxOutter}`]: {
    display: 'flex',
    alignItems: 'center',
    gap: t.space.xs,
    flex: '1 1 0%',
  },
  [`& .${tabItem.textBox}`]: {
    margin: 0,
    verticalAlign: 'middle',
    '& input': { textOverflow: 'ellipsis' },
  },
  [`& .${tabItem.button}`]: {
    padding: 0,
    margin: 0,
    width: headerLayout.workspaceAction,
    height: headerLayout.workspaceAction,
  },
});
