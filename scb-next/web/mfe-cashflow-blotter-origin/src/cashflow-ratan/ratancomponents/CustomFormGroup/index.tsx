import React, {
  forwardRef,
  PropsWithChildren,
  ReactElement,
  Suspense,
} from "react";
import FormSkeleton from "../CustomForm/FormSkeleton";
import { CustomFormProps, RefStructType } from "./interface";
import { convertValue } from "../CustomForm/validation/validationUtils";
const CustomFormGroupLazy = React.lazy(() => import("./CustomFormGroup"));

export const CustomFormGroup = forwardRef<
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
      <CustomFormGroupLazy {...props} ref={ref} />
    </Suspense>
  );
});

export { convertValue };
export default CustomFormGroup;
