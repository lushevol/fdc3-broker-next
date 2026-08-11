import React from "react";
import { AdminModuleProps } from "./interface";
import { useNavigate } from "react-router-dom";

const useController = (props: AdminModuleProps) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (props?.module?.length) {
      navigate(props.module);
    }
    return () => {};
  }, []);
  return {};
};

export default useController;
