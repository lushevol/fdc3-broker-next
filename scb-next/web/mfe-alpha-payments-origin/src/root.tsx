import {
  RatanDesignProvider,
  type RatanAppearanceInput
} from "ratan-design-origin";
import "ratan-design-origin/styles.css";

import App from "./App";

export interface AlphaPaymentsApplicationProps {
  appearance?: RatanAppearanceInput;
}

export default function AlphaPaymentsApplication({
  appearance
}: AlphaPaymentsApplicationProps): React.ReactElement {
  return (
    <RatanDesignProvider
      className="alpha-design-scope"
      mode={appearance?.mode}
      designGeneration={appearance?.designGeneration}
    >
      <App />
    </RatanDesignProvider>
  );
}
