import { css, styled } from "@mui/material";

const Root = styled("div")(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    margin-top: 10px;
    border-bottom: 1px solid var(--theme-color-dialog-name-border);
    .text-input {
      margin-right: 10px;
      width: 281px;
    }
    .remove-btn {
      margin-left: 10px;
    }
    .role-select {
      margin-right: 10px;
      width: 280px;
    }
  `
);

export default Root;
