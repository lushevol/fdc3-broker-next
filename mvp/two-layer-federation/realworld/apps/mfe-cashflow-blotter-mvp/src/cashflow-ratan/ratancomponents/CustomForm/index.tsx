import React, {
  forwardRef,
  PropsWithChildren,
  ReactElement,
  Suspense,
} from "react";
import FormSkeleton from "./FormSkeleton";
import { CustomFormProps, RefStructType } from "./interface";
import { convertValue } from "./validation/validationUtils";
const CustomFormLazy = React.lazy(() => import("./CustomForm"));

export const CustomForm = forwardRef<
  RefStructType,
  PropsWithChildren<CustomFormProps>
>((props, ref): ReactElement => {
  return (
    <Suspense
      fallback={
        <FormSkeleton
          repeat={Math.ceil((props.formConfig?.length || 0) / 10)}
        />
      }
    >
      <CustomFormLazy {...props} ref={ref} />
    </Suspense>
  );
});

export { convertValue };
export default CustomForm;
