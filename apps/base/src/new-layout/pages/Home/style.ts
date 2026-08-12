import { styled } from '@mui/material/styles';
import LegacyHomeRoot, { classes } from '../../../pages/Home/common/style';

const NewLayoutHomeRoot = styled(LegacyHomeRoot)(() => ({
  marginTop: '0 !important',
  [`& .${classes.tabBar}`]: {
    width: '60%',
    height: '50%',
    alignSelf: 'flex-end',
  },
  [`& .${classes.tabBar} [role='tab']`]: {
    opacity: '1 !important',
    borderRadius: '4px',
  },
  [`.light & .${classes.tabBar} [role='tab'][aria-selected='true']`]: {
    background: '#ffffff',
  },
  [`.dark & .${classes.tabBar} [role='tab'][aria-selected='true']`]: {
    background: '#121e25',
  },
  [`.dark & .${classes.tabBar} .MuiTabs-scrollButtons svg`]: {
    color: '#012246',
  },
  [`.light & .${classes.tabBar} .MuiTabs-scrollButtons svg`]: {
    color: '#b3d5f8',
  },
  [`& .${classes.tabBar} .MuiTabs-scrollButtons:hover svg`]: {
    color: '#4f9df0 !important',
  },
  [`& .${classes.main}`]: {
    marginTop: 0,
  },
  [`& .${classes.tabpanel} .tabmain > .empty-workspace:first-of-type`]: {
    height: '100% !important',
  },
  [`.light & .divider`]: {
    background: '#ffffff',
  },
  [`.dark & .divider`]: {
    background: '#121e25',
  },
  '@media (max-width: 639px)': {
    '& > header': {
      height: '162px !important',
      backgroundPosition: '20px 2px, left center, right center, center !important',
    },
    '& .new-layout-app-bar': {
      width: '100%',
      height: '96px !important',
    },
    [`& .${classes.tabBar}`]: {
      width: '100%',
      height: '48px !important',
    },
  },
}));

export default NewLayoutHomeRoot;
