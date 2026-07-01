import React, { ReactElement, Suspense } from "react";
const Comp = React.lazy(() => import("./Comp"));
const OptionComp = React.lazy(() => import("./Option"));
const OptGroupComp = React.lazy(() => import("./OptGroup"));
export const Option: React.FC<any> = (props: any): ReactElement => {
  return (
    <Suspense fallback="">
      <OptionComp {...props} />
    </Suspense>
  );
};
export const OptGroup: React.FC<any> = (props: any): ReactElement => {
  return (
    <Suspense fallback="">
      <OptGroupComp {...props} />
    </Suspense>
  );
};
const Select: React.FC<any> = (props: any): ReactElement => {
  return (
    <Suspense fallback="">
      <Comp {...props} />
    </Suspense>
  );
};
export default Select;
