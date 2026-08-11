import { Tile } from "../../../components/Drawer/common/interface";
import { Workspace } from "../../../hooks/model/workspaces";
import { AnalyticsData } from "../../../analytics/model";

type ButtonEvent = (event: "click", data: AnalyticsData) => void;

export const setDetail = (
  workspace: Workspace | undefined,
  title: string,
  container: string,
  tile: string
) => {
  if (workspace?.containers?.length) {
    title = workspace.containers[0].title;
    container = workspace.containers[0].module.replace("/", "");
    tile = workspace.containers[0].tile.replace("/", "");
  }
  return { title, container, tile };
};

export const refreshTabUtil = (
  refreshTab: Record<string, () => void> | undefined,
  _workspaces: Workspace[] | undefined,
  itemId: string,
  setDetailFn: typeof setDetail,
  ButtonEvent: ButtonEvent
) => {
  if (refreshTab?.[itemId] && _workspaces) {
    const workspaces = [..._workspaces];
    const index = workspaces.findIndex((w) => w.id === itemId);
    const workspace = workspaces[index];
    if (!workspace) return;
    let container = "base";
    let tile = "home";
    let title = workspace.label;
    setDetailFn(workspace, title, container, tile);
    ButtonEvent("click", {
      name: "refresh workspace",
      value: title,
      container,
      tile,
    });
    refreshTab[itemId]();
  }
};

export const fdc3InitUtil = (
  windowFin: unknown,
  fdc3: unknown,
  openFinFdc3: unknown,
  _env: string,
  fdc3Init: () => void
) => {
  if (windowFin && fdc3 && openFinFdc3) {
    fdc3Init();
  }
};

export const broadcastUtil = async (
  windowFin: unknown,
  channel: { broadcast: (payload: unknown) => Promise<unknown> } | undefined,
  env: string,
  payload: unknown
) => {
  if (windowFin && channel && ["LOCAL", "DEV"].includes(env)) {
    await channel.broadcast(payload);
  }
};

export const openTileUtil = (
  isTemplate: boolean | undefined,
  validTile: boolean,
  setParamsAndAddTile: (tile: Tile, parameters?: string) => void,
  tile: Tile | undefined,
  parameters?: string
) => {
  if (tile && (isTemplate || validTile)) {
    setParamsAndAddTile(tile, parameters);
  }
};
