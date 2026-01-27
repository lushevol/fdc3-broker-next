import type { Container } from '../../model/workspaces';
import { DeclaredContext, type DeclaredIntent, DeclaredIntentWithContext } from './types';

export enum AuthorizeIntentError {
  TileNotFound = 'Tile Not Found', // target tile not found in PTP or not on boarded yet
  TileInaccessible = 'Tile Inaccessible', // target tile can't be access from current user
  UnpermittedSourceTile = 'Unpermitted Source Tile', // source tile not in allow list of target tile
  UnpermittedUser = 'Unpermitted User', // current user is not permitted with target tile entitlements requirement
}

export interface AuthorizeIntentResultResponse {
  error: AuthorizeIntentError | null;
  errorMessage: string | null;
  tiles: TileFullInfo[];
}

export type TileFullInfo = {} & Container;

export type DeclaredIntentContextResponse = {
  intents: DeclaredIntent[];
};
