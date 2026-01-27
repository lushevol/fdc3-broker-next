export type RemoteKeys = 'mf_tile';
type PackageType<T> = T extends 'mf_tile' ? typeof import('mf_tile') : any;
