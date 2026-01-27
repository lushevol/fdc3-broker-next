import React from 'react';
import useAnalytics from '../../../analytics';
import type { AnalyticsData } from '../../../analytics/model';
import useDispatcher from '../../../hooks/dispathcer';
import { useContext } from '../../../hooks/provider';
import useServices from '../../../services';
import { waitFor } from '../../../utils/common';
import type { SurveyProps } from './interface';

const analyticsData: AnalyticsData = { container: 'Base', tile: 'survey' };

const useController = (props: SurveyProps) => {
  const [store] = useContext();
  const { ButtonEvent, ModalEvent } = useAnalytics();
  const { dispacthIsOnLogout } = useDispatcher();
  const { logout } = useServices();
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    ModalEvent('open', { name: 'logout confirmation', ...analyticsData });
  }, []);

  const continuLogout = async () => {
    dispacthIsOnLogout(true);
    setLoading(true);
    ButtonEvent('click', { name: 'logout', ...analyticsData });
    ModalEvent('close', { name: 'logout confirmation', ...analyticsData });
    waitFor(1000).then(() => {
      logout();
    });
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  const stopLogout = () => {
    ButtonEvent('click', { name: 'cancel logout', ...analyticsData });
    ModalEvent('close', { name: 'logout confirmation', ...analyticsData });
    handleClose();
  };

  const openSurveyAndHide = () => {
    props.openPopUp();
    handleClose();
  };

  const openSurveyAndLogout = () => {
    props.openPopUp();
    continuLogout();
  };
  return {
    store,
    continuLogout,
    stopLogout,
    open,
    handleClose,
    openSurveyAndHide,
    openSurveyAndLogout,
    loading,
  };
};

export default useController;
