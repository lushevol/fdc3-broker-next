declare module "mfe_ratan_container/application" {
  import type { ComponentType } from "react";
  import type { RatanAppearanceInput } from "ratan-design-origin";
  const Application: ComponentType<
    Record<string, unknown> & { appearance?: RatanAppearanceInput }
  >;
  export default Application;
}

declare module "mfe_alpha_payments/application" {
  import type { ComponentType } from "react";
  import type { RatanAppearanceInput } from "ratan-design-origin";
  const Application: ComponentType<
    Record<string, unknown> & { appearance?: RatanAppearanceInput }
  >;
  export default Application;
}
