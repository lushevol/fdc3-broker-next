import { styled } from '@mui/material/styles';
import svg1 from './svg1.svg';
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_login`;
export const classes = {
  root: `${PREFIX}-root`,
  gridleft: `${PREFIX}-gridleft`,
  left: `${PREFIX}-left`,
  gridright: `${PREFIX}-gridright`,
  right: `${PREFIX}-right`,
  description: `${PREFIX}-description`,
  formControl: `${PREFIX}-formControl`,
  button: `${PREFIX}-button`,
  box: `${PREFIX}-box`,
  divider: `${PREFIX}-divider`,
};

const Root = styled('section')(({ theme }) => ({
  [`&.${classes.root}`]: {},
  [`& .${classes.gridleft}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#040404',
  },
  [`& .${classes.left}`]: {
    width: '306px',
    textAlign: 'left',
    '& h3': {
      color: '#BDBDBD !important',
      fontSize: '2rem',
      fontStyle: 'normal',
      fontWeight: 500,
      marginBottom: '2.5rem',
      marginTop: '0px',
      lineHeight: '48px',
      textTransform: 'capitalize',
    },
  },
  [`& .${classes.formControl}`]: {
    width: '100%',
    marginBottom: '2rem',
    marginTop: '0px',
    '& .MuiFormLabel-root': {
      transform: 'none',
      position: 'unset',
      fontSize: '0.875rem',
      color: '#BDBDBD !important',
      fontWeight: 400,
      lineHeight: '21px',
    },
    '& .MuiTextField-root': {
      borderRadius: theme.shape.borderRadius,
      display: 'block',
      transform: 'none',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      marginBottom: '0px',
      color: '#CBCBCB !important',
      '& input': {
        color: '#CBCBCB !important',
      },
      '& input::placeholder': {
        color: '#CBCBCB !important',
        fontSize: '0.75rem',
        lineHeight: '18px',
        fontWeight: 400,
      },
    },
    '& svg': {
      color: '#BDBDBD !important',
    },
  },
  [`& .${classes.button}`]: {
    height: '44px',
    fontSize: '0.75rem',
    lineHeight: '18px',
    fontWeight: 600,
    borderRadius: theme.shape.borderRadius,
    marginTop: '1.25rem',
  },
  [`& .${classes.gridright}`]: {
    background: 'linear-gradient(135.03deg, #7A7979 -11.69%, #111112 51.68%)',
  },
  [`& .${classes.right}`]: {
    backgroundImage: `url(${svg1})`,
    mixBlendMode: 'luminosity',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom right',
    height: '100vh',
    '& h2': {
      color: '#BDBDBD !important',
      fontSize: '1.125rem',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '32px',
      width: '333px',
      marginTop: '220px',
      marginLeft: '80px',
      marginBottom: '24px',
    },
    [`& .${classes.description}`]: {
      color: '#BDBDBD !important',
      fontSize: '0.875rem',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '21px',
      marginLeft: '80px',
      textDecoration: 'none !important',
      textTransform: 'capitalize',
      width: '45%',
    },
  },
  [`& .${classes.box}`]: {
    position: 'fixed',
    bottom: '52px',
    right: '72px',
    '& .MuiTab-root': {
      borderTop: '3px solid #606060!important',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '2rem',
      color: '#FFFFFF',
    },
    '& .MuiTabs-indicator': {
      bottom: undefined,
      top: 0,
      backgroundColor: '#FFFFFF',
      height: '3px',
    },
  },
  [`& .${classes.divider}`]: {
    marginTop: '1.25rem',
    borderColor: 'rgba(65, 73, 85, 1)',
  },
}));

export default Root;
