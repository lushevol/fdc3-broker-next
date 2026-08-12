import React from 'react';
import useAnalytics from '../../../analytics';
import type { AnalyticsData } from '../../../analytics/model';
import { useContext } from '../../../hooks/provider';
import type { AvatarProps } from './interface';
import useServices from '../../../services';

const analyticsData: AnalyticsData = { container: 'Base', tile: 'home' };
const useController = (props: AvatarProps) => {
  const [store] = useContext();
  const { ButtonEvent } = useAnalytics();
  const { logout } = useServices();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [openProfile, setOpenProfile] = React.useState<boolean>(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
    ButtonEvent('click', { name: 'avatar', ...analyticsData });
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const onBeforeLogout = () => {
    props.setOpen(true);
    ButtonEvent('click', { name: 'logout confirmation', ...analyticsData });
    handleCloseUserMenu();
  };
  const logoutFromProfile = () => {
    setOpenProfile(false);
    ButtonEvent('click', { name: 'logout', ...analyticsData });
    logout();
  };

  const handleOpenUserProfile = () => {
    handleCloseUserMenu();
    setOpenProfile(true);
    ButtonEvent('click', { name: 'profile', ...analyticsData });
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
    logoutFromProfile,
    handleOpenUserProfile,
    handleCloseUserProfile,
  };
};

export default useController;
