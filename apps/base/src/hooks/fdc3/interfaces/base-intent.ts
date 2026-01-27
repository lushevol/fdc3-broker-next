export type OpenNewTileIntent = 'scb.fmptp.OpenNewTile';
export type LoadUIComponentIntent = 'scb.fmptp.LoadUIComponent';
// export type CallFunctionIntent = "scb.fmptp.CallFunction";

export type FMPTPIntent = OpenNewTileIntent | LoadUIComponentIntent | string;
