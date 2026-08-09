import { styled } from '@mui/material/styles';
// import { background } from 'storybook/theming';

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
  // when we change to new design, we apply the style into the same selector, and thenremove these two style definition.
  [`&.app-bar-wrapper.${classes.root}`]: {
    height: '100%',
    width: '40%',
    backgroundColor: 'transparent',
    minWidth: '360px',
  },
  [`&.app-bar-wrapper .MuiAppBar-root`]: {
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    justifyContent: 'center',
    position: 'static !important',
  },
}));

export default Root;
