import { styled } from "ratan-design-origin/theme";
import Dialog from "../../Dialog";
import { Accordion as MuiAccordion } from "ratan-design-origin/primitives";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_profile`;
export const classes = {};

const Root = styled(Dialog)(({ theme }) => ({
  "& .MuiCard-root": {
    backgroundColor: "transparent!important",
    border: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(2),
  },
}));

export const Accordion = styled(MuiAccordion)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

export default Root;
