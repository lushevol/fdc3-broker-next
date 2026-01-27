import { styled } from '@mui/material/styles';

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_appBar`;
export const classes = {
  root: `${PREFIX}-root`,
  toolbar: `${PREFIX}-toolbar`,
  title: `${PREFIX}-title`,
  right: `${PREFIX}-right`,
  noRadius: `${PREFIX}-noRadius`,
  hoverRed: `${PREFIX}-hoverRed`,
};

const Root = styled('section')(() => ({
  [`&.${classes.root}`]: {
    width: '100%',
    minWidth: '640px',
    userSelect: 'none',
    '& *': {
      userSelect: 'none',
    },
    '& .MuiAppBar-root': {
      zIndex: 599,
    },
  },
  [`& .${classes.toolbar}`]: {
    paddingLeft: '2rem',
    paddingRight: '2rem',
    minHeight: '3rem',
  },
  [`& .${classes.title}`]: {
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  [`& .${classes.right}`]: {
    minWidth: '300px',
    minHeight: '46px',
    borderRadius: '12px',
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem',
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
  },
  [`& .${classes.noRadius}`]: {
    borderRadius: 0,
  },
  [`& .${classes.hoverRed}`]: {
    '&:hover': {},
  },
}));

export default Root;
