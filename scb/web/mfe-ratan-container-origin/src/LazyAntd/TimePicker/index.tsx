import React, { ReactElement, Suspense } from "react";
const Comp = React.lazy(() => import("./Comp"));
const DatePicker: React.FC<any> = (props: any): ReactElement => {
  return (
    <Suspense fallback="">
      <Comp {...props} />
    </Suspense>
  );
};
export default DatePicker;
