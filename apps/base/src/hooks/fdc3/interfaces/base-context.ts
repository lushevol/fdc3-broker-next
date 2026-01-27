import type { Context } from 'openfin-fdc3';
import type { FMAppId } from './types';

export interface FMPTPTile extends Context {
  type: 'scb.fmptp.tile';
  id: {
    tileId: string; // the name of import map key
  };
}

export interface FMPTPUIComponent extends Context {
  type: 'scb.fmptp.uicomponent';
  tile: FMPTPTile;
  id: {
    key: string; // field of component name on the root
  };
}

// export interface FMPTPFunction extends Context {
//     type: "scb.fmptp.function";
//     tile: FMPTPTile;
// }

// export interface FMPTPTileWithParameters extends FMPTPTile {
//     parameters?: Record<string, any>;
// }

export interface FMPTPGenericIntentContext<T = any> extends Context {
  type: string;
  tile: FMPTPTile;
  context?: T;
  sourceApp: FMAppId;
}

export interface FMPTPOpenNewTileContext extends FMPTPGenericIntentContext {
  type: 'scb.fmptp.openNewTileContext';
}

export type FMPTPContext = FMPTPGenericIntentContext | FMPTPOpenNewTileContext;
