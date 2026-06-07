declare const useController: () => {
  store: import("../../../hooks/model/root").RootModel;
  toggleColorMode: () => void;
};
export default useController;
