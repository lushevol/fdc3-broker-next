import { styled } from '@mui/material/styles';

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_splash`;
export const classes = { root: `${PREFIX}-root`, splash: `${PREFIX}-splash` };

const Root = styled('section')(() => ({
  [`&.${classes.root}`]: {
    position: 'absolute', left: 0, top: 0, width: '100%', height: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
}));

export default Root;
