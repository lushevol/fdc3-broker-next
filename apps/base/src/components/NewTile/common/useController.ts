import { useContext } from '../../../hooks/provider';

const useController = () => {
  const [store] = useContext();

  return {
    store,
  };
};

export default useController;
