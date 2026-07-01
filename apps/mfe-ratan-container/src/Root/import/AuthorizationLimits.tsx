import React, { ReactElement, Suspense } from "react";
import { ContainerProps } from "../routing/common/interface";
import { Splash } from "./index";
import RatanProvider from "../hooks/provider";
import PageContainer from "../../ratancomponents/PageContainer";
const Mfe = React.lazy(() =>
  // @ts-ignore
  System.import("@fm/ratan_authorization_limits").then((a) => a)
);

const CurrencyLimitation: React.FC<ContainerProps> = (
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

export default React.memo(CurrencyLimitation);
