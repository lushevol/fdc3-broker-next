import React from "react";
import { Input as DesignInput, type InputProps } from "ratan-design-origin";
export { InputStyled } from "ratan-design-origin/compatibility";
export type { InputProps } from "ratan-design-origin";

const leftClassName = process.env.MFE_APP_PREFIX_STYLE + "_CustomInput-left";

export default React.forwardRef<HTMLDivElement, InputProps>(function Input(
  { labelPosition, className, ...props },
  ref
) {
  return (
    <DesignInput
      {...props}
      ref={ref}
      labelPosition={labelPosition}
      className={[
        labelPosition?.toLowerCase() === "left" ? leftClassName : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
});
