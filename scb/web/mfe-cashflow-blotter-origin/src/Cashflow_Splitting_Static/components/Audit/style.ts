import { css, styled } from "@mui/material/styles";
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_Cashflow_Splitting_Rule_Audit_Data_Grid`;
export const classes = {
  rulesAuditDataGrid: `${PREFIX}-rules-data-grid`,
};

const StyledRuleDataGridRoot = styled("div")(
  () => css`
    flex: 1;
    .${classes.rulesAuditDataGrid} {
      height: 100%;
      .ag-react-container {
        padding-left: 5px;
        height: 100%;
      }
    }
  `
);
export default StyledRuleDataGridRoot;
