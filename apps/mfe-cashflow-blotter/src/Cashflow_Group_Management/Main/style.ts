import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_App`;
export const classes = {
  ratanCashflow: `${PREFIX}-ratan-cashflow`,
  searchSection: `${PREFIX}-search-section`,
  searchSectionHeader: `${PREFIX}-search-section-header`,
  searchSectionBody: `${PREFIX}-search-section-body`,
  hide: `${PREFIX}-hide`,
  visible: `${PREFIX}-visible`,
  highlight: `${PREFIX}-search-section-header-highlight`,
  box: `${PREFIX}-search-section-body-box`,
  border: `${PREFIX}-search-section-body-border`,
  label: `${PREFIX}-search-section-body-label`,
};

const Root = styled("div")(
  ({ theme }) =>
    css`
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
      min-height: calc(100vh - 120px);
      .${classes.searchSection} {
        display: flex;
        flex-direction: column;
        transition: ${theme.transitions.create(["height", "opacity"], {
          duration: theme.transitions.duration.enteringScreen,
        })};
        padding: 0 10px;
        &.hide {
          height: 0;
          opacity: 0;
        }
        .${classes.searchSectionHeader} {
          height: 32px;
          width: 100%;
          padding: 0 3px;
          margin-bottom: 5px;
          display: flex;
          justify-content: end;
          .${classes.highlight} {
            color: ${theme.palette.warning.main};
          }
        }
        .${classes.searchSectionBody} {
          margin-top: 8px;
          width: 100%;
          flex: 1;
          .${classes.hide} {
            display: none;
          }
          .${classes.visible} {
            width: 100%;
            min-height: 190px;
            display: flex;
            justify-content: center;
          }
          // rollback
          .${classes.box} {
            padding: 16px;
            margin-top: -16px;
          }
          .${classes.border} {
            border: 1px solid
              ${theme.palette.mode === "light"
                ? "#a5a0a033"
                : "rgba(50,58,66,1)"};
            border-radius: 8px;
            padding: 16px;
            display: flex;
            justify-content: start;
            overflow: hidden;
            flex-direction: column;
            min-height: 268px;
          }
          .${classes.label} {
            font-weight: 600;
            margin-bottom: 16px;
          }
        }
      }
    `
);

export default Root;
