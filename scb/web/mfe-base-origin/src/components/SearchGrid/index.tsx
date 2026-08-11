import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
const SearchGrid = styled(Grid)(({ theme }) => ({
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

export default SearchGrid;
