import { SurveyProps } from "./interface";
declare const useController: (props: SurveyProps) => {
  store: import("../../../hooks/model/root").RootModel;
  continuLogout: () => Promise<void>;
  stopLogout: () => void;
  open: typeof open;
  handleClose: () => void;
  openSurveyAndHide: () => void;
  openSurveyAndLogout: () => void;
  loading: boolean;
};
export default useController;
