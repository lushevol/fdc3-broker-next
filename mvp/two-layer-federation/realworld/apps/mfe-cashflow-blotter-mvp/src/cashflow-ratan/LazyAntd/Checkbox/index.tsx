import React, { ReactElement, Suspense } from "react";
const Comp = React.lazy(() => import("./Comp"));
const Checkbox: React.FC<any> = (props: any): ReactElement => {
  return (
    <Suspense fallback="">
      <Comp {...props} />
    </Suspense>
  );
};
export default Checkbox;
