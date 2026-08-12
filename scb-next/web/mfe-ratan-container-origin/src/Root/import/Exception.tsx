import React, { ReactElement, Suspense } from "react";
import { ContainerProps } from "../routing/common/interface";
import { Splash } from "./index";
import PageContainer from "../../ratancomponents/PageContainer";
import RatanProvider from "../hooks/provider";

const Mfe = React.lazy(() =>
  // @ts-ignore
  System.import("@fm/ratan_exception").then((a) => a)
);
const ExceptionSettlement: React.FC<ContainerProps> = (
  props: ContainerProps
): ReactElement => {
  return (
    <Suspense fallback={<Splash />}>
      <RatanProvider>
        <PageContainer>
          {/*@ts-ignore*/}
          <Mfe {...props} />
        </PageContainer>
      </RatanProvider>
    </Suspense>
  );
};

export default React.memo(ExceptionSettlement);
