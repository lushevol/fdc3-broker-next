import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import type React from 'react';
import type { ReactElement } from 'react';
import type { LoadingButtonProps } from './interface';

const LoadingButton: React.FC<LoadingButtonProps> = (props: LoadingButtonProps): ReactElement => {
  const { loading, children, loadingSize, ...others } = props;
  const ls = loadingSize ?? 14;
  return loading ? (
    <Button {...others} disabled>
      <CircularProgress color="inherit" size={ls} style={{ marginRight: `${ls}px` }} />
      {children}
    </Button>
  ) : (
    <Button {...others}>
      <span style={{ width: `${ls}px` }}></span>
      {children}
      <span style={{ width: `${ls}px` }}></span>
    </Button>
  );
};

export default LoadingButton;
