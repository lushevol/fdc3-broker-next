import React from "react";

import { ReactRouterDom } from "../../import";
import { TileProps } from "./interface";
const { useNavigate, useLocation } = ReactRouterDom;

const useController = (props: TileProps) => {
  const navigate = useNavigate();
  const path = useLocation();
  React.useEffect(() => {
    if (props.tile?.length) {
      navigate(`${props.module}${props.tile}`);
    }
    return () => {};
  }, []);
  return {};
};

export default useController;
