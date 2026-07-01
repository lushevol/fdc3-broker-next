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
      margin-bottom: 8px;
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

const customFeildStyle = `
  .ant-form-item-label {
    flex: 0 0 20%;
  }
  .ant-form-item-control {
    max-width: 100%;
    flex: 0 0 80%;
  }
`;
const customFeildStyle_fullValue = `
  .ant-form-item-label {
    flex: 0 0 20%;
    text-align: left;
    & > label {
      margin-left: 22px;
      &::after {
        display: none;
      }
    }
  }
  .ant-form-item-control {
    max-width: 100%;
    flex: 0 0 80%;
  }
`;
const bicFieldStyle = `
  .ant-form-item-control {
    flex: 0 0 40%;
  }
`;
const hasSpaceFeildStyle = `
  .ant-form-item-label {
    flex: 0 0 20%;
    min-height: 45px;
  }
  .ant-form-item-control {
    max-width: 100%;
    flex: 0 0 80%;
  }
`;
const Root = styled(Stack)(
  css`
    .custom-form-bottom {
      display: flex;
      .extra-actions {
        display: flex;
        flex: 1;
        .${classes.infodisplay} {
          margin-left: 10px;
        }
      }
      .custom-form-line.bottom {
        display: none;
      }
    }
    .${classes.form} {
      flex-direction: column-reverse;
      .ant-form-item {
        width: 33%;
        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(4) {
          width: 34%;
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
      .custom-form-body {
        display: grid;
        grid-template-columns: 83px 100px 3.5fr 4.3fr 4.2fr;
        grid-auto-rows: auto;
        grid-template-areas:
          ". . ssiType swiftType ."
          ". . settlementMeans settlementAccount coveredPayment"
          "divider1 divider1 divider1 divider1 divider1"
          "beneficiaryFieldsTitle beneficiaryFieldsTitle beneficiaryBic beneficiaryName beneficiaryName2"
          ". . beneficiaryAddress beneficiaryAddress beneficiaryAccount"
          ". . isThirdPartyPayment charges beneficiaryCity"
          "divider2 divider2 divider2 divider2 divider2"
          "accWithInstTitle accWithInstTitle accWithInstBic accWithInstName accWithInstAccount"
          ". . accWithInstAddress accWithInstAddress accWithInstCity"
          "intermediaryTitle intermediaryTitle intermediaryBic intermediaryName intermediaryAccount"
          ". . intermediaryAddress intermediaryAddress intermediaryCity"
          "recrCorresTitle recrCorresTitle recrCorresBic recrCorresName recrCorresAccount"
          ". . recrCorresAddress recrCorresAddress recrCorresCity"
          "divider3 divider3 divider3 divider3 divider3"
          "orderingFieldsTitle orderingFieldsTitle orderingBic orderingName orderingAccount"
          ". . orderingAddress orderingAddress orderingCity"
          "divider4 divider4 divider4 divider4 divider4"
          "additionalInfoTitle additionalInfoTitle str1 str2 str3"
          ". . str4 str5 str6"
          "remittanceInformTitle remittanceInformTitle ri1 ri2 ri3"
          ". . ri4 . ."
          "divider5 divider5 divider5 divider5 divider5"
          "popDubai1 popDubai1 popDubai1 popDubai1 popDubai1";
        .ant-divider {
          &:nth-child(5) {
            grid-area: divider1;
          }
          &:nth-child(17) {
            grid-area: divider2;
          }
          &:nth-child(41) {
            grid-area: divider3;
          }
          &:nth-child(49) {
            grid-area: divider4;
          }
          &:nth-child(61) {
            grid-area: divider5;
          }
        }
        .custom-form-classify {
          display: flex;
          justify-content: center;
          align-items: center;
          &:nth-child(6) {
            grid-area: beneficiaryFieldsTitle;
          }
          &:nth-child(18) {
            grid-area: accWithInstTitle;
          }
          &:nth-child(26) {
            grid-area: intermediaryTitle;
          }
          &:nth-child(34) {
            grid-area: recrCorresTitle;
          }
          &:nth-child(42) {
            grid-area: orderingFieldsTitle;
          }
          &:nth-child(50) {
            grid-area: additionalInfoTitle;
          }
          &:nth-child(57) {
            grid-area: remittanceInformTitle;
          }
        }
        .ant-form-item {
          width: unset;
          &.has-btn {
            .ant-form-item-control {
              padding-right: 0;
            }
          }
          &:nth-child(1) {
            grid-area: ssiType;
          }
          &:nth-child(2) {
            grid-area: swiftType;
          }
          &:nth-child(3) {
            grid-area: settlementMeans;
          }
          &:nth-child(4) {
            grid-area: settlementAccount;
          }
          &:nth-child(7) {
            grid-area: beneficiaryBic;
            ${bicFieldStyle}
          }
          &:nth-child(8) {
            grid-area: beneficiaryName;
            ${customFeildStyle}
          }
          &:nth-child(9) {
            grid-area: beneficiaryName2;
            ${customFeildStyle}
          }
          &:nth-child(10) {
            grid-area: beneficiaryAddress;
            ${customFeildStyle}
          }
          &:nth-child(11) {
            grid-area: beneficiaryCity;
            ${customFeildStyle}
          }
          &:nth-child(12) {
            grid-area: beneficiaryAccount;
            ${customFeildStyle}
          }
          &:nth-child(14) {
            grid-area: isThirdPartyPayment;
          }
          &:nth-child(15) {
            grid-area: coveredPayment;
            .ant-form-item-label {
              max-width: 100%;
              flex: 0 0 40%;
            }
          }
          &:nth-child(16) {
            grid-area: charges;
            ${customFeildStyle}
          }
          &:nth-child(19) {
            grid-area: accWithInstBic;
            ${bicFieldStyle}
          }
          &:nth-child(20) {
            grid-area: accWithInstName;
            ${customFeildStyle}
          }
          &:nth-child(22) {
            grid-area: accWithInstAddress;
            ${customFeildStyle}
          }
          &:nth-child(23) {
            grid-area: accWithInstCity;
            ${hasSpaceFeildStyle}
          }
          &:nth-child(24) {
            grid-area: accWithInstAccount;
            ${customFeildStyle}
          }
          &:nth-child(27) {
            grid-area: intermediaryBic;
            ${bicFieldStyle}
          }
          &:nth-child(28) {
            grid-area: intermediaryName;
            ${customFeildStyle}
          }
          &:nth-child(30) {
            grid-area: intermediaryAddress;
            ${customFeildStyle}
          }
          &:nth-child(31) {
            grid-area: intermediaryCity;
            ${hasSpaceFeildStyle}
          }
          &:nth-child(32) {
            grid-area: intermediaryAccount;
            ${customFeildStyle}
          }
          &:nth-child(35) {
            grid-area: recrCorresBic;
            ${bicFieldStyle}
          }
          &:nth-child(36) {
            grid-area: recrCorresName;
            ${customFeildStyle}
          }
          &:nth-child(38) {
            grid-area: recrCorresAddress;
            ${customFeildStyle}
          }
          &:nth-child(39) {
            grid-area: recrCorresCity;
            ${customFeildStyle}
          }
          &:nth-child(40) {
            grid-area: recrCorresAccount;
            ${customFeildStyle}
          }
          &:nth-child(43) {
            grid-area: orderingBic;
            ${bicFieldStyle}
          }
          &:nth-child(44) {
            grid-area: orderingName;
            ${customFeildStyle}
          }
          &:nth-child(46) {
            grid-area: orderingAddress;
            ${customFeildStyle}
          }
          &:nth-child(47) {
            grid-area: orderingCity;
            ${customFeildStyle}
          }
          &:nth-child(48) {
            grid-area: orderingAccount;
            ${customFeildStyle}
          }
          &:nth-child(51) {
            grid-area: str1;
            ${customFeildStyle}
          }
          &:nth-child(52) {
            grid-area: str2;
            ${customFeildStyle}
          }
          &:nth-child(53) {
            grid-area: str3;
            ${customFeildStyle}
          }
          &:nth-child(54) {
            grid-area: str4;
            ${customFeildStyle}
          }
          &:nth-child(55) {
            grid-area: str5;
            ${customFeildStyle}
          }
          &:nth-child(56) {
            grid-area: str6;
            ${hasSpaceFeildStyle}
          }
          &:nth-child(58) {
            grid-area: ri1;
            ${customFeildStyle}
          }
          &:nth-child(59) {
            grid-area: ri2;
            ${customFeildStyle}
          }
          &:nth-child(60) {
            grid-area: ri3;
            ${customFeildStyle}
          }
          &:nth-child(61) {
            grid-area: ri4;
            ${customFeildStyle}
          }
          &:nth-child(62) {
            grid-area: popDubai1;
            ${customFeildStyle_fullValue}
          }
          &:nth-child(63) {
            display: none;
          }
          &:nth-child(64) {
            display: none;
          }
        }
      }
      .${classes.operations} {
        margin-top: 0px;
      }
    }
  `
);

export default Root;
