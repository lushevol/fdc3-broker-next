import { Stack } from "@mui/material";
import { css, styled } from "@mui/material/styles";
import { Table } from "antd";

import {
  selectedListHighlight_Dark,
  selectedListHighlight_Light,
} from "../Vostro/style";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_nostro`;
export const classes = {
  root: `${PREFIX}-root`,
  form: `${PREFIX}-form`,
  rowSelected: `${PREFIX}-row-selected`,
  operations: `${PREFIX}-operations`,
};

export const StyledTable = styled(Table)(
  ({ theme }) =>
    css`
      .ant-table-pagination {
        margin: 8px 0 0 0 !important;
      }
      .${classes.rowSelected} {
        background: ${theme.palette.mode === "dark"
          ? selectedListHighlight_Dark
          : selectedListHighlight_Light};
      }
    `
);

const Root = styled(Stack)(
  css`
    .${classes.form} {
      flex-direction: column-reverse;
      .${classes.operations} {
        /* margin-top: 8px; */
      }
      .custom-form-body {
        padding-left: 0;
        padding-right: 0;
      }
    }
  `
);

export default Root;
