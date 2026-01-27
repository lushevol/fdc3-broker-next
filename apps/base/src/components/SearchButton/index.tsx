import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { lighten, styled } from '@mui/material/styles';
import type React from 'react';
import type { ReactElement } from 'react';
import type { LoadingButtonProps } from '../LoadingButton/interface';

export interface SearchButtonProps extends LoadingButtonProps {}

const SearchButtonComp = styled(Button)(() => ({
  '&.MuiButtonBase-root': {
    backgroundColor: '#2C3F5E',
    minWidth: '108px',
    color: '#FFFFFF',
  },
  '&.MuiButton-sizeSmall': {
    fontSize: '12px',
  },
  '&.Mui-disabled': {
    opacity: 0.5,
    color: 'rgba(255,255,255,0.5)',
  },
  '&:hover': {
    backgroundColor: lighten('#2C3F5E', 0.05),
  },
}));

const SearchButton: React.FC<SearchButtonProps> = (props: SearchButtonProps): ReactElement => {
  const { loading, children, loadingSize, ...others } = props;
  const ls = loadingSize ?? 14;
  return loading ? (
    <SearchButtonComp {...others} disabled>
      <CircularProgress color="inherit" size={ls} style={{ marginRight: `${ls}px` }} />
      {children}
    </SearchButtonComp>
  ) : (
    <SearchButtonComp {...others}>
      <span style={{ width: `${ls}px` }}></span>
      {children}
      <span style={{ width: `${ls}px` }}></span>
    </SearchButtonComp>
  );
};

export default SearchButton;
