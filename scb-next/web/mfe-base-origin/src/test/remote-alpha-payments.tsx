import React from "react";
import type { RatanAppearanceInput } from "ratan-design-origin";

export default function AlphaPaymentsTestRemote({
  appearance
}: {
  appearance?: RatanAppearanceInput;
}): React.ReactElement {
  return (
    <div
      data-testid="remote-alpha-payments-stub"
      data-mode={appearance?.mode}
      data-generation={appearance?.designGeneration}
    >
      Alpha Payments remote test
    </div>
  );
}
