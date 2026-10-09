import { styled } from "ratan-design-origin/theme";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_menuItem`;
export const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
};

const Root = styled("section")(({ theme }) => ({
  marginBottom: "3rem",
  [`& .${classes.content}`]: {
    display: "flex",
  },
  [`& .${classes.title}`]: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "1rem",
    ...theme.theme["MenuItem"]["Title"],
  },
}));

export default Root;
