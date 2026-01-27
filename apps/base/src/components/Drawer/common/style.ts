import { css } from '@emotion/css';
import { styled } from '@mui/material/styles';
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_drawer`;
export const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
  body: `${PREFIX}-body`,
};

export const DrawerClass = css`
  border-bottom: 1px solid rgba(50, 58, 66, 0.5);
  & .MuiPaper-root {
    height: calc(100vh - 50px);
    top: 50px;
    overflow: hidden;
  }
  & .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const Root = styled('section')(({ theme }) => ({
  backgroundColor: theme.theme['DrawerComponent']['backgroundColor'],
  height: '-webkit-fill-available',
  [`&.${classes.root}`]: {},
  [`& .${classes.content}`]: {
    backgroundColor: theme.theme['DrawerComponent']['backgroundColor'],
  },
  [`& .${classes.body}`]: {
    overflowY: 'auto',
    height: 'calc(100vh - 115px)',
  },
  [`& .${classes.title}`]: {
    height: '65px',
    backdropFilter: 'blur(37.5px)',
    fontSize: '1rem',
    fontWeight: 400,
    justifyItem: 'center',
    alignItems: 'center',
    display: 'flex',
    paddingLeft: '2rem',
    '& svg': {
      height: '25px',
      width: '25px',
      marginRight: '1.5rem',
      fill: `${theme.theme['DrawerComponent']['title']['color']} !important`,
      '& *': {
        fill: `${theme.theme['DrawerComponent']['title']['color']} !important`,
      },
    },
    '& span': {
      color: theme.theme['DrawerComponent']['title']['color'],
    },
    ...theme.theme['DrawerComponent']['title'],
  },
}));

export default Root;
