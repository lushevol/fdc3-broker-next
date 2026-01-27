export const setDetail = (workspace, title, container, tile) => {
  if (workspace?.containers?.length) {
    title = workspace.containers[0].title;
    container = workspace.containers[0].module.replace('/', '');
    tile = workspace.containers[0].tile.replace('/', '');
  }
  return { title, container, tile };
};

export const refreshTabUtil = (refreshTab, _workspaces, itemId, setDetail, ButtonEvent) => {
  if (refreshTab && refreshTab[itemId]) {
    const workspaces = [..._workspaces];
    const index = workspaces.findIndex((w) => w.id === itemId);
    const workspace = workspaces[index];
    const container = 'base';
    const tile = 'home';
    const title = workspace.label;
    setDetail(workspace, title, container, tile);
    ButtonEvent('click', {
      name: 'refresh workspace',
      value: title,
      container,
      tile,
    });
    refreshTab[itemId]();
  }
};

export const fdc3InitUtil = (windowFin, fdc3, openFinFdc3, env, fdc3Init) => {
  if (windowFin && fdc3 && openFinFdc3 && ['LOCAL', 'DEV'].includes(env)) {
    fdc3Init();
  }
};

export const broadcastUtil = async (windowFin, channel, env, payload) => {
  if (windowFin && channel && ['LOCAL', 'DEV'].includes(env)) {
    await channel.broadcast(payload);
  }
};

export const openTileUtil = (isTemplate, validTile, setParamsAndAddTile, tile, parameters) => {
  if (isTemplate || validTile) {
    return setParamsAndAddTile(tile, parameters);
  }
};
