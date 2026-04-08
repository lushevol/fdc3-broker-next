import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { type ReactElement } from 'react';
import AppBar from '../../components/AppBar';
import Empty from '../../components/Empty';
import Snackbar from '../../components/Snackbar';
import TabItem from '../../components/TabItem';
import TabPanel, { a11yProps } from '../../components/TabPanel';
import Timeout from '../../components/Timeout';
import type { Workspace } from '../../hooks/model/workspaces';
import Container from './common/Container';
import Root, { classes, PREFIX } from './common/style';
import useController from './common/useController';
import useOpenfin from './common/useOpenfin';
import useParameters from './common/useParameters';
import {
  AssistantUIRuntimeProvider,
  ChatbotSidebar,
} from '../../components/ChatbotSidebar/exports';
import { useFDC3WorkspaceHelper } from '../../fdc3/useFDC3WorkspaceHelper';

export const ContainerComponent = (validation: boolean, item, i) =>
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

const Home: React.FC = (): ReactElement => {
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
    closeAllTiles,
  } = useController();
  const { openTile } = useParameters();
  const { channelMessage, clearMessage } = useOpenfin(openTile);
  const { workspaceOpenTile } = useFDC3WorkspaceHelper();
  const length = store?.workspaces?.length ?? 0;
  const toolRegistryConfig = React.useMemo(() => {
    const activeContainer = store?.currentWorkspace?.containers?.[0];

    return {
      workspaceLabel: store?.currentWorkspace?.label ?? 'Current workspace',
      tileCount: store?.currentWorkspace?.containers?.length ?? 0,
      getWorkspaceSnapshot: () => ({
        activeWorkspaceId: store?.currentWorkspace?.id ?? null,
        activeWorkspaceLabel: store?.currentWorkspace?.label ?? null,
        activeTileTitle: activeContainer?.title ?? null,
        activeTileId: activeContainer?.id ?? null,
        activeAppId: activeContainer?.tile?.replace(/^\//, '') ?? null,
        totalWorkspaces: store?.workspaces?.length ?? 0,
        totalTiles:
          store?.workspaces?.reduce(
            (count, workspace) => count + (workspace.containers?.length ?? 0),
            0,
          ) ?? 0,
        workspaces:
          store?.workspaces?.map((workspace) => ({
            id: workspace.id,
            label: workspace.label,
            tileCount: workspace.containers?.length ?? 0,
            isActive: workspace.id === store?.currentWorkspace?.id,
          })) ?? [],
      }),
      closeAllTiles: async () => {
        const workspaces = closeAllTiles();
        return {
          activeWorkspaceId: workspaces[0]?.id ?? null,
          activeWorkspaceLabel: workspaces[0]?.label ?? null,
          activeTileTitle: null,
          totalWorkspaces: workspaces.length,
          totalTiles: 0,
          workspaces: workspaces.map((workspace) => ({
            id: workspace.id,
            label: workspace.label,
            tileCount: 0,
            isActive: workspace.id === workspaces[0]?.id,
          })),
          actionMessage: `Closed all tiles across ${workspaces.length} ${
            workspaces.length === 1 ? 'workspace' : 'workspaces'
          }.`,
        };
      },
      openTile: async ({ tile }: { tile: string }) => {
        const openStatus = await workspaceOpenTile({ tile });
        return {
          ...openStatus,
          workspaceId: openStatus.workspaceId ?? '',
        };
      },
    };
  }, [
    closeAllTiles,
    store?.currentWorkspace?.containers,
    store?.currentWorkspace?.id,
    store?.currentWorkspace?.label,
    store?.workspaces,
    workspaceOpenTile,
  ]);

  if (!validateWorkspaceReady || !ready) {
    return <></>;
  }

  return (
    <AssistantUIRuntimeProvider apiUrl="/api/chat" toolRegistryConfig={toolRegistryConfig}>
      <Root data-testid={PREFIX} onMouseMove={mouseMove}>
        <header>
          <AppBar />
        </header>
        <main className={classes.main}>
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
            <div className={classes.firsttab}></div>
            {store?.workspaces?.map((item: Workspace) => {
              const showRefresh: boolean = !!(
                item.id === store?.currentWorkspace?.id &&
                store?.refreshTab &&
                store?.refreshTab[item.id]
              );
              return (
                <Tab
                  key={item.id}
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
                  {...a11yProps(item.id)}
                />
              );
            })}
            <div className={classes.lasttab}>
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
            </div>
          </Tabs>
          <Box className={classes.box}>
            {store?.workspaces?.map((item: Workspace, i) => {
              const validation: boolean = !!item?.containers?.length;
              return (
                <TabPanel
                  key={item.id}
                  tabId={item.id}
                  value={value}
                  index={i + 1}
                  className={classes.tabpanel}
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
        <ChatbotSidebar />
      </Root>
    </AssistantUIRuntimeProvider>
  );
};

export default React.memo(Home);
