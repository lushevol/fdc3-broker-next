import { styled } from "ratan-design-origin/theme";
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_new_tile`;
export const classes = {
  root: `${PREFIX}-root`,
  box: `${PREFIX}-box`,
  title: `${PREFIX}-title`,
};

const Root = styled("section")(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: "flex",
    height: "46px",
    alignItems: "center",
    justifyItems: "center",
    marginRight: "3rem",
    cursor: "pointer",
    ...theme.theme["NewTileComponent"]["root"],
  },
  [`& .${classes.box}`]: {
    backgroundColor: theme.theme["NewTileComponent"]["backgroundColor"],
    boxShadow: theme.theme["NewTileComponent"]["boxShadow"],
    borderRadius: "10px",
    marginRight: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.25rem",
    width: "36px",
    height: "36px",
    "& img": {
      width: "18px",
      height: "18px",
    },
  },
  [`& .${classes.title}`]: {
    fontSize: "1rem",
    fontWeight: theme.theme["NewTileComponent"]["fontWeight"],
  },
  // when we change to new design, we apply the style into the same selector, and thenremove these two style definition.
  [`&.new-tile-icon-wrapper .${classes.box}`]: {
    backgroundColor: "unset",
    marginRight: "0 !important",
    width: "36px",
    height: "36px",
  },
  [`&.new-tile-icon-wrapper.${classes.root}`]: {
    marginRight: "0 !important",
    padding: "0px",
  },
  [`&.new-tile-icon-wrapper .${classes.box}`]: {
    marginRight: "0 !important",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    padding: "8px",
    boxSizing: "border-box",
  },
  [`.light &.new-tile-icon-wrapper .${classes.box}`]: {
    background: "rgba(255, 255, 255, 0.2)",
  },
  [`.dark &.new-tile-icon-wrapper .${classes.box}`]: {
    background: "rgba(26, 26, 26, 0.2)",
  },
  [`&.new-tile-icon-wrapper .${classes.box} .new-tile-icon-hover, &.new-tile-icon-wrapper .${classes.box} .new-tile-icon-selected`]:
    {
      display: "none",
    },
  [`&.new-tile-icon-wrapper .${classes.box}:hover .new-tile-icon, &.new-tile-icon-wrapper .${classes.box}:hover .new-tile-icon-selected`]:
    {
      display: "none",
    },
  [`&.new-tile-icon-wrapper .${classes.box}:hover .new-tile-icon-hover`]: {
    display: "block",
  },
  [`&.new-tile-icon-wrapper .${classes.box}.selected .new-tile-icon,
    &.new-tile-icon-wrapper .${classes.box}.selected .new-tile-icon-hover`]: {
    display: "none !important",
  },
  [`&.new-tile-icon-wrapper .${classes.box}.selected .new-tile-icon-selected`]:
    {
      display: "block !important",
    },
  [`& button.${classes.box}`]: {
    border: "none",
    outline: "none",
    appearance: "none",
  },
}));

export default Root;
