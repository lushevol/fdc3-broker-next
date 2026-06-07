import { AlertProps } from "@mui/material/Alert";
import React from "react";
export interface SearchConditionProps extends AlertProps {
  label: string;
  value: string;
  onClose: (event: React.SyntheticEvent<Element, Event>) => void;
}
export declare const modeStyle: (
  mode: string
) => "rgba(203, 203, 203, 1)" | "rgba(34,34,34, 1)";
declare const SearchCondition: React.FC<SearchConditionProps>;
export default SearchCondition;
