import { Stack } from "@mui/material";
import { css, styled } from "@mui/material/styles";
import { Table } from "antd";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_vostro`;
export const classes = {
  root: `${PREFIX}-root`,
  form: `${PREFIX}-form`,
  operations: `${PREFIX}-operations`,
  rowSelected: `${PREFIX}-row-selected`,
  infodisplay: `${PREFIX}-info-display`,
};

export const selectedListHighlight_Dark = "#1677ff47";
export const selectedListHighlight_Light = "#bae0ff7d";

export const StyledTable = styled(Table)(
  ({ theme }) =>
    css`
      margin-top: 8px;
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
    .custom-form-bottom {
      display: flex;
      order: -1;
      .extra-actions {
        display: flex;
        flex: 1;
        .${classes.infodisplay} {
          margin-left: 10px;
        }
        .${classes.operations} {
          margin-top: 0px;
        }
      }
      .custom-form-line.bottom {
        display: none;
      }
    }
    .${classes.form} {
      display: flex;
      flex-direction: column;
      .ant-form-item {
        width: 100%;
        .ant-form-item-control {
        }
        .ant-form-item-label {
          width: 135px;
        }
      }
      .anticon.anticon-info-circle {
        position: absolute;
        top: 10px;
        right: 10px;
      }
      .ant-form-item-control:has(#vostroForm_beneficiaryAccount_extra) {
        #vostroForm_beneficiaryAccount[value=""]:not(.ant-input-disabled) {
          border-color: #cf1322;
        }
        #vostroForm_beneficiaryAccount_extra {
          min-height: 0;
        }
      }
      .ant-form-item-control:has(
          #vostroForm_accountWithInstitutionAccount_extra
        ) {
        #vostroForm_accountWithInstitutionAccount_extra[value=""]:not(
            .ant-input-disabled
          ) {
          border-color: #cf1322;
        }
        #vostroForm_accountWithInstitutionAccount_extra {
          min-height: 0;
        }
      }
      .ant-form-item-control:has(#vostroForm_intermediaryAccount_extra) {
        #vostroForm_intermediaryAccount_extra[value=""]:not(
            .ant-input-disabled
          ) {
          border-color: #cf1322;
        }
        #vostroForm_intermediaryAccount_extra {
          min-height: 0;
        }
      }
      .ant-form-item-control:has(
          #vostroForm_receiversCorrespondentAccount_extra
        ) {
        #vostroForm_receiversCorrespondentAccount_extra[value=""]:not(
            .ant-input-disabled
          ) {
          border-color: #cf1322;
        }
        #vostroForm_receiversCorrespondentAccount_extra {
          min-height: 0;
        }
      }
    }
  `
);

export default Root;
