import { css, styled } from "@mui/material/styles";
const styleRoot = styled("div")(
  css`
    display: flex;
    .field-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--theme-color-modal-label);

      .ant-space {
        color: var(--theme-color-modal-label);
        justify-content: right;
      }
    }

    .field-label-label {
      padding-right: 10px;
      white-space: nowrap;
      text-align: right;
    }

    .field-label-children {
      display: flex;
      flex: 1 1;
      overflow: hidden;
    }
  `
);

export default styleRoot;
