import useAnalytics from '../../../analytics';
import type { AnalyticsData } from '../../../analytics/model';
import useDispatcher from '../../../hooks/dispathcer';
import { useContext } from '../../../hooks/provider';
import { ActionType } from '../../../hooks/reducer/util/ActionType';

const analyticsData: AnalyticsData = { container: 'Base', tile: 'home' };
const useController = () => {
  const [store] = useContext();
  const { SwitchEvent } = useAnalytics();
  const { dispacthTheme } = useDispatcher();
  const setRootTheme = (theme: 'light' | 'dark') => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  };

  const toggleColorMode = () => {
    const mode = store.theme === 'light' ? 'dark' : 'light';
    setRootTheme(mode);
    dispacthTheme(mode);
    window.localStorage.setItem(ActionType.SET_THEME, mode);
    window.localStorage.setItem('theme', mode);
    SwitchEvent('click', {
      name: 'toggle theme',
      value: mode,
      ...analyticsData,
    });
  };
  return {
    store,
    toggleColorMode,
  };
};

export default useController;
