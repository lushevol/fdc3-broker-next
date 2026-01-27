import { styled } from '@mui/material/styles';
import bg from './bg.svg';
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_empty`;
export const classes = {
  root: `${PREFIX}-root`,
  div: `${PREFIX}-div`,
  content: `${PREFIX}-content`,
  button: `${PREFIX}-button`,
  bg: `${PREFIX}-bg`,
};

const Root = styled('section')(({ theme }) => ({
  [`& .${classes.div}`]: {
    height: 'calc(100vh - 130px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  [`& .${classes.content}`]: {
    textAlign: 'center',
    '& .MuiTypography-body1': {
      fontWeight: 500,
      marginTop: '2rem',
    },
    '& .MuiTypography-body2': {
      textAlign: 'center',
      fontWeight: 400,
      width: '366px',
      color: theme.customColor['grey'],
      marginBottom: '2rem',
    },
    [`& .${classes.bg}`]: {
      width: '399px',
      height: '353px',
      backgroundImage: `url(${bg})`,
    },
  },
  [`& .${classes.button}`]: {
    border: `1px solid ${theme.customColor['borderblack']}`,
    boxShadow: `1px 1px 8px 1px rgb(45 137 137 / 20%), 1px 1px 8px 1px rgb(65 141 149 / 14%), 1px 1px 8px 1px rgb(26 163 179 / 12%)`,
    borderRadius: '10px',
    color: 'inherit',
    '&:hover': {
      border: `1px solid ${theme.customColor['borderblack']}`,
      boxShadow: `1px 1px 8px 1px rgb(45 137 137 / 20%), 1px 1px 8px 1px rgb(65 141 149 / 14%), 1px 1px 8px 1px rgb(26 163 179 / 12%)`,
    },
  },
}));

export default Root;
