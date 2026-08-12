import MuiSwitch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

export const classes = {
  icon: 'new-layout-theme-switch-icon',
  switch: 'new-layout-theme-switch-control',
  label: 'new-layout-theme-switch-label',
};

export const Root = styled('section')(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  marginLeft: '24px',
  [`& .${classes.label}`]: {
    textTransform: 'capitalize',
    fontSize: '0.625rem',
    fontWeight: 500,
    lineHeight: '1.4375em',
    marginBottom: '4px',
    display: 'inline-block',
    height: '13px',
  },
  [`.dark & .${classes.label}`]: { color: '#1A1A1A' },
  [`.light & .${classes.label}`]: { color: '#E5E5E5' },
  [`& .${classes.icon}`]: {
    borderRadius: '50%',
    padding: '8px',
    width: '36px',
    height: '36px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  [`.light & .${classes.icon}`]: { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  [`.dark & .${classes.icon}`]: { backgroundColor: 'rgba(26, 26, 26, 0.2)' },
  [`& .${classes.switch}`]: { display: 'flex', flexDirection: 'column' },
}));

export const SwitchStyled = styled(MuiSwitch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  border: '1px solid transparent',
  borderRadius: 8,
  display: 'flex',
  ...theme.theme['SwitchComponent']['MuiSwitch'],
  '& .MuiSwitch-switchBase': { color: '#b5bdc8' },
  '& .MuiSwitch-thumb': { background: '#999999' },
  '& .MuiSwitch-track': {
    background: '#262626 !important',
    border: '1px solid #737373 !important',
    opacity: 1,
  },
  '& .MuiSwitch-switchBase.Mui-checked': { color: '#ffffff', transform: 'translateX(12px)' },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    background: '#2f80ed !important',
    border: '1px solid #2f80ed !important',
    opacity: 1,
  },
  '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': { background: '#ffffff' },
  '& .MuiSwitch-switchBase:hover .MuiSwitch-thumb': { background: '#4F9DF0' },
  '& .MuiSwitch-switchBase:hover + .MuiSwitch-track': {
    borderColor: '#4F9DF0 !important',
  },
}));
