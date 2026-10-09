import React from 'react';
import { Loader, type LoaderProps } from './Loader.js';
import { LoaderRoot, loaderClasses as classes } from './loader-style.js';

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
