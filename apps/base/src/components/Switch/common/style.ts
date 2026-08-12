import MuiSwitch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_switch`;
export const classes = {
  root: `${PREFIX}-root`,
  icon: `${PREFIX}-icon`,
  switch: `${PREFIX}-switch`,
  label: `${PREFIX}-label`,
};

const Root = styled('section')(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    height: '49px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  [`& .${classes.icon}`]: {
    backgroundColor: theme.theme['SwitchComponent']['backgroundColor'],
    color: theme.theme['SwitchComponent']['color'],
    borderRadius: '50%',
    marginRight: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    width: '30px',
  },
  [`& .${classes.switch}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '49px',
  },
  [`& .${classes.label}`]: {
    textTransform: 'capitalize',
    fontSize: '0.625rem',
    marginBottom: '0.25rem',
    fontWeight: 500,
    height: '15px',
  },
}));

export const SwitchStyled = styled(MuiSwitch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  border: '1px solid transparent',
  borderRadius: 8,
  display: 'flex',
  ...theme.theme['SwitchComponent']['MuiSwitch'],
}));

export default Root;
