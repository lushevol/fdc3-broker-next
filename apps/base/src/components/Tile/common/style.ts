import { css } from '@emotion/css';
import { styled } from '@mui/material/styles';
import type { TileProps } from './interface';

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_tile`;
export const classes = {
  root: `${PREFIX}-root`,
  main: `${PREFIX}-main`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
  titledisabled: `${PREFIX}-titledisabled`,
};

export const backgroundCss = (props: TileProps, theme?: string) => {
  let imageLightTheme = props.imageLightTheme;
  if (imageLightTheme.includes('lightIcons')) {
    imageLightTheme = `image/${imageLightTheme}`;
  }
  let imageDarkTheme = props.imageDarkTheme;
  if (imageDarkTheme.includes('darkIcons')) {
    imageDarkTheme = `image/${imageDarkTheme}`;
  }
  return css`
    cursor: ${props.disabled ? undefined : 'pointer'};
    border-radius: 8px;
    background-position-x: right;
    background-position-y: bottom;
    border-radius: 5px;
    opacity: ${props.disabled ? 0.5 : 0.85};
    &:hover {
      opacity: ${props.disabled ? 0.5 : 1};
    }
    & .${classes.main} {
      background-size: contain;
      background-repeat: no-repeat;
      background-position: bottom right;
      padding: 0.5rem;
    }
  `;
};

const Root = styled('section')((props: any) => ({
  width: '100%',
  background: props.theme.theme['TileComponent']['background'],
  boxShadow: props.theme.theme['TileComponent']['boxShadow'],
  border: props.theme.theme['TileComponent']['border'],
  [`& .${classes.content}`]: {
    height: '34px',
    display: 'flex',
    alignItems: 'end',
    '& .MuiButton-root': {
      borderRadius: '10px',
      minWidth: 'auto',
      width: 'auto',
      padding: props.theme.shape.borderRadius,
      ...props.theme.theme['TileComponent']['button'],
    },
    '& .Mui-disabled': {
      color: 'rgb(115 121 126)',
    },
  },
  [`& .${classes.title}`]: {
    height: '75px',
    fontSize: '0.875rem',
    fontWeight: props.theme.theme['TileComponent']['title']['fontWeight'],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    color: props.theme.theme['TileComponent']['title']['color'],
    p: {
      margin: 0,
      fontSize: '12px',
    },
  },
  [`& .${classes.titledisabled}`]: {
    height: '75px',
    fontSize: '0.875rem',
    fontWeight: 300,
    'white-space': 'nowrap',
    color: 'rgb(115 121 126)',
    p: {
      margin: 0,
      fontSize: '12px',
    },
  },
}));

export default Root;
