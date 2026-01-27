import { styled } from '@mui/material/styles';

const PREFIX = `Fallback`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled('section')(({ theme }) => ({
  [`&.${classes.root}`]: {
    width: '100%',
    padding: theme.spacing(2),
  },
}));

export default Root;
