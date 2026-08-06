import tokenManifest from '../tokens.json';

export const TOKEN_PREFIX = '--sc-' as const;
export const tokens = tokenManifest.tokens;
export type TokenMetadata = (typeof tokens)[number];
