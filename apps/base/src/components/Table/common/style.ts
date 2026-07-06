import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_simple_table`;
export const classes = {
  root: `${PREFIX}-root`,
  grid: `${PREFIX}-grid`,
};

const Root = styled(Box)(() => ({
  [`&.${classes.root}`]: {
    minHeight: 0,
    width: '100%',
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  [`& .${classes.grid}`]: {
    flex: 1,
    minHeight: 0,
    '& .MuiDataGrid-row': {
      border: 0,
      marginBottom: 0,
    },
    '& .MuiDataGrid-cell': {
      borderLeft: 0,
      borderTop: 0,
      borderRight: 0,
      borderBottom: 0,
      border: '0px !important',
    },
    '& .MuiDataGrid-filterForm': {
      '& .MuiFormControl-root': {
        marginTop: 0,
      },
    },
  },
}));

export default Root;
