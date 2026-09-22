import React, { ReactElement, Suspense } from 'react';
import { Container as ContainerProps } from '../../../hooks/model/workspaces';
import Splash from '../../../components/Splash';
import ErrorBoundry from '../../../components/ErrorBoundry';
import { useContext } from '../../../hooks/provider';
import type { RatanAppearance } from 'ratan-design-origin';
const AdminModule = React.lazy(() => import('../../../admin'));
const RatanContainer = React.lazy(() => import('mfe_ratan_container/application'));
const AlphaPayments = React.lazy(() => import('mfe_alpha_payments/application'));

const Container: React.FC<ContainerProps> = (props: ContainerProps): ReactElement => {
  const [store] = useContext();
  const appearance: RatanAppearance = {
    mode: store.theme === 'light' ? 'light' : 'dark',
    designGeneration: store.newStyles ? 'webkit' : 'legacy',
  };
  const Comp =
    props.container === '@fm/ratan_container'
      ? RatanContainer
      : props.container === '@fm/alpha_payments'
        ? AlphaPayments
        : undefined;
  return (
    <ErrorBoundry emailSupport={props.emailSupport}>
      <Suspense fallback={<Splash />}>
        {props.container === '@fm/base' ? (
          <AdminModule
            module={props.module}
            tile={props.tile}
            parameters={props.parameters ?? {}}
            panelId={props.panelId}
            tabId={props.tabId}
          />
        ) : Comp ? (
          <Comp
            module={props.module}
            tile={props.tile}
            parameters={props.parameters ?? {}}
            panelId={props.panelId}
            tabId={props.tabId}
            {...(props.container === '@fm/ratan_container' ||
            props.container === '@fm/alpha_payments'
              ? { appearance }
              : {})}
          />
        ) : (
          <div role="alert">Unknown federated container: {props.container}</div>
        )}
      </Suspense>
    </ErrorBoundry>
  );
};

export default React.memo(Container);
