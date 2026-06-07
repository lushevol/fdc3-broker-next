import { AxiosResponse } from "axios";

import { JWTPayload } from "./common";
export declare const setAuthorization: (token: any) => void;
export declare const dispacthUserLoginTime: (payload: JWTPayload) => void;
export declare const handleLogin: (response: AxiosResponse) => void;
export declare const handleUser: (response: AxiosResponse) => void;
export declare const handleEntities: (response: AxiosResponse) => void;
export declare const handleDrawers: (response: AxiosResponse) => void;
export declare const setRefreshToken: (refreshToken: any) => void;
export declare const handleRefreshToken: (response: AxiosResponse) => void;
export declare const handleEntitlementsToken: (response: AxiosResponse) => void;
export declare const handleLoginEntities: (
  entities_: any,
  dispatch: any,
  drawers: any
) => void;
