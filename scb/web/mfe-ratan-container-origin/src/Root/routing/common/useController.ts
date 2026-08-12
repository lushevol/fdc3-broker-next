import React from "react";
import { ContainerProps } from "./interface";
import { ReactRouterDom } from "../../import";
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
