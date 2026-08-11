let viewName = "";
const useViewName = () => {
  const changeViewName = (name: any) => {
    viewName = name;
  };
  return { viewName, changeViewName };
};

export default useViewName;
