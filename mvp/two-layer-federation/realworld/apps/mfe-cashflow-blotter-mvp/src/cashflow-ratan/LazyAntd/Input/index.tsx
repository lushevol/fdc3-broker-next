import React, { ReactElement, Suspense } from "react";
const Comp = React.lazy(() => import("./Comp"));
const TextAreaComp = React.lazy(() => import("./TextAreaComp"));
export const TextArea: React.FC<any> = (props: any): ReactElement => {
  return (
    <Suspense fallback="">
      <TextAreaComp {...props} />
    </Suspense>
  );
};
const Input: React.FC<any> = (props: any): ReactElement => {
  return (
    <Suspense fallback="">
      <Comp {...props} />
    </Suspense>
  );
};
export default Input;
