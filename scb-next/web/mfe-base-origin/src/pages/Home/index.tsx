import React, { ReactElement } from 'react';
import { Tabs, Tab, Box } from 'ratan-design-origin/primitives';
import { Button } from 'ratan-design-origin';
import { Add as AddIcon } from 'ratan-design-origin/icons';
import { useTheme } from 'ratan-design-origin/theme';
import useController from './common/useController';
import Root, { classes, PREFIX } from './common/style';
import TabPanel, { a11yProps } from '../../components/TabPanel';
import TabItem from '../../components/TabItem';
import AppBar from '../../components/AppBar';
import Container from './common/Container';
import Empty from '../../components/Empty';
import Timeout from '../../components/Timeout';
import { Workspace } from '../../hooks/model/workspaces';
import useOpenfin from './common/useOpenfin';
import Snackbar from '../../components/Snackbar';
import backgroundDark from '../../theme/config/background-dark.png';
import backgroundLight from '../../theme/config/background-light.png';
import pattern from '../../theme/config/pattern.png';
import portalTextLight from '../../theme/config/portal-text-light.png';
import portalTextDark from '../../theme/config/portal-text-dark.png';
import mo1Logo from '../../components/AppBar/mo1_logo_dark.svg';
import { resolvePortalAppearance } from '../../new-styles/appearance';
import { PortalWorkspaceRoot } from '../../new-styles/workspace-style';

export const ContainerComponent = (validation: boolean, item: Workspace, i: number) =>
  validation ? (
    <Container
      {...item.containers[0]}
      panelId={`workspaces-tabpanel-${i + 1}`}
      tabId={item.id}
      leftPosition={item.containers[0].leftPosition}
      topPossition={item.containers[0].topPossition}
    />
  ) : (
    <Empty />
  );

// Tabs decorates every child with tab-only props; these slots remain plain divs.
const WorkspaceTabsAdornment: React.FC<
  Pick<React.HTMLAttributes<HTMLDivElement>, 'children' | 'className'>
> = ({ children, className }) => <div className={className}>{children}</div>;

const Home: React.FC = (): ReactElement => {
  const theme = useTheme();
  const {
    store,
    value,
    handleChange,
    add,
    edit,
    remove,
    refreshTab,
    focus,
    ready,
    showTimeout,
    setShowTimeout,
    mouseMove,
    validateWorkspaceReady,
  } = useController();
  const { channelMessage, clearMessage } = useOpenfin();
  const length = store?.workspaces?.length ?? 0;

  if (!validateWorkspaceReady || !ready) {
    return <></>;
  }
  // when we change to new design, we need to delete the import and isNewLayout variable
  // And do some changes based on isNewLayout is true
  const params = new URLSearchParams(window.location.search);
  const appearance = resolvePortalAppearance(store.newStyles, params.toString());
  const isPrototype = appearance === 'prototype';
  const isNewLayout = appearance !== 'legacy';
  const WorkspaceRoot = isPrototype ? PortalWorkspaceRoot : Root;

  const headerStyle: React.CSSProperties | undefined =
    appearance === 'layout-preview'
      ? {
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
        }
      : undefined;

  return (
    <WorkspaceRoot
      data-testid={PREFIX}
      onMouseMove={mouseMove}
      className={isPrototype ? 'prototype-home' : isNewLayout ? 'home-wrapper' : ''}
    >
      <header style={headerStyle} className={isPrototype ? 'portal-shell-header' : undefined}>
        {isPrototype && (
          <img className="portal-shell-logo" src={mo1Logo} alt="Markets Operations One logo" />
        )}
        <AppBar />
        <Tabs
          value={value}
          onChange={handleChange}
          data-testid={`${PREFIX}_workspaces`}
          aria-label="workspaces"
          className={classes.tabs}
          variant="scrollable"
          scrollButtons
          onDoubleClick={focus(value)}
        >
          {!isPrototype && <WorkspaceTabsAdornment className={classes.firsttab} />}
          {store?.workspaces?.map((item: Workspace, index) => {
            const showRefresh: boolean = !!(
              item.id === store?.currentWorkspace?.id &&
              store?.refreshTab &&
              (store?.refreshTab as Record<string, () => void> | undefined)?.[item.id]
            );
            return (
              <Tab
                key={item.id}
                value={index + 1}
                component="div"
                label={
                  <TabItem
                    item={item}
                    edit={edit}
                    remove={remove}
                    refreshTab={refreshTab}
                    showRemove={length > 1}
                    showRefresh={showRefresh}
                  />
                }
                className={classes.tab}
                style={
                  isPrototype
                    ? ({
                        '--portal-tab-name-width': `${Math.min(Math.max(item.label.length, 6), 30)}ch`,
                      } as React.CSSProperties)
                    : undefined
                }
                {...a11yProps(item.id)}
              />
            );
          })}
          {(!isNewLayout || isPrototype) && (
            <WorkspaceTabsAdornment className={classes.lasttab}>
              <Button
                variant="contained"
                className={classes.addtab}
                onClick={add}
                data-testid={`${PREFIX}_add_btn`}
                aria-label="Add Workspace"
                title="Add Workspace"
              >
                <AddIcon />
              </Button>
            </WorkspaceTabsAdornment>
          )}
        </Tabs>
        {appearance === 'layout-preview' && (
          <div className="divider" style={{ flexBasis: '100%', height: '18px' }}></div>
        )}
      </header>
      <main className={classes.main}>
        <Box className={classes.box}>
          {store?.workspaces?.map((item: Workspace, i) => {
            const validation: boolean = !!item?.containers?.length;
            const preserveAdminLayout =
              item.containers[0]?.container === '@fm/base' &&
              ['/category', '/tile', '/importmap'].includes(item.containers[0].module);
            return (
              <TabPanel
                key={item.id}
                tabId={item.id}
                value={value}
                index={i + 1}
                className={
                  preserveAdminLayout
                    ? `${classes.tabpanel} ${classes.cachedAdminPanel}`
                    : classes.tabpanel
                }
                isActive={item.isActive}
              >
                {ContainerComponent(validation, item, i)}
              </TabPanel>
            );
          })}
        </Box>
      </main>
      {showTimeout && <Timeout setOpen={setShowTimeout} />}
      {channelMessage && <Snackbar message={channelMessage} open={true} onClose={clearMessage} />}
    </WorkspaceRoot>
  );
};

export default React.memo(Home);
