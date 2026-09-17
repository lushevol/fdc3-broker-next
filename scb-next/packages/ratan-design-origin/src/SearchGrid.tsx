import React from "react";
import MuiGrid, { type GridProps } from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

export interface SearchGridProps extends GridProps {}

const SearchGridRoot = styled(MuiGrid)(({ theme }) => ({
  "& .MuiFormControl-root": {
    justifyContent: "space-between",
    marginBottom: theme.spacing(0.5),
    "& .MuiFormLabel-root": {
      width: "fit-content",
    },
    "&>.MuiInputBase-root": {
      width: "60%",
    },
  },
}));

export const SearchGrid = /*#__PURE__*/ React.forwardRef<
  HTMLDivElement,
  SearchGridProps
>(function SearchGrid(props, ref) {
  return <SearchGridRoot {...props} ref={ref} />;
});
