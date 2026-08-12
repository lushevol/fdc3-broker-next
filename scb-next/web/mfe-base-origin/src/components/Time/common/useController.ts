import React from "react";
import { useContext } from "../../../hooks/provider";

export const excludedList = ["Trade_Id", "Package_Id"];

export const includesArray = (list: any[], data: any) => {
  if (Array.isArray(data)) {
    let isTrue = false;
    data.forEach((item) => {
      if (list.includes(item)) {
        isTrue = true;
      }
    });
    return isTrue;
  }
  return list.includes(data);
};

const useController = () => {
  const [store] = useContext();
  return {
    store,
  };
};

export default useController;
