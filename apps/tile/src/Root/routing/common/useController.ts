import React from 'react';
import { ReactRouterDom } from '../../import';
import type { TileProps } from './interface';

const { useNavigate, useResolvedPath } = ReactRouterDom;

const useController = (props: TileProps) => {
  const navigate = useNavigate();
  const path = useResolvedPath();
  React.useEffect(() => {
    if (props.tile && props.tile.length) {
      navigate(`${path.pathname}${props.tile}`);
    }
    return () => {};
  }, []);
  return {};
};

export default useController;
