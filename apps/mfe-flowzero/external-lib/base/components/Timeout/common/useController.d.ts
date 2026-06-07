import React from "react";

import { TimeoutProps } from "./interface";
declare const useController: (props: TimeoutProps) => {
  store: import("../../../hooks/model/root").RootModel;
  continuLogout: () => Promise<void>;
  extend: () => Promise<void>;
  clearAllTimeout: () => void;
  timerPopup: React.MutableRefObject<any>;
  loading: boolean;
};
export default useController;
