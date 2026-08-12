import { styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_api_status`;
export const classes = {
  root: `${PREFIX}-root`,
  menuItem: `${PREFIX}-menuItem`,
};

const Root = styled("section")(() => ({
  [`&.${classes.root}`]: {
    marginRight: "10px",
    "& svg.not_available": {
      color: "#c72121",
    },
    "& svg.available": {
      color: "green",
    },
  },
}));

export const MenuStyled = styled(Menu)(({ theme }) => ({
  [`& .${classes.menuItem}`]: {
    cursor: "default",
    fontSize: "12px",
    marginBottom: "8px",
    padding: "4px 6px",
    "& section": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "& div": {
      display: "flex",
      justifyContent: "start",
      alignItems: "baseline",

      "& svg": {
        marginRight: "8px",
      },
    },
    "& .undefined": {
      "& svg": {
        color: "#564e4e",
      },
    },
    "& .available": {
      "& svg": {
        color: "green",
      },
    },

    "& .not_available": {
      "& svg": {
        color: "#c72121",
      },
    },
  },
}));
export default Root;
