import React from 'react';
import useAnalytics from '../../../analytics';
import type { AnalyticsData } from '../../../analytics/model';
import useDispatcher from '../../../hooks/dispathcer';
import { useContext } from '../../../hooks/provider';
import { relogin } from '../../../hooks/service';
import useServices from '../../../services';
import { getJWTPayload, waitFor } from '../../../utils/common';
import type { TimeoutProps } from './interface';

const analyticsData: AnalyticsData = { container: 'Base', tile: 'Timeout' };

const useController = (props: TimeoutProps) => {
  const [store] = useContext();
  const { dispacthIsOnLogout } = useDispatcher();
  const [loading, setLoading] = React.useState(false);
  const { ButtonEvent, ModalEvent } = useAnalytics();
  const { logout } = useServices();
  const timerPopup = React.useRef<any>(0);
  const clearAllTimeout = () => {
    if (timerPopup.current) {
      clearTimeout(timerPopup.current);
    }
  };

  React.useEffect(() => {
    if (store.refreshToken) {
      ModalEvent('open', { name: 'session control', ...analyticsData });
      const payload = getJWTPayload(store.refreshToken);
      const diff = 1000 * payload.exp - new Date().getTime() - 2000;
      timerPopup.current = setTimeout(() => {
        continuLogout();
      }, diff);
    } else {
      // continuLogout();
    }
    return () => {
      clearAllTimeout();
    };
  }, []);

  const continuLogout = async () => {
    dispacthIsOnLogout(true);
    setLoading(true);
    ButtonEvent('click', { name: 'logout', ...analyticsData });
    ModalEvent('close', { name: 'session control', ...analyticsData });
    await waitFor(1000);
    await logout();
    clearAllTimeout();
    props.setOpen(false);
  };

  const extend = async () => {
    setLoading(true);
    ButtonEvent('click', { name: 'extend', ...analyticsData });
    ModalEvent('close', { name: 'session control', ...analyticsData });
    await relogin();
    clearAllTimeout();
    props.setOpen(false);
  };

  return {
    store,
    continuLogout,
    extend,
    clearAllTimeout,
    timerPopup,
    loading,
  };
};

export default useController;
