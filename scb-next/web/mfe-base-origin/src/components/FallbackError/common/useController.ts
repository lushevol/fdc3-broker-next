import React from "react";
import { ErrorState } from "../../../hooks/model/root";
import { useContext } from "../../../hooks/provider";

const useController = (props: ErrorState) => {
  const [store] = useContext();
  let emailSupport = props.emailSupport;
  if (
    !emailSupport &&
    store?.currentWorkspace?.containers?.length &&
    store?.currentWorkspace?.containers[0]?.emailSupport &&
    store?.currentWorkspace?.containers[0]?.emailSupport.length
  ) {
    emailSupport = store?.currentWorkspace?.containers[0]?.emailSupport;
  }

  return { emailSupport };
};

export default useController;
