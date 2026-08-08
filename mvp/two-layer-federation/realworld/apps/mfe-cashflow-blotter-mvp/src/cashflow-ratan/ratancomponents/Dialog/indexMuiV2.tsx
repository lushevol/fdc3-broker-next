import rtCreatePortal from "../Portal/rtCreatePortal";
import { MuiDialog } from "./indexMuiV1";

export const MuiPortalDialog = (props) => {
  return rtCreatePortal(<MuiDialog {...props} />, true);
};
