import { styled } from '@mui/material/styles';
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_switchTime`;
export const classes = {
  root: `${PREFIX}-root`,
  form: `${PREFIX}-form`,
  label: `${PREFIX}-label`,
};

const Root = styled('section')(({ theme }) => ({
  marginLeft: '2.5rem',
  minWidth: '55px',
  [`&.${classes.root}`]: {},
  [`& .${classes.form}`]: {
    marginBottom: 0,
    alignItems: 'center',
    width: '60px',
    whiteSpace: 'nowrap',
  },
  [`& .${classes.label}`]: {
    fontSize: '0.625rem',
    fontWeight: 500,
    height: '13px',
    color: `${theme.theme['SwitchComponent']['color']}!important`,
  },
}));

export default Root;
