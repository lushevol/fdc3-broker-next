import React, { ReactElement, Suspense } from "react";
const Comp = React.lazy(() => import("./filterSelectorComp"));
export const FilterSelector: React.FC<any> = (props: any): ReactElement => {
  return (
    <Suspense fallback="">
      <Comp {...props} />
    </Suspense>
  );
};
