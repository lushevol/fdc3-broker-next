import React from 'react';
import { ReactRouterDom } from '../../import';
import type { ContainerProps } from './interface';

const { useNavigate } = ReactRouterDom;

const useController = (props: ContainerProps) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (props.module && props.module.length) {
      navigate(props.module);
    }
  }, []);
  return {};
};

export default useController;
