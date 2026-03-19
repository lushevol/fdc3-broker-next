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
  ChatbotProvider,
  ChatbotSidebar,
} from '../../components/ChatbotSidebar/exports';

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
  } = useController();
  const { openTile } = useParameters();
  const { channelMessage, clearMessage } = useOpenfin(openTile);
  const length = store?.workspaces?.length ?? 0;

  if (!validateWorkspaceReady || !ready) {
    return <></>;
  }

  return (
    <AssistantUIRuntimeProvider apiUrl="/api/chat">
      <ChatbotProvider>
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
      </ChatbotProvider>
    </AssistantUIRuntimeProvider>
  );
};

export default React.memo(Home);
