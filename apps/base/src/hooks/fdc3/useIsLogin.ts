import { useMemo } from 'react';
import { useContext } from '../provider';

export const useIsLogin = () => {
  const [store] = useContext();

  const isLogin = useMemo(() => {
    return store.token && store.entities;
  }, [store]);

  return {
    isLogin,
  };
};
