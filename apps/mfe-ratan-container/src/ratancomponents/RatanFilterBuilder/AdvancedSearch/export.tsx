import React, { ReactElement, Suspense } from "react";
import { ErrorBoundry } from "../../../Root/import";
import { EntrySelectorSkeleton } from "./components/Skeleton";
import type { AdvancedSearchProps } from "./index";
export { generateTemplateFilterRecord } from "./common/utiles";

const AdvancedSearchComp = React.lazy(() => import("./index"));
const AdvancedSearch: React.FC<AdvancedSearchProps> = (
  props: AdvancedSearchProps
): ReactElement => {
  return (
    <ErrorBoundry>
      <Suspense fallback={<EntrySelectorSkeleton />}>
        <AdvancedSearchComp {...props} />
      </Suspense>
    </ErrorBoundry>
  );
};
export default AdvancedSearch;
