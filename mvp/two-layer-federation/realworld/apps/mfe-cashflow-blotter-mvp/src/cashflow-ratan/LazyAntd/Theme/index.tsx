import React, { PropsWithChildren, ReactElement, Suspense } from "react";
const Comp = React.lazy(() => import("./AntdTheme"));
const AntdThemeRoot: React.FC<PropsWithChildren> = ({
  children,
}): ReactElement => {
  return (
    <Suspense fallback="">
      <Comp>{children}</Comp>
    </Suspense>
  );
};
export default AntdThemeRoot;
