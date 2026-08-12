import { css, styled } from "@mui/material";

const Root = styled("div")(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    margin: 10px 10px 0 10px;
    .check {
      margin-right: 10px;
    }
    .text-input {
      margin-right: 10px;
      width: 250px;
    }
    .remove-btn {
      margin-left: 10px;
    }
    .search-field {
      width: 200px;
    }
    .baffle {
      margin: 0 5px;
      width: 1px;
      height: 20px;
      background-color: var(--theme-color-modal-filed-border);
    }
    .role-select {
      margin-right: 10px;
      width: 250px;
      .ant-select-selection-item-content {
        max-width: 130px;
      }
    }
  `
);

export default Root;
