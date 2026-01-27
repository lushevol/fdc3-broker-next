import type { AppIdentifier, Context } from '@finos/fdc3';

export type IntentType = {
  intent: string;
  context: Context;
  app?: AppIdentifier;
};

export type FMAppId = {
  tileId: string;
  platform: 'fmptp' | 'blade';
};

export type DeclaredIntent = {
  tileId: string; // related tile
  intent: string; // intent name
  contextType: string; // declared context type
  allowedSourceTiles: string[]; // list of source tile id
  allowedEntitlements: string[]; // list of allowed EMS2 entitlements e.g. ENTITY|SUBJECT|ACTION (from current user)
};

export type DeclaredContext = {
  type: string; // type name of context
  schema: Record<string, unknown>; // json schema of context
};

export type DeclaredIntentWithContext = DeclaredIntent & {
  context: DeclaredContext;
};
