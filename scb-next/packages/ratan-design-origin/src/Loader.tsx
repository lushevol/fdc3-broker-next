import React from 'react';
import { LoaderRoot, loaderClasses as classes } from './loader-style.js';

export interface LoaderProps extends React.HTMLAttributes<HTMLElement> {
  text?: string;
  size?: number | string;
  'data-testid'?: string;
}

const outerCircle = `M20,35c-8.271,0-15-6.729-15-15S11.729,5,20,5s15,6.729,15,15S28.271,35,20,35z M20,5.203
                    C11.841,5.203,5.203,11.841,5.203,20c0,8.159,6.638,14.797,14.797,14.797S34.797,28.159,34.797,20C34.797,11.841,28.159,5.203,20,5.203z`;
const innerCircle = `M20,33.125c-7.237,0-13.125-5.888-13.125-13.125S12.763,6.875,20,6.875S33.125,12.763,33.125,
                    20S27.237,33.125,20,33.125z M20,7.078C12.875,7.078,7.078,12.875,7.078,20c0,7.125,5.797,12.922,12.922,
                    12.922S32.922,27.125,32.922,20C32.922,12.875,27.125,7.078,20,7.078z`;
const outerLine = `M5.203,20c0-8.159,6.638-14.797,14.797-14.797V5C11.729,5,5,11.729,5,20s6.729,15,15,15v-0.203C11.841,
                    34.797,5.203,28.159,5.203,20z`;
const innerLine = `M7.078,20c0-7.125,5.797-12.922,12.922-12.922V6.875C12.763,6.875,6.875,12.763,6.875,20S12.763,
                    33.125,20,33.125v-0.203C12.875,32.922,7.078,27.125,7.078,20z`;

export const Loader = /*#__PURE__*/ React.memo(function Loader({
  size = 90,
  text,
  children: _children,
  className,
  'aria-label': ariaLabel,
  ...rest
}: LoaderProps) {
  return (
    <LoaderRoot
      role="status"
      aria-live="polite"
      aria-label={ariaLabel ?? (text || 'Loading...')}
      className={[classes.root, className].filter(Boolean).join(' ')}
      {...rest}
    >
      <div className={classes.loader}>
        <div className={classes.spinner} style={{ height: size, width: size }}>
          <svg className="svg" viewBox="0 0 38 38" aria-hidden="true">
            <path className={classes.outerCircle} d={outerCircle} />
            <path className={classes.outerLine} d={outerLine} />
            <path className={classes.innerCircle} d={innerCircle} />
            <path className={classes.innerLine} d={innerLine} />
          </svg>
        </div>
        {text && <span className={classes.text}>{text}</span>}
      </div>
    </LoaderRoot>
  );
});

export interface PageLoaderProps extends LoaderProps {
  slotProps?: { loader?: LoaderProps };
}

export const PageLoader = /*#__PURE__*/ React.memo(function PageLoader({
  text,
  size,
  children: _children,
  className,
  slotProps,
  'aria-label': ariaLabel,
  ...rest
}: PageLoaderProps) {
  return (
    <LoaderRoot className={[classes.root, className].filter(Boolean).join(' ')} {...rest}>
      <div className={classes.page}>
        <Loader text={text} size={size} aria-label={ariaLabel} {...slotProps?.loader} />
      </div>
    </LoaderRoot>
  );
});
