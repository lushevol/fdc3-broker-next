import React, { ReactElement, Suspense } from "react";
import { Container as ContainerProps } from "../../../hooks/model/workspaces";
import Splash from "../../../components/Splash";
import ErrorBoundry from "../../../components/ErrorBoundry";
const AdminModule = React.lazy(() => import("../../../admin"));
const RatanContainer = React.lazy(() => import("mfe_ratan_container/application"));

const Container: React.FC<ContainerProps> = (
  props: ContainerProps
): ReactElement => {
  const Comp = props.container === "@fm/ratan_container" ? RatanContainer : undefined;
  return (
    <ErrorBoundry emailSupport={props.emailSupport}>
      <Suspense fallback={<Splash />}>
        {props.container === "@fm/base" ? (
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
          />
        ) : (
          <div role="alert">Unknown federated container: {props.container}</div>
        )}
      </Suspense>
    </ErrorBoundry>
  );
};

export default React.memo(Container);
