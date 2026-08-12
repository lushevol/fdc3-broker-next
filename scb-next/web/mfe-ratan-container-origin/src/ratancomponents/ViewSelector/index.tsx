import React, { ReactElement, Suspense } from "react";
const Comp = React.lazy(() => import("./ViewSelectorComp"));
export const ViewSelector: React.FC<any> = (props: any): ReactElement => {
  return (
    <Suspense fallback="">
      <Comp {...props} />
    </Suspense>
  );
};
