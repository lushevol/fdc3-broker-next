import { styled } from '@mui/material/styles';
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_new_tile`;
export const classes = {
  root: `${PREFIX}-root`,
  box: `${PREFIX}-box`,
  title: `${PREFIX}-title`,
};

const Root = styled('section')(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    height: '46px',
    alignItems: 'center',
    justifyItems: 'center',
    marginRight: '3rem',
    cursor: 'pointer',
    ...theme.theme['NewTileComponent']['root'],
  },
  [`& .${classes.box}`]: {
    backgroundColor: theme.theme['NewTileComponent']['backgroundColor'],
    boxShadow: theme.theme['NewTileComponent']['boxShadow'],
    borderRadius: '10px',
    marginRight: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.25rem',
    width: '36px',
    height: '36px',
    '& img': {
      width: '18px',
      height: '18px',
    },
  },
  [`& .${classes.title}`]: {
    fontSize: '1rem',
    fontWeight: theme.theme['NewTileComponent']['fontWeight'],
  },
}));

export default Root;
