import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_gridfooter`;
export const classes = {
  root: `${PREFIX}-root`,
  results: `${PREFIX}-results`,
  btns: `${PREFIX}-btns`,
  label: `${PREFIX}-label`,
  totalHits: `${PREFIX}-total-hits`,
  loadedCount: `${PREFIX}-loaded-count`,
};

const Root = styled("div")(
  ({ theme }) => css`
    display: flex;
    justify-content: space-between;
    padding: 5px 10px 0 10px;
    .${classes.results} {
      display: flex;
      align-items: center;
      font-style: normal;
      font-weight: 400;
      font-size: 13px;
      line-height: 20px;
      .${classes.label} {
        margin-right: 5px;
        color: ${theme.palette.mode === "dark" ? "#FFFFFF" : "#11171D"};
      }
      .${classes.totalHits} {
        color: ${theme.palette.mode === "dark" ? "#818181" : "#4E70A8"};
      }
    }
    .${classes.btns} {
    }
  `
);

export default Root;
