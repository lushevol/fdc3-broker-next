import React, { type ReactElement, Suspense } from 'react';
import PageLoader from '../../components/Loader/PageLoader';
import Snackbar from '../../components/Snackbar';
import Login from '../../pages/Login';
import SingleView from '../../pages/SingleView';
import { isSingleViewRequest } from '../../pages/Home/common/singleView';
import Root, { classes, PREFIX } from '../../routing/common/style';
import useController from '../../routing/common/useController';
import NewLayoutSplash from '../components/Splash';

const NewLayoutHome = React.lazy(() => import('../pages/Home'));

export const NewLayoutRoutingComponent = (token, entities) => {
  if (!token || !entities) return <Login />;
  return isSingleViewRequest() ? <SingleView /> : <NewLayoutHome />;
};

const NewLayoutRouting: React.FC = (): ReactElement => {
  const { store, handleCloseErrorMessage, isReady } = useController();
  const singleViewRequest = isSingleViewRequest();

  if (!isReady) {
    return (
      <Root className={classes.root} data-testid={PREFIX}>
        <PageLoader />
      </Root>
    );
  }

  return (
    <Root className={classes.root} data-testid={PREFIX}>
      <Suspense fallback={<NewLayoutSplash />}>
        {NewLayoutRoutingComponent(store.token, store.entities)}
      </Suspense>
      {!singleViewRequest && store.isLoading && <PageLoader />}
      {!singleViewRequest && store.errorMsg && (
        <Snackbar
          open={!!store.errorMsg}
          onClose={handleCloseErrorMessage}
          message={store.errorMsg}
          variant="standard"
          severity="error"
        />
      )}
    </Root>
  );
};

export default NewLayoutRouting;
