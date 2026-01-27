import type { AppIdentifier, Context } from '@finos/fdc3';
import {
  AuthorizeIntentError,
  type AuthorizeIntentResultResponse,
  type DeclaredIntentContextResponse,
  type TileFullInfo,
} from './interfaces/dto';
import type { FMAppId } from './interfaces/types';
import DeclaredIntentContextResponseJson from './samples/DeclaredIntentContextReponse.json';

export const findAppFullInfo = async (app: FMAppId): Promise<TileFullInfo | null> => {
  // search for db
  return null;
};

// check if intent can be perform
export const authorizeIntent = async (
  intent: string,
  context: Context,
  app?: AppIdentifier | string,
): Promise<AuthorizeIntentResultResponse> => {
  // 1. check if target app exist
  // 2. check if user can access target app
  // 3. check if source app is in whitelist of declared intent of target app
  if (intent === 'scb.fmptp.ViewCashflows') {
    return {
      error: null,
      errorMessage: null,
      tiles: [
        {
          id: '',
          title: '',
          emailSupport: '',
          panelId: '',
          tabId: '',
          container: 'ratan_container',
          module: 'cashflow_blotter_cn',
          tile: 'cashflow_simple',
        },
      ],
    };
  }

  return {
    error: AuthorizeIntentError.TileInaccessible,
    errorMessage: 'Tile is inaccessible',
    tiles: [],
  };
};

// get all declared intents from user
export const getAllDeclaredIntents = async (): Promise<DeclaredIntentContextResponse> => {
  return Promise.resolve(DeclaredIntentContextResponseJson);
};
