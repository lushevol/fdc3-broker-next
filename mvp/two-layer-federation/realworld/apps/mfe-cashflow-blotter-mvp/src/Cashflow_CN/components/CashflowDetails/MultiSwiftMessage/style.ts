import Menu from "@mui/material/Menu";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_cashflow_detail_dialog`;
export const classes = {
  messagePanel: `${PREFIX}-message-panel`,
  messageCount: `${PREFIX}-message-count`,
  menuItem: `${PREFIX}-menuItem`,
  noSwiftMessage: `${PREFIX}-no-swift-message`,
};

const Root = styled("div")(
  ({ theme }) => css`
    overflow: hidden;
    background-color: var(--theme-color-modal-header);
    .MuiPaper-rounded {
      min-height: unset;
    }
    height: 100%;
    .${classes.messagePanel} {
      text-align: left;
      color: var(--theme-color-panel-font);
      background-color: var(--theme-color-panel-header);
      border-bottom: 1px solid var(--theme-color-modal-header-border);
      font-weight: 500;
      border-radius: 5px 5px 0 0;
    }
    .${classes.noSwiftMessage} {
      text-align: center;
      top: 50%;
      line-height: 100px;
      font-size: 13px;
    }
  `
);

export const MenuStyled = styled(Menu)(({ theme }) => ({
  [`& .${classes.menuItem}`]: {
    cursor: "default",
    fontSize: "12px",
    marginBottom: "8px",
    padding: "4px 6px",
    textTransform: "none",
    "& section": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "& div": {
      display: "flex",
      justifyContent: "start",
      alignItems: "baseline",

      "& svg": {
        marginRight: "8px",
      },
    },
    "& .undefined": {
      "& svg": {
        color: "#564e4e",
      },
    },
    "& .available": {
      "& svg": {
        color: "green",
      },
    },

    "& .not_available": {
      "& svg": {
        color: "#c72121",
      },
    },
  },
}));

export default Root;
