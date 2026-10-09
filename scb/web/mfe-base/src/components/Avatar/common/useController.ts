import React from "react";
import { useContext } from "../../../hooks/provider";
import { AvatarProps } from "./interface";
import useAnalytics from "../../../analytics";
import { AnalyticsData } from "../../../analytics/model";
const analyticsData: AnalyticsData = { container: "Base", tile: "home" };
const useController = (props: AvatarProps) => {
  const [store] = useContext();
  const { ButtonEvent } = useAnalytics();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [openProfile, setOpenProfile] = React.useState<boolean>(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
    ButtonEvent("click", { name: "avatar", ...analyticsData });
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const onBeforeLogout = () => {
    props.setOpen(true);
    ButtonEvent("click", { name: "logout confirmation", ...analyticsData });
    handleCloseUserMenu();
  };

  const handleOpenUserProfile = () => {
    handleCloseUserMenu();
    setOpenProfile(true);
    ButtonEvent("click", { name: "profile", ...analyticsData });
  };
  const handleCloseUserProfile = () => {
    setOpenProfile(false);
  };

  return {
    store,
    anchorElUser,
    openProfile,
    handleOpenUserMenu,
    handleCloseUserMenu,
    onBeforeLogout,
    handleOpenUserProfile,
    handleCloseUserProfile,
  };
};

export default useController;
