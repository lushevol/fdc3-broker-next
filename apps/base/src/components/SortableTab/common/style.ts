import { styled } from '@mui/material/styles';

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_sortableTab`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled('button')<{ active: string }>(({ theme, active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  width: 176,
  minHeight: 48,
  flexShrink: 0,
  cursor: 'grab',
  userSelect: 'none',
  position: 'relative',
  opacity: active === 'true' ? 1 : 0.6,
  fontSize: '0.75rem',
  fontWeight: active === 'true' ? 400 : 300,
  background: 'none',
  border: 'none',
  color: 'inherit',
  padding: '6px 12px',
  outline: 'none',
  fontFamily: 'inherit',
  textAlign: 'left',
  zIndex: 1,
  transition: 'opacity 0.2s ease',
  '&:hover': {
    opacity: 1,
  },
  '&:active': {
    cursor: 'grabbing',
  },
  '&:focus-visible': {
    outline: '2px solid',
    outlineOffset: -2,
  },
  '& .MuiTouchRipple-root': {
    display: 'none',
  },
  '& .MuiInput-root:before': {
    border: '0!important',
  },
  '& .MuiInput-root:after': {
    border: '0!important',
  },
  '& .MuiInput-root:hover': {
    border: '0!important',
  },
  '& .MuiInput-root': {
    transition: 'none',
    width: 'auto',
    userSelect: 'none',
    '& input': {
      padding: 0,
      margin: 0,
      cursor: 'pointer',
      userSelect: 'none',
      fontSize: '0.75rem',
      fontWeight: 400,
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 3,
    left: 4,
    right: 4,
    height: active === 'true' ? 2 : 0,
    borderTopLeftRadius: '3px',
    borderTopRightRadius: '3px',
    backgroundColor: active === 'true'
      ? theme.palette?.primary?.main ?? '#1976d2'
      : 'transparent',
    transition: 'height 0.15s ease, opacity 0.15s ease',
    opacity: active === 'true' ? 1 : 0,
    ...(active === 'true' ? theme.theme?.['HomePage']?.['MuiTabs-indicator'] ?? {} : {}),
  },
}));

export default Root;
