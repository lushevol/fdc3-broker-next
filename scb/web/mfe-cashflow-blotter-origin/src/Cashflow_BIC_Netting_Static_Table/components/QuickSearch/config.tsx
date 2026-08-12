import { BicStaticSchemas } from "src/Cashflow_BIC_Netting_Static_Table/schemas/fields";
import { RatanSchema } from "src/Root/RatanFrontEndSchema/type";

export const quickSearchFields: RatanSchema[] = [
  ...BicStaticSchemas.filter((k) =>
    k.properties?.some(
      (p) =>
        p.module === "beneficiary_bic_netting_static" &&
        p.name === "display_in_quick_search" &&
        p.value === true
    )
  ),
];
