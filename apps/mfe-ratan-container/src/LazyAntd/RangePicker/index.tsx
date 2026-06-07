import React, { ReactElement, Suspense } from "react";
const Comp = React.lazy(() => import("./Comp"));
const RangePicker: React.FC<any> = (props: any): ReactElement => {
  return (
    <Suspense fallback="">
      <Comp {...props} />
    </Suspense>
  );
};
export default RangePicker;
