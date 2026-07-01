import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_loading`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled("div")(
  css`
    height: 100%;
    width: 100%;
    display: flex;
    .${classes.root} {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      .spinner {
        display: table;
        margin: 0 auto;
        max-width: 235px;
        max-height: 235px;
      }
      .text {
        fill: var(--theme-color-loading-text);
        letter-spacing: 0.6px;
        text-overflow: ellipsis;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-align: center;
        flex-shrink: 0;
        font-size: 12px;
      }
      .svg {
        flex-shrink: 0;
      }

      .outerLine {
        fill: var(--theme-color-loading-blue);
        stroke: var(--theme-color-loading-blue);
        stroke-width: 0.6027;
        stroke-miterlimit: 10;
        animation: rotate 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        transform-origin: 20px 20px;
      }

      .outerCircle {
        fill: var(--theme-color-loading-grey);
      }

      .innerLine {
        fill: var(--theme-color-loading-green);
        stroke: var(--theme-color-loading-green);
        stroke-width: 0.2027;
        stroke-miterlimit: 10;
        animation: rotate 1.8s linear infinite;
        transform-origin: 20px 20px;
      }

      .innerCircle {
        fill: var(--theme-color-loading-grey);
      }
    }

    @keyframes blink {
      0%,
      100% {
        opacity: 0;
      }

      50% {
        opacity: 1;
      }
    }

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }
  `
);

export default Root;
