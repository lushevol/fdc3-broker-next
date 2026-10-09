import { styled } from "ratan-design-origin/theme";
import { Menu } from "ratan-design-origin/primitives";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_avatar`;
export const classes = {
  root: `${PREFIX}-root`,
  img: `${PREFIX}-img`,
  disable: `${PREFIX}-disable`,
};

const Root = styled("section")(() => ({
  [`&.${classes.root}`]: {
    marginLeft: "1.5rem",
  },
  [`& .${classes.img}`]: {
    boxShadow:
      "1px 1px 8px 1px rgb(45 137 137 / 20%), 1px 1px 8px 1px rgb(65 141 149 / 14%), 1px 1px 8px 1px rgb(26 163 179 / 12%)",
  },
}));

export const MenuStyled = styled(Menu)(({ theme }) => ({
  ...theme.theme["Avatar"]["menu"],
  [`& .${classes.disable}`]: {
    cursor: "default",
    background: "inherit !important",
  },
}));
export default Root;
