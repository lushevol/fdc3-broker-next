declare const useController: () => {
  store: import("../../../hooks/model/root").RootModel;
  toggleTimeType: () => void;
  getTime: () => string;
};
export default useController;
