import { css } from "@emotion/css";
import { styled } from "@mui/material/styles";
import { TileProps } from "./interface";

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
  if (imageLightTheme.includes("lightIcons")) {
    imageLightTheme = `image/${imageLightTheme}`;
  }
  let imageDarkTheme = props.imageDarkTheme;
  if (imageDarkTheme.includes("darkIcons")) {
    imageDarkTheme = `image/${imageDarkTheme}`;
  }
  return css`
    cursor: ${props.disabled ? undefined : "pointer"};
    border-radius: 8px;
    background-position-x: right;
    background-position-y: bottom;
    border-radius: 5px;
    opacity: ${props.disabled ? 0.5 : 0.85};
    &:hover {
      opacity: ${props.disabled ? 0.5 : 1};
    }
    & .${classes.main} {
      background-color: ${props.disabled ? "rgba(0,0,0,0.05)" : "transparent"};
      background-image: url(/${theme === "light"
        ? imageLightTheme
        : imageDarkTheme});
      background-size: contain;
      background-repeat: no-repeat;
      background-position: bottom right;
      padding: 0.5rem;
    }
  `;
};

const Root = styled("section")(({ theme }) => ({
  width: "100%",
  background: theme.theme["TileComponent"]["background"],
  boxShadow: theme.theme["TileComponent"]["boxShadow"],
  border: theme.theme["TileComponent"]["border"],
  [`& .${classes.content}`]: {
    height: "34px",
    display: "flex",
    alignItems: "end",
    "& .MuiButton-root": {
      borderRadius: "10px",
      minWidth: "auto",
      width: "auto",
      padding: theme.shape.borderRadius,
      ...theme.theme["TileComponent"]["button"],
    },
    "& .Mui-disabled": {
      color: "rgb(115 121 126)",
    },
  },
  [`& .${classes.title}`]: {
    height: "75px",
    fontSize: "0.875rem",
    fontWeight: theme.theme["TileComponent"]["title"]["fontWeight"],
    whiteSpace: "nowrap",
    overflow: "hidden",
    color: theme.theme["TileComponent"]["title"]["color"],
    p: {
      margin: 0,
      fontSize: "12px",
    },
  },
  [`& .${classes.titledisabled}`]: {
    height: "75px",
    fontSize: "0.875rem",
    fontWeight: 300,
    "white-space": "nowrap",
    color: "rgb(115 121 126)",
    p: {
      margin: 0,
      fontSize: "12px",
    },
  },
}));

export default Root;
