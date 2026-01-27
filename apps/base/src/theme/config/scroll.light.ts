import { darken } from '@mui/material/styles';

export default {
  '&::-webkit-scrollbar': {
    height: '6px',
    width: '6px',
    borderRadius: '5px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
    borderRadius: '5px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: darken('#EAEEF4', 0.2),
    borderRadius: '9px',
    border: '6px solid transparent',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: darken('#EAEEF4', 0.3),
    border: '6px solid transparent',
  },
  '& .ag-root-wrapper': {
    minHeight: '400px',
  },
};
