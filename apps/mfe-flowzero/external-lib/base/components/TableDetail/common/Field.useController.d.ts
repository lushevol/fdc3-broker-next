import React from "react";

import { FieldProps } from "./interface";
declare const useController: (props: FieldProps) => {
  hiddenImage: any;
  value: any;
  fieldValue: any;
  inputValue: string;
  onInputChange: (_event: any, newInputValue: any) => void;
  setFieldValue: React.Dispatch<any>;
  onChangeAutoComplete: (_event: any, newValue: any) => void;
  RenderOptions: (
    props: any,
    option: any
  ) => import("react/jsx-runtime").JSX.Element;
};
export default useController;
