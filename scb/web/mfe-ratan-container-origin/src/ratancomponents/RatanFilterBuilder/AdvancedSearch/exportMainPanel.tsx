import React, { ReactElement, Suspense } from "react";
import { ErrorBoundry } from "../../../Root/import";
import { EntrySelectorSkeleton } from "./components/Skeleton";
export {
  AdvancedSearchStaticContext,
  AdvancedSearchContext,
} from "./hooks/useContext";

const MainPanelComp = React.lazy(() => import("./components/MainPanel"));
const MainPanelExport: React.FC = (): ReactElement => {
  return (
    <ErrorBoundry>
      <Suspense fallback={<EntrySelectorSkeleton />}>
        <MainPanelComp />
      </Suspense>
    </ErrorBoundry>
  );
};
export default MainPanelExport;
