import React from "react";

import { AvatarProps } from "./interface";
declare const useController: (props: AvatarProps) => {
  store: import("../../../hooks/model/root").RootModel;
  anchorElUser: HTMLElement | null;
  openProfile: boolean;
  handleOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseUserMenu: () => void;
  onBeforeLogout: () => void;
  handleOpenUserProfile: () => void;
  handleCloseUserProfile: () => void;
};
export default useController;
