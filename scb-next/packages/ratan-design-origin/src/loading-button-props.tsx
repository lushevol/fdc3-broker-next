import CircularProgress from '@mui/material/CircularProgress';
import type { ButtonProps } from './Button.js';
import type { LoadingButtonProps } from './LoadingButton.js';

const DEFAULT_LOADING_SIZE = 14;

/** Shared presentation only; each public button retains its own styled root. */
export function getLoadingButtonProps({
  loading,
  children,
  loadingSize = DEFAULT_LOADING_SIZE,
  loadingPosition = 'inline',
  ...props
}: LoadingButtonProps): ButtonProps {
  if (loadingPosition === 'startIcon') {
    return {
      ...props,
      disabled: props.disabled || loading,
      'aria-busy': loading || undefined,
      startIcon: loading ? (
        <CircularProgress aria-hidden="true" size={loadingSize} />
      ) : props.startIcon,
      children,
    };
  }
  if (loading) {
    return {
      ...props,
      disabled: true,
      'aria-busy': true,
      children: <>
        <CircularProgress aria-hidden="true" color="inherit" size={loadingSize}
          style={{ marginRight: loadingSize }} />
        {children}
      </>,
    };
  }
  return {
    ...props,
    children: <>
      <span style={{ width: loadingSize }} />
      {children}
      <span style={{ width: loadingSize }} />
    </>,
  };
}
