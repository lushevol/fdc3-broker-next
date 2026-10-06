import React from "react";
import { useContext } from "../../../hooks/provider";
import useDispatcher from "../../../hooks/dispathcer";
import { Workspace } from "../../../hooks/model/workspaces";
import { validateWorkspace, aOrb, getJWTPayload } from "../../../utils/common";
import { getRefreshToken } from "../../../hooks/service";
import { getSessionGeneration } from "../../../hooks/service/util/session";
import { getHooksBase } from "../../../hooks/HooksBase";
import { extend } from "../../../hooks/service/util/extend";
import useAnalytics from "../../../analytics";
import { AnalyticsData } from "../../../analytics/model";
import { handleLoginEntities } from "../../../utils/login";
import { setDetail, refreshTabUtil } from "./util";
const analyticsData: AnalyticsData = { container: "Base", tile: "home" };
// Keep the existing lead time: the backend must receive valid access before
// issuing refresh, so normal acquisition starts before the access deadline.
const REFRESH_BEFORE_ACCESS_EXPIRY_MS = 25_000;
const REFRESH_RETRY_DELAYS_MS = [5_000, 15_000, 30_000];

const useController = () => {
  const [store, dispatch] = useContext();
  const { ButtonEvent, TileEvent, TabEvent } = useAnalytics();
  const {
    dispacthLoading,
    dispacthWorkspaces,
    dispacthCurrentWorkspace,
    addWorkspace,
    dispacthErrorMessage,
  } = useDispatcher();
  const timerPopup = React.useRef<any>(0);
  const timerMouseMove = React.useRef<any>(0);
  const refreshRecovery = React.useRef<{
    token?: string;
    generation: number;
    failures: number;
    retryAt: number;
  }>({ generation: -1, failures: 0, retryAt: 0 });
  const [showTimeout, setShowTimeout] = React.useState(false);
  const [value, setValue] = React.useState(1);
  const [ready, setReady] = React.useState(false);
  const [validateWorkspaceReady, setValidateWorkspaceReady] =
    React.useState(false);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const target = event.target as HTMLElement;
    if (
      !target.parentElement?.parentElement?.id?.includes("deleteWorkspace-")
    ) {
      const workspaces = [...(store?.workspaces as Workspace[])];
      const workspace = workspaces[newValue - 1];
      if (!workspace) return;
      let container = "base";
      let tile = "home";
      let title = workspace.label;
      setDetail(workspace, title, container, tile);
      TabEvent("click", {
        name: "select workspace",
        value: title,
        container,
        tile,
      });
      dispacthCurrentWorkspace(workspace);
      dispacthErrorMessage(undefined);
    }
  };
  const runExtend = (token: string | undefined, generation: number) => {
    const current = getHooksBase().store;
    // Cleanup can run after a timer is delivered. Recheck its owner before
    // sending activity so an old timer cannot rotate access in a later login.
    if (
      generation !== getSessionGeneration() ||
      current.token !== token ||
      current.isOnLogout
    )
      return;
    extend(current.expiredIn, current.isOnLogout, current.token);
  };
  const mouseMove = () => {
    if (timerMouseMove.current) {
      clearTimeout(timerMouseMove.current);
    }
    const generation = getSessionGeneration();
    timerMouseMove.current = setTimeout(
      () => runExtend(store.token, generation),
      5000
    );
  };
  const clearAllTimeout = () => {
    if (timerPopup.current) {
      clearTimeout(timerPopup.current);
    }
    if (timerMouseMove.current) {
      clearTimeout(timerMouseMove.current);
    }
  };

  React.useEffect(() => {
    const params: any = new URLSearchParams(window.location.search);
    if (params?.get("code")) {
      handleLoginEntities(store.entities, dispatch, store.drawers);
    }
    setReady(true);
    dispacthLoading(false);
    return () => {
      clearAllTimeout();
    };
  }, []);

  React.useEffect(() => {
    if (store?.token && ready) {
      const difftime = 1000 * aOrb(store?.expiredIn, 0) - new Date().getTime();
      timerPopup.current = setTimeout(() => {
        setShowTimeout(true);
      }, difftime);
    }
    return () => {
      if (timerPopup.current) {
        clearTimeout(timerPopup.current);
      }
    };
  }, [store?.token, store?.expiredIn, ready]);

  React.useEffect(
    () => () => {
      // Activity recorded before rotation must not be sent with the old token.
      clearTimeout(timerMouseMove.current);
    },
    [store.token, store.isOnLogout]
  );

  React.useEffect(() => {
    if (!ready || !store?.token) return;

    const accessExpiresAt = 1000 * aOrb(store.expiredIn, 0);
    const generation = getSessionGeneration();
    if (
      refreshRecovery.current.token !== store.token ||
      refreshRecovery.current.generation !== generation
    ) {
      refreshRecovery.current = {
        token: store.token,
        generation,
        failures: 0,
        retryAt: 0,
      };
    }
    const recovery = refreshRecovery.current;
    let cancelled = false;
    let acquisitionPending = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    // Use the current refresh token's own deadline. Access rotation does not
    // extend it, while a successful replacement can supply a later expiry.
    let refreshExpiresAt = 0;
    if (store.refreshToken) {
      try {
        const payload = getJWTPayload(store.refreshToken);
        refreshExpiresAt = payload ? (payload.exp ?? 0) * 1000 : 0;
      } catch {
        // An invalid token has no usable expiry timestamp.
      }
    }

    const reconcileExpiry = () => {
      // Suspended browsers may not deliver timers on time. Check wall-clock
      // expiry on return, including refresh expiry while access is still valid.
      if (
        accessExpiresAt <= Date.now() ||
        (refreshExpiresAt > 0 && refreshExpiresAt <= Date.now())
      ) {
        setShowTimeout(true);
      }
    };
    const requestRefresh = () => {
      // All acquisition paths share these checks because a timer or hide event
      // can arrive after the prompt opens, logout starts, or access expires.
      if (
        !cancelled &&
        !acquisitionPending &&
        generation === getSessionGeneration() &&
        accessExpiresAt > Date.now() &&
        !showTimeout &&
        !store.isOnLogout &&
        (!refreshExpiresAt || refreshExpiresAt > Date.now()) &&
        // Fix 1: a late replacement may reach the backend after access expires;
        // its expiry error clears authentication even when refresh is usable.
        // Preserve that credential once less than the 25-second lead remains.
        (!refreshExpiresAt ||
          accessExpiresAt - Date.now() >= REFRESH_BEFORE_ACCESS_EXPIRY_MS)
      ) {
        if (
          !refreshExpiresAt &&
          recovery.failures > REFRESH_RETRY_DELAYS_MS.length
        )
          return;
        if (!refreshExpiresAt && recovery.retryAt > Date.now()) {
          clearTimeout(retryTimer);
          retryTimer = setTimeout(
            requestRefresh,
            recovery.retryAt - Date.now()
          );
          return;
        }
        acquisitionPending = true;
        clearTimeout(retryTimer);
        Promise.resolve(getRefreshToken()).then((result) => {
          acquisitionPending = false;
          if (cancelled || refreshExpiresAt) return;
          if (result === "temporaryFailure") {
            const delay = REFRESH_RETRY_DELAYS_MS[recovery.failures++];
            // Retry while access can authorize acquisition. Frozen browsers
            // still need the visibility check because this timer may not run.
            if (delay !== undefined && Date.now() + delay < accessExpiresAt) {
              recovery.retryAt = Date.now() + delay;
              retryTimer = setTimeout(requestRefresh, delay);
            }
          } else if (result === "rejected" || result === "cancelled") {
            // Keep the terminal result across visibility changes for this token.
            recovery.failures = REFRESH_RETRY_DELAYS_MS.length + 1;
          }
        });
      }
    };
    let acquisitionTimer: ReturnType<typeof setTimeout> | undefined;
    const scheduleAcquisition = () => {
      clearTimeout(acquisitionTimer);
      const delay =
        accessExpiresAt - REFRESH_BEFORE_ACCESS_EXPIRY_MS - Date.now();
      // Hidden pages acquire on hide because their timers may be frozen.
      // Returning after this deadline must not replay a late replacement.
      if (document.visibilityState === "visible" && delay > 0) {
        acquisitionTimer = setTimeout(() => {
          // Visibility can change between scheduling and callback delivery.
          if (document.visibilityState === "visible") requestRefresh();
        }, delay);
      }
    };
    let previousVisibility = document.visibilityState;
    const handleVisibilityChange = () => {
      const visibility = document.visibilityState;
      // Duplicate notifications must not create extra refresh requests.
      if (visibility === previousVisibility) return;
      previousVisibility = visibility;
      clearTimeout(acquisitionTimer);
      if (visibility === "hidden") {
        // Acquire while JavaScript can still run, before possible suspension.
        requestRefresh();
      } else {
        // Resolve expiry first so returning cannot silently renew expired access.
        reconcileExpiry();
        if (
          !refreshExpiresAt &&
          (recovery.failures > 0 ||
            accessExpiresAt - Date.now() <= REFRESH_BEFORE_ACCESS_EXPIRY_MS)
        )
          requestRefresh();
        scheduleAcquisition();
      }
    };
    // Fix 2: a page already hidden at mount emits no new hide event, and a late
    // mount has already missed the visible timer deadline. Acquire missing
    // refresh now; requestRefresh still requires valid access and no logout.
    if (
      !refreshExpiresAt &&
      (document.visibilityState === "hidden" ||
        accessExpiresAt - Date.now() <= REFRESH_BEFORE_ACCESS_EXPIRY_MS)
    ) {
      requestRefresh();
    }
    scheduleAcquisition();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    // Continuous activity may keep access alive beyond refresh expiry, so the
    // refresh deadline needs its own timer as well as the check on return.
    const refreshExpiryTimer = refreshExpiresAt
      ? setTimeout(reconcileExpiry, Math.max(0, refreshExpiresAt - Date.now()))
      : undefined;
    return () => {
      cancelled = true;
      // Token changes rebuild this effect. Remove the old callbacks so they
      // cannot apply obsolete deadlines after rotation or after Home unmounts.
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(acquisitionTimer);
      clearTimeout(refreshExpiryTimer);
      clearTimeout(retryTimer);
    };
  }, [
    ready,
    store?.token,
    store?.expiredIn,
    store?.refreshToken,
    store?.isOnLogout,
    showTimeout,
  ]);

  React.useEffect(() => {
    if (
      store?.workspaces &&
      store?.currentWorkspace &&
      store?.currentWorkspace?.id
    ) {
      const workspaces = [...(store?.workspaces as Workspace[])];
      const index = workspaces.findIndex(
        (w) => w.id === store?.currentWorkspace?.id
      );
      setValue(index + 1);
    }
  }, [store.currentWorkspace]);

  const add = () => {
    addWorkspace();
    ButtonEvent("click", { name: "add workspace", ...analyticsData });
    dispacthErrorMessage(undefined);
  };

  const edit =
    (item: Workspace) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const workspaces = [...(store?.workspaces as Workspace[])];
      const index = workspaces.findIndex((w) => w.id === item.id);
      workspaces[index].label = event.target.value;
      dispacthWorkspaces(workspaces);
    };

  const updateValue = (
    workspaces: Workspace[],
    index_: number,
    value_: number
  ) => {
    if (index_ + 1 < value_) {
      setValue((v) => v - 1);
    } else if (index_ + 1 === value_) {
      const nextWorkspace = workspaces[index_ - 1] ?? workspaces[index_ + 1];
      if (nextWorkspace) dispacthCurrentWorkspace(nextWorkspace);
    }
  };
  const remove = (item: Workspace) => (event: React.MouseEvent) => {
    event.stopPropagation();
    let workspaces = [...(store?.workspaces as Workspace[])];
    const index = workspaces.findIndex((w) => w.id === item.id);
    const workspace = workspaces[index];
    let container = "base";
    let tile = "home";
    let title = workspace.label;
    setDetail(workspace, title, container, tile);
    ButtonEvent("click", {
      name: "remove workspace",
      value: title,
      container,
      tile,
    });
    TileEvent("close", { name: title, container, tile });
    updateValue(workspaces, index, value);
    workspaces.splice(index, 1);
    dispacthWorkspaces(workspaces);
    dispacthErrorMessage(undefined);
    return false;
  };

  const refreshTab = (item: Workspace) => (event: React.MouseEvent) => {
    event.stopPropagation();
    refreshTabUtil(
      store?.refreshTab as Record<string, () => void> | undefined,
      store?.workspaces as Workspace[] | undefined,
      item.id,
      setDetail,
      ButtonEvent
    );
  };

  const focus = (id: number) => () => {
    const workspaces = [...(store?.workspaces as Workspace[])];
    const workspace = workspaces[id - 1];
    let container = "base";
    let tile = "home";
    let title = workspace.label;
    setDetail(workspace, title, container, tile);
    ButtonEvent("click", {
      name: "edit workspace",
      value: title,
      container,
      tile,
    });
    document.getElementById(`edit-${workspace.id}`)?.focus();
  };

  React.useEffect(() => {
    if (ready) {
      if (store?.workspaces?.length) {
        const validWorkspaces = validateWorkspace(
          store?.workspaces,
          store.entities,
          store.drawers
        );
        dispacthWorkspaces(validWorkspaces);
        if (validWorkspaces[0]) {
          dispacthCurrentWorkspace(validWorkspaces[0]);
        }
      }
      setValidateWorkspaceReady(true);
    }
  }, [ready]);
  return {
    store,
    value,
    handleChange,
    add,
    edit,
    focus,
    remove,
    ready,
    showTimeout,
    setShowTimeout,
    mouseMove,
    validateWorkspaceReady,
    runExtend,
    updateValue,
    refreshTab,
  };
};

export default useController;
