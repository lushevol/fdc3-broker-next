import React from 'react';
import useAnalytics from '../../../analytics';
import type { AnalyticsData } from '../../../analytics/model';
import useDispatcher from '../../../hooks/dispathcer';
import type { Workspace } from '../../../hooks/model/workspaces';
import { useContext } from '../../../hooks/provider';
import { getRefreshToken } from '../../../hooks/service';
import { extend } from '../../../hooks/service/util/extend';
import { aOrb, validateWorkspace } from '../../../utils/common';
import { handleLoginEntities } from '../../../utils/login';
import { refreshTabUtil, setDetail } from './util';

const analyticsData: AnalyticsData = { container: 'Base', tile: 'home' };

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
  const timerRefreshToken = React.useRef<any>(0);
  const [showTimeout, setShowTimeout] = React.useState(false);
  const [value, setValue] = React.useState(1);
  const [ready, setReady] = React.useState(false);
  const [validateWorkspaceReady, setValidateWorkspaceReady] = React.useState(false);
  const [activeDragId, setActiveDragId] = React.useState<string | null>(null);

  const handleChange = (item: Workspace) => {
    const workspaces = store?.workspaces as Workspace[];
    const workspace = workspaces.find((w) => w.id === item.id);
    if (!workspace) return;
    const container = 'base';
    const tile = 'home';
    const title = workspace.label;
    setDetail(workspace, title, container, tile);
    TabEvent('click', {
      name: 'select workspace',
      value: title,
      container,
      tile,
    });
    dispacthCurrentWorkspace(workspace);
    const index = workspaces.findIndex((w) => w.id === item.id);
    setValue(index + 1);
    dispacthErrorMessage(undefined);
  };

  const handleDragStart = (event) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragCancel = () => {
    setActiveDragId(null);
  };

  const handleReorder = (event) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const workspaces = [...(store?.workspaces as Workspace[])];
    const oldIndex = workspaces.findIndex((w) => w.id === active.id);
    const newIndex = workspaces.findIndex((w) => w.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const [moved] = workspaces.splice(oldIndex, 1);
    workspaces.splice(newIndex, 0, moved);

    dispacthWorkspaces(workspaces);

    if (store?.currentWorkspace) {
      const currentIndex = workspaces.findIndex((w) => w.id === store.currentWorkspace?.id);
      setValue(currentIndex + 1);
    }
    ButtonEvent('click', {
      name: 'reorder workspace',
      value: moved.label,
      container: 'base',
      tile: 'home',
    });
    dispacthErrorMessage(undefined);
  };
  const runExtend = () => {
    extend(store?.expiredIn, store.isOnLogout, store.token);
  };
  const mouseMove = () => {
    if (timerMouseMove.current) {
      clearTimeout(timerMouseMove.current);
    }
    timerMouseMove.current = setTimeout(runExtend, 5000);
  };
  const clearAllTimeout = () => {
    if (timerPopup.current) {
      clearTimeout(timerPopup.current);
    }
    if (timerRefreshToken.current) {
      clearTimeout(timerRefreshToken.current);
    }
    if (timerMouseMove.current) {
      clearTimeout(timerMouseMove.current);
    }
  };

  React.useEffect(() => {
    const params: any = new URLSearchParams(window.location.search);
    if (params?.get('code')) {
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
      timerRefreshToken.current = setTimeout(() => {
        getRefreshToken();
      }, difftime - 25000);
    }
    return () => {
      clearAllTimeout();
    };
  }, [store?.token, store?.expiredIn, ready]);

  React.useEffect(() => {
    if (store?.workspaces && store?.currentWorkspace && store?.currentWorkspace?.id) {
      const workspaces = [...(store?.workspaces as Workspace[])];
      const index = workspaces.findIndex((w) => w.id === store?.currentWorkspace?.id);
      setValue(index + 1);
    }
  }, [store.currentWorkspace]);

  const add = () => {
    addWorkspace();
    ButtonEvent('click', { name: 'add workspace', ...analyticsData });
    dispacthErrorMessage(undefined);
  };

  const edit = (item: Workspace) => (event) => {
    const workspaces = [...(store?.workspaces as Workspace[])];
    const index = workspaces.findIndex((w) => w.id === item.id);
    workspaces[index].label = event.target.value;
    dispacthWorkspaces(workspaces);
  };

  const updateValue = (workspaces, index_, value_) => {
    if (index_ + 1 < value_) {
      setValue((v) => v - 1);
    } else if (index_ + 1 === value_) {
      dispacthCurrentWorkspace(workspaces[index_ - 1]);
    }
  };
  const remove = (item: Workspace) => (event: React.MouseEvent) => {
    event.stopPropagation();
    const workspaces = [...(store?.workspaces as Workspace[])];
    const index = workspaces.findIndex((w) => w.id === item.id);
    const workspace = workspaces[index];
    const container = 'base';
    const tile = 'home';
    const title = workspace.label;
    setDetail(workspace, title, container, tile);
    ButtonEvent('click', {
      name: 'remove workspace',
      value: title,
      container,
      tile,
    });
    TileEvent('close', { name: title, container, tile });
    updateValue(workspaces, index, value);
    workspaces.splice(index, 1);
    dispacthWorkspaces(workspaces);
    dispacthErrorMessage(undefined);
    return false;
  };

  const closeOthers = (item: Workspace) => {
    const workspaceLabel = item.label;
    const container = 'base';
    const tile = 'home';
    setDetail(item, workspaceLabel, container, tile);
    ButtonEvent('click', {
      name: 'close others workspaces',
      value: workspaceLabel,
      container,
      tile,
    });
    dispacthWorkspaces([item]);
    dispacthCurrentWorkspace(item);
    setValue(1);
    dispacthErrorMessage(undefined);
  };

  const closeAll = () => {
    const label = store?.currentWorkspace?.label ?? 'Workspace';
    ButtonEvent('click', {
      name: 'close all workspaces',
      value: label,
      container: 'base',
      tile: 'home',
    });
    dispacthWorkspaces([]);
    addWorkspace();
    setValue(1);
    dispacthErrorMessage(undefined);
  };

  const refreshTab = (item: Workspace) => (event: React.MouseEvent) => {
    event.stopPropagation();
    refreshTabUtil(store?.refreshTab, store?.workspaces, item.id, setDetail, ButtonEvent);
  };

  const closeAllTiles = React.useCallback(() => {
    const workspaces = [...(store?.workspaces as Workspace[])].map((workspace) => ({
      ...workspace,
      containers: [],
    }));

    dispacthWorkspaces(workspaces);

    if (workspaces.length > 0) {
      dispacthCurrentWorkspace(workspaces[0]);
    }

    dispacthErrorMessage(undefined);
    ButtonEvent('click', { name: 'close all tiles', ...analyticsData });

    return workspaces;
  }, [
    ButtonEvent,
    dispacthCurrentWorkspace,
    dispacthErrorMessage,
    dispacthWorkspaces,
    store?.workspaces,
  ]);

  const focus = (item: Workspace) => () => {
    const container = 'base';
    const tile = 'home';
    const title = item.label;
    setDetail(item, title, container, tile);
    ButtonEvent('click', {
      name: 'edit workspace',
      value: title,
      container,
      tile,
    });
    document.getElementById(`edit-${item.id}`)?.focus();
  };

  React.useEffect(() => {
    if (ready) {
      if (store?.workspaces?.length) {
        const validWorkspaces = validateWorkspace(store?.workspaces, store.entities, store.drawers);
        dispacthWorkspaces(validWorkspaces);
        dispacthCurrentWorkspace(validWorkspaces[0]);
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
    closeAllTiles,
    closeOthers,
    closeAll,
    handleReorder,
    handleDragStart,
    handleDragCancel,
    activeDragId,
  };
};

export default useController;
