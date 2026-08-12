import React, { useCallback, useEffect, useMemo } from "react";
import { useContext } from "../../../Root/hooks/provider";
import useDispatcher from "../../../Root/hooks/dispatcher";
import { ApiStatus } from "../../../@types/apiStatus";
import { initApiStatus } from "../../../Root/hooks/model/root";
import { Service, Hooks } from "../../../Root/import";
import { getEnable } from "../../../ratanutils/componentEnabling";

const { getHooks } = Hooks;
const { postService, getService } = Service;

const useController = () => {
  const [store] = useContext();
  const apiStatusData = store.apiStatus?.data || {};
  const apiStatusList = store.apiStatus?.displayStatusIds || [];

  const [anchorElStatus, setAnchorElStatus] =
    React.useState<null | HTMLElement>(null);
  const { dispatchApiStatus, dispatchApiStatusList } = useDispatcher();
  const handleOpenStatusMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElStatus(event.currentTarget);
  };
  const handleCloseStatusMenu = () => {
    setAnchorElStatus(null);
  };
  const getapistatus = async (): Promise<ApiStatus> => {
    try {
      const hooks = getHooks();
      const username = hooks.store?.user?.id;
      const daData = await getService("/ratan/da/v1/monitor", {
        headers: { PSID: username },
      });
      return daData as unknown as ApiStatus;
    } catch (e) {}
    return initApiStatus;
  };

  useEffect(() => {
    getapistatus().then((res: ApiStatus) => {
      if (res) {
        dispatchApiStatus(res);
      }
    });
  }, []);

  const enableStatus = useMemo(() => {
    if (apiStatusList && apiStatusList.length > 0) {
      return true;
    }
    return false;
  }, [apiStatusList]);

  const ifNotAvailable = useCallback(() => {
    if (!getEnable("API_STATUS_ICON")) {
      return "";
    }
    if (!apiStatusList || apiStatusList.length == 0) {
      return "";
    }

    const re = apiStatusList.some(
      (item) => apiStatusData[item]?.toLocaleLowerCase() === "not_available"
    )
      ? "not_available"
      : "available";

    return re;
  }, [apiStatusList, apiStatusData]);
  return {
    store,
    anchorElStatus,
    handleOpenStatusMenu,
    handleCloseStatusMenu,
    apiStatusList,
    apiStatusData,
    enableStatus,
    ifNotAvailable,
  };
};

export default useController;
