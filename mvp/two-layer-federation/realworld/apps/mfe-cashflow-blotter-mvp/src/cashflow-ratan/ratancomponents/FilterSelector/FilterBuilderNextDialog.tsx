import { css, styled } from "@mui/material";
import { MuiDialog } from "../Dialog/indexMuiV1";

const FilterBuilderStyledDialog = styled(MuiDialog)(
  ({ theme }) => css`
    .dialog-body {
      min-width: 1000px;
    }
    .filter-local-build {
      display: flex;
      flex-wrap: wrap;
      margin-top: 5px;
      padding-top: 5px;
      border-top: 1px solid #8081a2;
    }
    .filter-builder-body {
      width: 890px;
      .rule-fields {
        max-width: 300px;
        min-width: 300px;
        .ant-select {
          width: 100%;
        }
      }
      .rule-operators {
        max-width: 123px;
        min-width: 123px;
        .ant-select {
          width: 100% !important;
        }
      }
    }
    .filter-local-item {
      display: flex;
      align-items: center;
      padding-right: 15px;
      height: 32px;
      .ant-checkbox-wrapper {
        margin-right: 5px;
      }
    }
  `
);

export default FilterBuilderStyledDialog;
