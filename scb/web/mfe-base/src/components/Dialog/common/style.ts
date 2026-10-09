export { DialogRoot as default, DialogRoot as Root, dialogClasses as presentationClasses } from "ratan-design-origin/compatibility";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_Dialog`;
export const classes = {
  resize: `${PREFIX}-root`, static: `${PREFIX}-static`,
  max: `${PREFIX}-max`, hideBackdrop: `${PREFIX}-hideBackdrop`,
};
