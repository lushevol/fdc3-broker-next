import React, { ReactElement, Suspense } from "react";
import { ErrorBoundry } from "../../../Root/import";
import { FilterBuilderBodySkeleton } from "../AdvancedSearch/components/Skeleton";
import type { RatanQueryBuilderProps } from "./index";
export * from "./index";
export * from "./utils";
export * from "./Function";
export * from "react-querybuilder";

const ReactQueryBuilder = React.lazy(() => import("./index"));
const RatanQueryBuilder: React.FC<RatanQueryBuilderProps> = (
  props: RatanQueryBuilderProps
): ReactElement => {
  return (
    <ErrorBoundry>
      <Suspense fallback={<FilterBuilderBodySkeleton />}>
        <ReactQueryBuilder {...props} />
      </Suspense>
    </ErrorBoundry>
  );
};
export default RatanQueryBuilder;
