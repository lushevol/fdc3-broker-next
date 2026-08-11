import { css, styled } from "@mui/material/styles";
const highlight = "var(--theme-color-field-label)";

const Root = styled("div")(
  ({ theme }) =>
    () =>
      css`
        .ant-input,
        .ant-select {
          color: ${highlight};
          overflow: hidden;
          text-overflow: ellipsis;
          .ant-select-selection-item {
            color: ${highlight};
          }
        }
        .ant-picker-input {
          input {
            color: ${highlight};
          }
        }
      `
);

export default Root;
