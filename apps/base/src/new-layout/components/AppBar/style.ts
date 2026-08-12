import { styled } from '@mui/material/styles';
import { classes } from '../../../components/AppBar/common/style';

const NewLayoutAppBarRoot = styled('section')(() => ({
  height: '100%',
  width: '40%',
  minWidth: '360px',
  backgroundColor: 'transparent',
  userSelect: 'none',
  '& *': {
    userSelect: 'none',
  },
  '& .MuiAppBar-root': {
    position: 'static !important',
    display: 'flex',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
  },
  [`& .${classes.toolbar}`]: {
    minHeight: '3rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
  },
  [`& .${classes.right}`]: {
    display: 'flex',
    minWidth: '300px',
    minHeight: '46px',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem',
    borderRadius: '12px',
  },
}));

export default NewLayoutAppBarRoot;
