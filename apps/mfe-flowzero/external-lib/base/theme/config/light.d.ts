declare const _default: {
  palette: {
    mode: string;
    primary: {
      main: string;
    };
    secondary: {
      main: string;
    };
    background: {
      default: string;
      paper: string;
    };
  };
  MuiCssBaseline: {
    styleOverrides: {
      h3: {
        margin: number;
      };
      li: {
        listStyle: string;
      };
      html: {
        ":root": import("@emotion/utils").SerializedStyles;
      };
      body: {
        "*": {
          userSelect: string;
          "&::-webkit-scrollbar": {
            height: string;
            width: string;
            borderRadius: string;
          };
          "&::-webkit-scrollbar-track": {
            background: string;
            borderRadius: string;
          };
          "&::-webkit-scrollbar-thumb": {
            background: string;
            borderRadius: string;
            border: string;
          };
          "&::-webkit-scrollbar-thumb:hover": {
            background: string;
            border: string;
          };
          "& .ag-root-wrapper": {
            minHeight: string;
          };
        };
        "&::-webkit-scrollbar": {
          height: string;
          width: string;
          borderRadius: string;
        };
        "&::-webkit-scrollbar-track": {
          background: string;
          borderRadius: string;
        };
        "&::-webkit-scrollbar-thumb": {
          background: string;
          borderRadius: string;
          border: string;
        };
        "&::-webkit-scrollbar-thumb:hover": {
          background: string;
          border: string;
        };
        "& .ag-root-wrapper": {
          minHeight: string;
        };
        background: string;
        overflow: string;
      };
    };
  };
  MuiAppBar: {
    styleOverrides: {
      root: {
        backdropFilter: string;
        color: string;
        background: string;
        backgroundImage: string;
        borderBottom: string;
        boxShadow: string;
      };
    };
  };
  LoginPage: {
    main: {
      background: string;
    };
  };
  Avatar: {};
  SwitchComponent: {
    backgroundColor: string;
    color: string;
    MuiSwitch: {
      "& .MuiSwitch-switchBase": {
        padding: number;
        "&.Mui-checked": {
          transform: string;
          "& + .MuiSwitch-track": {
            opacity: number;
            background: string;
            border: string;
          };
        };
      };
      "& .MuiSwitch-thumb": {
        backgroundColor: string;
        boxShadow: string;
        width: number;
        height: number;
        borderRadius: number;
      };
      "& .MuiSwitch-track": {
        borderRadius: number;
        opacity: number;
        background: string;
        border: string;
      };
    };
  };
  NewTileComponent: {
    backgroundColor: string;
    boxShadow: string;
    fontWeight: number;
    root: {
      border: string;
      backgroundColor: string;
      background: string;
      borderRadius: string;
      padding: string;
      "&:hover": {
        background: string;
      };
    };
  };
  DrawerComponent: {
    backgroundColor: string;
    title: {
      color: string;
      backgroundImage: string;
    };
  };
  TileComponent: {
    background: string;
    boxShadow: string;
    border: string;
    title: {
      color: string;
      fontWeight: number;
    };
    button: {
      backgroundColor: string;
      border: string;
      color: string;
      "&:hover": {
        backgroundColor: string;
      };
    };
  };
  TabItem: {
    TextBox: {
      "& input": {
        textOverflow: string;
        color: string;
      };
    };
    Button: {
      color: string;
      width: number;
      height: number;
    };
  };
  HomePage: {
    Addtab: {
      background: string;
      color: string;
      width: string;
      height: string;
      minWidth: string;
      minHeight: string;
      padding: string;
      "& svg": {
        width: string;
        height: string;
      };
      "&:hover": {
        background: string;
        color: string;
      };
    };
    Box: {
      boxShadow: string;
    };
    "MuiTabs-indicator": {
      borderLeft: string;
      borderRight: string;
      borderTop: string;
      background: string;
      boxShadow: string;
    };
  };
  MenuItem: {
    Title: {
      color: string;
    };
  };
  MuiDialog: {};
  MuiChip: {
    styleOverrides: {
      outlined: {
        backgroundColor: string;
        border: string;
        background: string;
      };
    };
  };
  MuiInputBase: {
    defaultProps: {
      margin: string;
    };
    styleOverrides: {
      input: {
        "&:focus": {
          backgroundColor: string;
        };
        "&.Mui-disabled": {
          "-webkit-text-fill-color": string;
        };
        "&::placeholder": {
          color: string;
          opacity: number;
        };
      };
    };
  };
  MuiInput: {
    defaultProps: {
      margin: string;
    };
  };
  MuiFilledInput: {
    defaultProps: {
      margin: string;
    };
    styleOverrides: {
      root: {
        backgroundColor: string;
        transition: string;
        "&:hover": {
          backgroundColor: string;
          ":not(.Mui-disabled, .Mui-error)": {
            "&:before": {
              borderBottom: string;
              borderColor: string;
            };
          };
        };
        "&:before": {
          borderBottom: string;
        };
        "& .MuiSvgIcon-root": {
          color: string;
        };
      };
      input: {
        "&:focus": {
          backgroundColor: string;
        };
      };
      sizeSmall: {
        "& .MuiFilledInput-input": {
          marginBottom: string;
        };
      };
    };
  };
  MuiOutlinedInput: {
    defaultProps: {
      margin: string;
    };
    styleOverrides: {
      root: {
        backgroundColor: string;
        border: string;
        background: string;
        "&.Mui-error": {
          background: string;
        };
        "& input": {
          border: number;
          zIndex: number;
          "&::placeholder": {
            color: string;
            opacity: number;
          };
        };
        "& svg": {
          zIndex: number;
        };
        "& .MuiSelect-outlined": {
          zIndex: number;
        };
        "& textarea": {
          border: number;
          zIndex: number;
        };
        "& .MuiSvgIcon-root": {
          color: string;
        };
        "& .MuiSelect-select": {
          zIndex: number;
        };
      };
      notchedOutline: {
        display: string;
      };
    };
  };
  MuiInputLabel: {
    defaultProps: {
      margin: string;
    };
    styleOverrides: {
      shrink: {
        backgroundColor: string;
      };
    };
  };
  MuiPaper: {};
  borderColor: string;
  backgroundColorOddRow: string;
  backgroundColorSelectedRow: string;
};
export default _default;
