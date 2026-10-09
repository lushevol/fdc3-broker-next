import { styled } from "ratan-design-origin/theme";
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_splash`;
export const classes = {
  root: `${PREFIX}-root`,
  splash: `${PREFIX}-splash`,
};

const Root = styled("section")(() => ({
  [`&.${classes.root}`]: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  [`& .${classes.splash}`]: {
    // background: "url(/image/fmo-app-portal-splash.png) no-repeat center",
  },
}));

export default Root;
