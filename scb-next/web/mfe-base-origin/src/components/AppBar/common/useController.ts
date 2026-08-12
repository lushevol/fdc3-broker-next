import React, { useState } from "react";
import { useContext } from "../../../hooks/provider";
import { Container } from "../../../hooks/model/workspaces";
import {
  aOrb,
  getSurveyLink,
  getWindowOpen,
  uuidv4,
} from "../../../utils/common";
const surveyLink = getSurveyLink();
import useDispatcher from "../../../hooks/dispathcer";
import useAnalytics from "../../../analytics";
import { AnalyticsData } from "../../../analytics/model";
const analyticsData: AnalyticsData = { container: "Base", tile: "home" };
const useController = () => {
  const [store] = useContext();
  const { ButtonEvent, TileEvent } = useAnalytics();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const {
    dispacthWorkspaces,
    dispacthCurrentWorkspace,
    dispacthDrawer,
    addWorkspace,
  } = useDispatcher();
  const anchor = !!store?.drawer;
  const toggleDrawer =
    (val: boolean) => (_event: React.KeyboardEvent | React.MouseEvent) => {
      dispacthDrawer(val);
      ButtonEvent("click", {
        name: "new tile",
        value: `${val}`,
        ...analyticsData,
      });
    };

  const addTile = (inputContainer: Container) => {
    if (store?.workspaces) {
      const workspaces = [...store.workspaces];
      let index = 0;
      if (store?.currentWorkspace?.id) {
        index = workspaces.findIndex(
          (w) => w.id === store?.currentWorkspace?.id
        );
      } else {
        dispacthCurrentWorkspace(store?.workspaces[0]);
      }
      const container: Container = {
        ...inputContainer,
        id: uuidv4(),
      };
      const workspace = workspaces[index];
      let containerLabel = inputContainer.module.replace("/", "");
      let tile = inputContainer.tile.replace("/", "");
      let title = inputContainer.title;
      if (workspace.containers && workspace.containers.length === 0) {
        workspaces[index].containers = [container];
        workspaces[index].label = container.title;
        dispacthWorkspaces(workspaces);
      } else {
        addWorkspace(container);
      }
      TileEvent("open", { name: title, container: containerLabel, tile });
      ButtonEvent("click", { name: title, ...analyticsData, tile: "drawer" });
    }
    dispacthDrawer(false);
  };
  const win = React.useRef<Window | null>();
  const winFocusEvent = (_e?: Event) => {
    win?.current?.focus();
    window.blur();
  };
  const openPopUp = () => {
    ButtonEvent("click", { name: "survey", ...analyticsData });
    const w = 800,
      h = 800;
    const dualScreenLeft = aOrb(window.screenLeft, window.screenX);
    const dualScreenTop = aOrb(window.screenTop, window.screenY);

    const width =
      window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
    const height =
      window.innerHeight ??
      document.documentElement.clientHeight ??
      screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;

    win.current = getWindowOpen()(
      surveyLink,
      "surveyLink",
      "popup=1," +
        `width=${w / systemZoom},` +
        `height=${h / systemZoom},` +
        `top=${top},` +
        `left=${left}`
    );
    winFocusEvent();
  };
  const beforeunloadEvent = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    const confirmationMessage = "Leave?";
    e.returnValue = confirmationMessage;
    setTimeout(() => {
      openPopUp();
    }, 500);
    return confirmationMessage;
  };
  React.useEffect(() => {
    window.addEventListener("click", winFocusEvent, false);
    window.addEventListener("focus", winFocusEvent, false);
    const params: any = new URLSearchParams(window.location.search);
    if (params?.get("survey") === "no") {
      console.info("disable beforeunload");
    } else {
      window.addEventListener("beforeunload", beforeunloadEvent, false);
    }
    return () => {
      window.removeEventListener("click", winFocusEvent, false);
      window.removeEventListener("focus", winFocusEvent, false);
      window.removeEventListener("beforeunload", beforeunloadEvent, false);
    };
  }, []);

  return {
    store,
    anchor,
    toggleDrawer,
    addTile,
    surveyLink,
    openPopUp,
    winFocusEvent,
    beforeunloadEvent,
    openLogoutModal,
    setOpenLogoutModal,
  };
};

export default useController;
