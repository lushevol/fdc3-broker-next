import { useTheme } from '@mui/material/styles';
import React from 'react';
import Home, { type HomePresentation } from '../../../pages/Home';
import backgroundDark from '../../assets/header/background-dark.png';
import backgroundLight from '../../assets/header/background-light.png';
import pattern from '../../assets/header/pattern.png';
import portalTextDark from '../../assets/header/portal-text-dark.png';
import portalTextLight from '../../assets/header/portal-text-light.png';
import NewLayoutAppBar from '../../components/AppBar';
import NewLayoutEmpty from '../../components/Empty';
import NewLayoutWorkspaceTab from '../../components/WorkspaceTab';
import NewLayoutHomeRoot from './style';

const NewLayoutHome: React.FC = () => {
  const theme = useTheme();
  const presentation = React.useMemo<HomePresentation>(
    () => ({
      AppBarComponent: NewLayoutAppBar,
      EmptyComponent: NewLayoutEmpty,
      RootComponent: NewLayoutHomeRoot,
      TabItemComponent: NewLayoutWorkspaceTab,
      showAddWorkspace: false,
      tabsInHeader: true,
      headerStyle: {
        backgroundImage:
          theme.palette.mode === 'dark'
            ? `url(${portalTextDark}), url(${pattern}), url(${pattern}), url(${backgroundDark})`
            : `url(${portalTextLight}), url(${pattern}), url(${pattern}), url(${backgroundLight})`,
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat, no-repeat',
        backgroundSize: 'auto 24px, auto 100%, auto 100%, cover',
        backgroundPosition: '20px 20%, left center, right center, center',
        display: 'flex',
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        alignItems: 'center',
        height: '96px',
      },
    }),
    [theme.palette.mode],
  );

  return <Home presentation={presentation} />;
};

export default NewLayoutHome;
