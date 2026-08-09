import { css, styled } from "@mui/material/styles";
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_Loader`;
export const classes = {
  root: `${PREFIX}-root`,
  page: `${PREFIX}-page`,
  text: `${PREFIX}-text`,
  loader: `${PREFIX}-loader`,
  spinner: `${PREFIX}-spinner`,
  svg: `${PREFIX}-svg`,
  outerLine: `${PREFIX}-outerLine`,
  outerCircle: `${PREFIX}-outerCircle`,
  innerLine: `${PREFIX}-innerLine`,
  innerCircle: `${PREFIX}-innerCircle`,
};

const Root = styled("section")(() => ({
  [`&.${classes.root}`]: {
    textAlign: "center",
    zIndex: 2,
  },
  [`& .${classes.page}`]: css`
    width: 100%;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    align-items: center;
    justify-content: center;
    display: flex;
  `,
  [`& .${classes.loader}`]: css`
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,
  [`& .${classes.text}`]: css`
    fill: rgb(102, 102, 102);
    color: rgb(102, 102, 102);
    letter-spacing: 0.6px;
    text-overflow: ellipsis;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
    flex-shrink: 0;
    font-size: 18px;
    text-transform: capitalize;
  `,
  [`& .${classes.spinner}`]: {
    display: "table",
    margin: "0 auto",
    maxWidth: "90px",
    maxHeight: "90px",
    padding: "1px",
    //background: "rgba(255,255,255,1%)",
    borderRadius: "50px",
  },
  [`& .${classes.svg}`]: {
    flexShrink: 0,
  },
  [`& .${classes.outerLine}`]: css`
    fill: rgb(57, 161, 205);
    stroke: rgb(57, 161, 205);
    stroke-width: 0.6027;
    stroke-miterlimit: 10;
    animation: rotate 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    transform-origin: 20px 20px;
  `,
  [`& .${classes.outerCircle}`]: css`
    fill: rgb(204, 204, 204);
  `,
  [`& .${classes.innerLine}`]: css`
    fill: rgb(153, 204, 0);
    stroke: rgb(153, 204, 0);
    stroke-width: 0.2027;
    stroke-miterlimit: 10;
    animation: rotate 1s linear infinite;
    transform-origin: 20px 20px;
  `,
  [`& .${classes.innerCircle}`]: css`
    fill: rgb(204, 204, 204);
  `,
}));

export default Root;
