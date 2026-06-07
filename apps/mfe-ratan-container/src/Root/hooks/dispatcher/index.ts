import { ApiStatus } from "src/@types/apiStatus";
import { useContext } from "../provider";
import { ActionType } from "../reducer/actions/ActionType";
import { VersionType } from "../model/root";

const useDispatcher = () => {
  const [store, dispacth] = useContext();
  const dispatchApiStatus = (apiStatus: ApiStatus) => {
    dispacth({
      type: ActionType.SET_API_STATUS,
      data: { apiStatus: { data: apiStatus } },
    });
  };
  const dispatchApiStatusList = (list: string[]) => {
    dispacth({
      type: ActionType.SET_API_STATUS_LIST,
      data: { apiStatus: { displayStatusIds: list } },
    });
  };
  const dispatchVersionState = (versionState: VersionType) => {
    dispacth({ type: ActionType.SET_VERSION_STATE, data: { versionState } });
  };
  const dispatchRefreshState = (refreshState: number) => {
    dispacth({ type: ActionType.SET_REFRESH_STATE, data: { refreshState } });
  };
  return {
    dispatchApiStatus,
    dispatchVersionState,
    dispatchRefreshState,
    dispatchApiStatusList,
  };
};
export default useDispatcher;
