import { css, lighten } from '@mui/material/styles';
import color from './color';
import light from './color.light';
import custom from './common';
import normalize from './normalize';
import scroll from './scroll.light';

const getLightTheme = () => ({
  palette: {
    mode: 'light',
    primary: {
      main: '#2C3F5E',
    },
    secondary: {
      main: '#008738',
    },
    // text: {
    //   primary: `${props.fontColor} !important`,
    // },
    background: {
      default: '#F7F9FD',
      paper: 'rgba(245,245,245,1)',
    },
  },
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        ':root': css`
          ${color}
          ${light} //overide after this line
        `,
      },
      body: {
        background: `#F7F9FD !important`,
        overflow: 'hidden',
        ...scroll,
        '*': {
          ...scroll,
          userSelect: 'none',
        },
      },
      ...normalize,
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backdropFilter: 'blur(37.5px)',
        color: '#1A2028',
        background: 'rgba(244, 246, 250, 0.01)',
        backgroundImage: `linear-gradient(90deg,
            rgba(217,217,217,1) 0%, 
            rgba(253,253,253,1) 25%, 
            rgba(190,203,207,1) 49%, 
            rgba(193,209,213,1) 53%, 
            rgba(245,245,245,1) 75%, 
            rgba(255,255,255, 1) 100%)`,
        borderBottom: '1px solid rgb(211,224,225)',
        boxShadow:
          '0px 2px 4px 0px rgb(153,223,223,0.2), 0px 4px 5px 0px rgb(234,244,245,0.14), 0px 1px 10px 0px rgb(0,0,0,0.12)',
      },
    },
  },
  LoginPage: {
    main: {
      background: `linear-gradient(to right bottom, rgb(220,230,233) 0%,rgb(253,253,253)50%,rgb(220,230,233) 100%) padding-box padding-box, 
    linear-gradient(to right bottom, rgb(65, 73, 85), rgba(44, 50, 59, 0)) border-box border-box`,
    },
  },
  Avatar: {},
  SwitchComponent: {
    backgroundColor: '#C5D0DF',
    color: custom.color['mako'],
    MuiSwitch: {
      '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
          transform: 'translateX(12px)',
          '& + .MuiSwitch-track': {
            opacity: 1,
            background: 'rgba(244, 246, 250, 1)',
            border: '1px solid rgba(216, 226, 241, 1)',
          },
        },
      },
      '& .MuiSwitch-thumb': {
        backgroundColor: '#C5D0DF',
        boxShadow: 'none',
        width: 10,
        height: 10,
        borderRadius: 5,
      },
      '& .MuiSwitch-track': {
        borderRadius: 8,
        opacity: 1,
        background: 'rgba(244, 246, 250, 1)',
        border: '1px solid rgba(216, 226, 241, 1)',
      },
    },
  },
  NewTileComponent: {
    backgroundColor: '#C5D0DF',
    boxShadow: '0px 5px 20px #C2D8DE',
    fontWeight: 500,
    root: {
      border: '1px solid transparent',
      backgroundColor: 'rgba(194, 216, 222, 0.5)',
      background: `linear-gradient(to right,rgba(194, 216, 222, 0.5),rgba(194, 216, 222, 0.5)) padding-box,
      linear-gradient(to right,rgba(216, 226, 241, 1), rgba(139, 156, 180, 0)) border-box`,
      borderRadius: '15px',
      padding: '2px 16px 2px 5px',
      '&:hover': {
        background: `linear-gradient(to right,rgba(216, 226, 241, 1),rgba(139, 156, 180, 0.2)) padding-box,
        linear-gradient(to right,rgba(216, 226, 241, 1), rgba(139, 156, 180, 0)) border-box`,
      },
    },
  },
  DrawerComponent: {
    backgroundColor: '#F7F9FD',
    title: {
      color: 'rgba(126, 131, 143, 1)',
      backgroundImage: `linear-gradient(90deg, 
        rgba(217,217,217,1) 0%, 
        rgba(253,253,253,1) 25%, 
        rgba(220,230,233,1) 49%, 
        rgba(220,230,233,1) 53%, 
        rgba(245,245,245,1) 75%, 
        rgba(255,255,255, 1) 100%)`,
    },
  },
  TileComponent: {
    background: `linear-gradient(to right bottom, rgb(220,230,233) 0%,rgb(253,253,253)50%,rgb(220,230,233) 100%) padding-box padding-box, 
    linear-gradient(to right bottom, rgb(65, 73, 85), rgba(44, 50, 59, 0)) border-box border-box`,
    boxShadow: `0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)`,
    border: '0px solid transparent',
    title: {
      color: '#1A2028',
      fontWeight: 600,
    },
    button: {
      backgroundColor: 'rgba(213,222,234,0.8)',
      border: '1px solid rgba(213,222,234,1)',
      color: custom.color['silver'],
      '&:hover': {
        backgroundColor: 'rgba(213,222,234,1)',
      },
    },
  },
  TabItem: {
    TextBox: {
      '& input': {
        textOverflow: 'ellipsis',
        color: '#616670',
      },
    },
    Button: {
      color: '#616670',
      width: 22,
      height: 22,
    },
  },
  HomePage: {
    Addtab: {
      background: '#c6c8cb',
      color: '#1A2028',
      width: '24px',
      height: '24px',
      minWidth: '24px',
      minHeight: '24px',
      padding: '4px',
      '& svg': {
        width: '16px',
        height: '16px',
      },
      '&:hover': {
        background: '#c6c8cb',
        color: '#1A2028',
      },
    },
    Box: {
      boxShadow:
        '0px 2px 4px -1px rgb(153 223 223 / 20%), 0px 4px 5px 0px rgb(234 244 245 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
    },
    'MuiTabs-indicator': {
      borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
      borderRight: '1px solid rgba(255, 255, 255, 0.2)',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      background: '#F7F9FD',
      boxShadow:
        '0px 2px 4px -1px rgb(153 223 223 / 20%), 0px 4px 5px 0px rgb(234 244 245 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
    },
  },
  MenuItem: {
    Title: {
      color: '1A2028',
    },
  },
  MuiDialog: {},
  MuiChip: {
    styleOverrides: {
      outlined: {
        backgroundColor: 'rgba(245,245,245,1)',
        border: '1px solid transparent !important',
        background: `linear-gradient(to right,rgba(245,245,245,1),rgba(245,245,245,1)) padding-box,
        linear-gradient(to right, rgba(186,186,186, 1),rgba(245,245,245,1)) border-box`,
      },
    },
  },
  MuiInputBase: {
    defaultProps: {
      margin: 'dense',
    },
    styleOverrides: {
      input: {
        '&:focus': {
          backgroundColor: 'transparent',
        },
        '&.Mui-disabled': {
          WebkitTextFillColor: 'rgba(0, 0, 0, 0.7)',
        },
        '&::placeholder': {
          color: 'rgba(0, 0, 0, 0.9)',
          opacity: 1,
        },
      },
    },
  },
  MuiInput: {
    defaultProps: {
      margin: 'dense',
    },
  },
  MuiFilledInput: {
    defaultProps: {
      margin: 'dense',
    },
    styleOverrides: {
      root: {
        backgroundColor: 'rgba(245,245,245,1)',
        transition: 'none',
        '&:hover': {
          backgroundColor: lighten('rgba(245,245,245,1)', 0.01),
          ':not(.Mui-disabled, .Mui-error)': {
            '&:before': {
              borderBottom: '2px solid',
              borderColor: lighten('rgba(186,186,186, 1)', 0.1),
            },
          },
        },
        '&:before': {
          borderBottom: '2px solid rgba(186,186,186, 1)',
        },
        '& .MuiSvgIcon-root': {
          color: 'rgba(141, 141, 141, 1)',
        },
      },
      input: {
        '&:focus': {
          backgroundColor: 'rgba(245,245,245,1)',
        },
      },
      sizeSmall: {
        '& .MuiFilledInput-input': {
          marginBottom: '4px',
        },
      },
    },
  },
  MuiOutlinedInput: {
    defaultProps: {
      margin: 'dense',
    },
    styleOverrides: {
      root: {
        backgroundColor: 'rgba(255,255,255,1)',
        border: '1px solid transparent !important',
        background: `linear-gradient(to right,rgba(255,255,255,1),rgba(237,237,237,1)) padding-box,
                     linear-gradient(to right, rgba(186,186,186, 1),rgba(245,245,245,1)) border-box`,
        '&.Mui-error': {
          background: `linear-gradient(to right,rgba(255,255,255,1),rgba(237,237,237,1)) padding-box,
                         linear-gradient(to right, rgba(255, 0, 0, 1),rgba(245,245,245,1)) border-box`,
        },
        '& input': {
          border: 0,
          zIndex: 1,
          '&::placeholder': {
            color: 'rgba(0, 0, 0, 0.87)',
            opacity: 0.8,
          },
        },
        '& svg': {
          zIndex: 1,
        },
        '& .MuiSelect-outlined': {
          zIndex: 1,
        },
        '& textarea': {
          border: 0,
          zIndex: 1,
        },
        '& .MuiSvgIcon-root': {
          color: 'rgba(141, 141, 141, 1)',
        },
        '& .MuiSelect-select': {
          zIndex: 1,
        },
      },
      notchedOutline: {
        display: 'none',
      },
    },
  },
  MuiInputLabel: {
    defaultProps: {
      margin: 'dense',
    },
    styleOverrides: {
      shrink: {
        backgroundColor: 'rgba(255,255,255,1)',
      },
    },
  },
  MuiPaper: {},
  borderColor: 'rgba(224, 224, 224, 1)',
  backgroundColorOddRow: 'rgba(49, 95, 99, 0.05)',
  backgroundColorSelectedRow: 'rgba(49, 95, 99, 0.15)',
});

export default getLightTheme;
