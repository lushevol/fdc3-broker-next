import { styled, css } from "@mui/material";
import { Dialog } from "../../Root/import";

export const dialogClasses = {
  inDialog: "in-dialog",
};

const Root = styled(Dialog)(
  css`
    &.${dialogClasses.inDialog} {
      z-index: 1200;
    }
  `
);

export default Root;
