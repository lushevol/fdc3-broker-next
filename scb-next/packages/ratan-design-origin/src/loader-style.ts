import { legacyTokens } from './tokens/legacy.js';
import { newStyleTokens } from './tokens/webkit.js';
import type React from 'react';
import type { StyledComponent } from '@emotion/styled';
import { css, styled, type SxProps, type Theme } from '@mui/material/styles';
const PREFIX = 'ratan-design-loader';
export const loaderClasses = {
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

export const LoaderRoot: StyledComponent<
  {
    theme?: Theme;
    as?: React.ElementType;
    sx?: SxProps<Theme>;
  },
  React.ComponentProps<'section'>
> = /*#__PURE__*/ styled('section')(({ theme }) => {
  const webkit = theme.ratan?.designGeneration === 'webkit';
  return {
    [`&.${loaderClasses.root}`]: {
      textAlign: 'center',
      zIndex: 2,
    },
    [`& .${loaderClasses.page}`]: css`
      width: 100%;
      height: 100vh;
      position: absolute;
      left: 0;
      top: 0;
      align-items: center;
      justify-content: center;
      display: flex;
    `,
    [`& .${loaderClasses.loader}`]: css`
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
    [`& .${loaderClasses.text}`]: css`
      fill: ${webkit ? newStyleTokens.color.textMuted : legacyTokens.color['base-color-grey']};
      color: ${webkit ? newStyleTokens.color.textMuted : legacyTokens.color['base-color-grey']};
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
    [`& .${loaderClasses.spinner}`]: {
      display: 'table',
      margin: '0 auto',
      maxWidth: '90px',
      maxHeight: '90px',
      padding: '1px',
      //background: "rgba(255,255,255,1%)",
      borderRadius: '50px',
    },
    [`& .${loaderClasses.svg}`]: {
      flexShrink: 0,
    },
    [`& .${loaderClasses.outerLine}`]: css`
      fill: ${webkit ? newStyleTokens.color.info : legacyTokens.color['base-color-blue']};
      stroke: ${webkit ? newStyleTokens.color.info : legacyTokens.color['base-color-blue']};
      stroke-width: 0.6027;
      stroke-miterlimit: 10;
      animation: rotate 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      transform-origin: 20px 20px;
    `,
    [`& .${loaderClasses.outerCircle}`]: css`
      fill: ${webkit ? newStyleTokens.color.border : legacyTokens.color['base-color-grey-xlight']};
    `,
    [`& .${loaderClasses.innerLine}`]: css`
      fill: ${webkit ? newStyleTokens.color.success : legacyTokens.color['base-color-green']};
      stroke: ${webkit ? newStyleTokens.color.success : legacyTokens.color['base-color-green']};
      stroke-width: 0.2027;
      stroke-miterlimit: 10;
      animation: rotate 1s linear infinite;
      transform-origin: 20px 20px;
    `,
    [`& .${loaderClasses.innerCircle}`]: css`
      fill: ${webkit ? newStyleTokens.color.border : legacyTokens.color['base-color-grey-xlight']};
    `,
  };
});
