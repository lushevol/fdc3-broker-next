import { styled } from '@mui/material/styles';

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_survey_button`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled('section')(() => ({
  [`&.${classes.root}`]: {
    marginLeft: '1.5rem',
  },
}));

export default Root;
