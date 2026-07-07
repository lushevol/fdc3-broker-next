import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { type ReactElement } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import AppBar from '../../components/AppBar';
import Empty from '../../components/Empty';
import Snackbar from '../../components/Snackbar';
import SortableTab from '../../components/SortableTab';
import TabItem from '../../components/TabItem';
import TabPanel from '../../components/TabPanel';
import Timeout from '../../components/Timeout';
import type { Workspace } from '../../hooks/model/workspaces';
import Container from './common/Container';
import Root, { classes, PREFIX } from './common/style';
import useController from './common/useController';
import useOpenfin from './common/useOpenfin';
import useParameters from './common/useParameters';
import {
  ChatbotSidebarV2,
} from '../../components/ChatbotSidebarV2/exports';
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
    closeOthers,
    closeAll,
    handleReorder,
    handleDragStart,
    handleDragCancel,
    activeDragId,
  } = useController();
  const { openTile } = useParameters();
  const { channelMessage, clearMessage } = useOpenfin(openTile);
  const { workspaceOpenTile } = useFDC3WorkspaceHelper();
  const length = store?.workspaces?.length ?? 0;
  const workspaceIds = store?.workspaces?.map((w) => w.id) ?? [];
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  const draggedItem = activeDragId
    ? store?.workspaces?.find((w) => w.id === activeDragId)
    : undefined;
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
    <Root data-testid={PREFIX} onMouseMove={mouseMove}>
        <header>
          <AppBar />
        </header>
        <main className={classes.main}>
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleReorder}
            onDragCancel={handleDragCancel}
            sensors={sensors}
          >
            <div
              className={classes.tabBar}
              role="tablist"
              data-testid={`${PREFIX}_workspaces`}
            >
              <div className={classes.firsttab}></div>
              <SortableContext
                items={workspaceIds}
                strategy={horizontalListSortingStrategy}
              >
                {store?.workspaces?.map((item: Workspace) => {
                  const showRefresh: boolean = !!(
                    item.id === store?.currentWorkspace?.id &&
                    store?.refreshTab &&
                    store?.refreshTab[item.id]
                  );
                  return (
                    <SortableTab
                      key={item.id}
                      id={item.id}
                      active={item.id === store?.currentWorkspace?.id}
                      onClick={() => handleChange(item)}
                      onDoubleClick={focus(item)}
                    >
                      <TabItem
                        item={item}
                        edit={edit}
                        remove={remove}
                        refreshTab={refreshTab}
                        showRemove={length > 1}
                        showRefresh={showRefresh}
                        closeOthers={closeOthers}
                        closeAll={closeAll}
                      />
                    </SortableTab>
                  );
                })}
              </SortableContext>
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
            </div>
            <DragOverlay>
              {draggedItem ? (
                <div className={classes.dragOverlay}>
                  <TabItem
                    item={draggedItem}
                    edit={edit}
                    remove={remove}
                    refreshTab={refreshTab}
                    showRemove={length > 1}
                    showRefresh={
                      !!(
                        draggedItem.id === store?.currentWorkspace?.id &&
                        store?.refreshTab &&
                        store?.refreshTab[draggedItem.id]
                      )
                    }
                    closeOthers={closeOthers}
                    closeAll={closeAll}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
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
        <ChatbotSidebarV2 toolRegistryConfig={toolRegistryConfig} />
      </Root>
  );
};

export default React.memo(Home);
