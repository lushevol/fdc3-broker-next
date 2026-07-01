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
  React.useEffect(() => {
    const handler = (event: Event) => {
      const route = (event as CustomEvent<{ route?: string }>).detail?.route;
      if (route?.startsWith("/flowzero/")) {
        navigate(route);
      }
    };

    window.addEventListener("flowzero:navigate", handler);
    return () => window.removeEventListener("flowzero:navigate", handler);
  }, [navigate]);
  return {};
};

export default useController;
