import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_import_map`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Stack)(() => ({
  [`&.${classes.root}`]: {
    width: '100%',
    marginTop: '16px',
  },
  '& .MicroWebUI_Base_simple_table-root': {
    height: 'calc(100vh - 170px)',
  },
}));

export default Root;
