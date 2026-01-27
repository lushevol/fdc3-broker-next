export type RemoteKeys = 'mf_container';
type PackageType<T> = T extends 'mf_container' ? typeof import('mf_container') : any;
