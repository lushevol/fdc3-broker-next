import { styled } from '@mui/material/styles';
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_home`;
export const classes = {
  root: `${PREFIX}-root`,
  main: `${PREFIX}-main`,
  tabBar: `${PREFIX}-tabBar`,
  firsttab: `${PREFIX}-firsttab`,
  lasttab: `${PREFIX}-lasttab`,
  div: `${PREFIX}-div`,
  box: `${PREFIX}-box`,
  tabpanel: `${PREFIX}-tabpanel`,
  addtab: `${PREFIX}-addtab`,
  containerTile: `${PREFIX}-containerTile`,
  dragOverlay: `${PREFIX}-dragOverlay`,
};

const Root = styled('section')(({ theme }) => ({
  marginTop: '1rem',
  overflow: 'hidden',
  [`& .${classes.main}`]: {},
  [`& .${classes.tabBar}`]: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'auto',
    minHeight: 48,
    flexShrink: 0,
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      height: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: 4,
    },
    [`& .${classes.firsttab}`]: {
      width: '16px',
      flexShrink: 0,
    },
    [`& .${classes.lasttab}`]: {
      alignSelf: 'center',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      flexShrink: 0,
    },
  },
  [`& .${classes.dragOverlay}`]: {
    opacity: 0.85,
    cursor: 'grabbing',
    width: 176,
    borderRadius: 4,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
      '&>section:first-of-type': {
        height: 'auto!important',
      },
      '&>div:first-of-type': {
        height: 'auto!important',
      },
      '&>.FDC3Declaration-root:first-of-type': {
        height: '100%!important',
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
