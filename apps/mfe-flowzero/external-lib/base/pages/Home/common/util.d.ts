export declare const setDetail: (
  workspace: any,
  title: any,
  container: any,
  tile: any
) => {
  title: any;
  container: any;
  tile: any;
};
export declare const refreshTabUtil: (
  refreshTab: any,
  _workspaces: any,
  itemId: any,
  setDetail: any,
  ButtonEvent: any
) => void;
export declare const fdc3InitUtil: (
  windowFin: any,
  fdc3: any,
  openFinFdc3: any,
  env: any,
  fdc3Init: any
) => void;
export declare const broadcastUtil: (
  windowFin: any,
  channel: any,
  env: any,
  payload: any
) => Promise<void>;
export declare const openTileUtil: (
  isTemplate: any,
  validTile: any,
  setParamsAndAddTile: any,
  tile: any,
  parameters: any
) => void;
