import { styled } from '@mui/material/styles';
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_home`;
export const classes = {
  root: `${PREFIX}-root`,
  main: `${PREFIX}-main`,
  tabs: `${PREFIX}-tabs`,
  tab: `${PREFIX}-tab`,
  firsttab: `${PREFIX}-firsttab`,
  lasttab: `${PREFIX}-lasttab`,
  div: `${PREFIX}-div`,
  box: `${PREFIX}-box`,
  tabpanel: `${PREFIX}-tabpanel`,
  addtab: `${PREFIX}-addtab`,
  containerTile: `${PREFIX}-containerTile`,
};

const Root = styled('section')(({ theme }) => ({
  marginTop: '1rem',
  overflow: 'hidden',
  [`& .${classes.main}`]: {},
  [`& .${classes.tabs}`]: {
    '& .MuiTab-root': {
      fontSize: '0.75rem',
      fontWeight: 300,
    },
    '& .MuiTabs-flexContainer': {},
    '& .MuiTabs-indicator': {
      top: '3px',
      height: 'auto',
      borderTopLeftRadius: '3px',
      borderTopRightRadius: '3px',
      zIndex: 0,
      ...theme.theme['HomePage']['MuiTabs-indicator'],
    },
    '& .Mui-selected': {
      fontWeight: 400,
    },
    '& .MuiTabs-scrollButtons': {
      '&.Mui-disabled': {
        display: 'none',
      },
    },
    [`& .${classes.firsttab}`]: {
      width: '16px',
    },
    [`& .${classes.tab}`]: {
      userSelect: 'none',
      width: 176,
      zIndex: 1,
      opacity: '0.6',
      '&.Mui-selected': {
        opacity: '1',
      },
      '&:hover': {
        opacity: '1',
      },
      '& .MuiTouchRipple-root': {
        display: 'none',
      },
      '& .MuiInput-root:before': {
        border: '0!important',
      },
      '& .MuiInput-root:after': {
        border: '0!important',
      },
      '& .MuiInput-root:hover': {
        border: '0!important',
      },
      '& .MuiInput-root': {
        transition: 'none',
        width: 'auto',
        userSelect: 'none',
        '& input': {
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          userSelect: 'none',
          fontSize: '0.75rem',
          fontWeight: 400,
        },
      },
    },
    [`& .${classes.lasttab}`]: {
      alignSelf: 'center',
      paddingLeft: '1rem',
      paddingRight: '1rem',
    },
  },
  [`& .${classes.box}`]: {
    ...theme.theme['HomePage']['Box'],
  },
  [`& .${classes.tabpanel}`]: {
    height: 'calc(100vh - 114px)',
    overflow: 'hidden',
    padding: 0,
    margin: 0,
    '& .tabmain': {
      height: 'calc(100vh - 114px)',
      padding: '6px 8px',
      overflow: 'auto',
      position: 'relative',
      '&>section:first-child': {
        height: 'auto!important',
      },
      '&>div:first-child': {
        height: 'auto!important',
      },
    },
  },
  [`& .${classes.addtab}`]: {
    ...theme.theme['HomePage']['Addtab'],
  },
  [`& .${classes.containerTile}`]: {
    textTransform: 'capitalize',
    marginBottom: '1rem',
  },
}));

export default Root;
