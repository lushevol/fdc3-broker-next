import React from "react";
import { Select as DesignSelect, type SelectProps } from "ratan-design-origin";
export type { SelectProps } from "ratan-design-origin";

const leftClassName = process.env.MFE_APP_PREFIX_STYLE + "_CustomSelect-left";

export default React.forwardRef<HTMLDivElement, SelectProps>(function Select(
  { labelPosition, formControlClassName, ...props },
  ref
) {
  return (
    <DesignSelect
      {...props}
      ref={ref}
      labelPosition={labelPosition}
      formControlClassName={[
        labelPosition === "left" ? leftClassName : "",
        formControlClassName,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
});
