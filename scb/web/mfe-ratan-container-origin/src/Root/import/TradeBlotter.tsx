import React, { ReactElement, Suspense } from "react";
import { ContainerProps } from "../routing/common/interface";
import { Splash } from "./index";
import PageContainer from "../../ratancomponents/PageContainer";
import RatanProvider from "../hooks/provider";
// @ts-ignore
const Mfe = React.lazy(() => System.import("@fm/ratan_trades").then((a) => a));

const TradeBlotter: React.FC<ContainerProps> = (
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

export default React.memo(TradeBlotter);
