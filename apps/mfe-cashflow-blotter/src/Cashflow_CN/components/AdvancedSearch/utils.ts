import { RuleGroupType } from "react-querybuilder";
import { hydrate } from "src/Root/import/ratancomponents";
import { isEmpty } from "src/Root/import/ratanutils";

import {
  canProceedAdvancedSearchFilter,
  mandatoryAdvancedFilterFields,
} from "../../Main/utils/filterGuard";
import { FilterRecord, RatanFieldConfig } from "./types";

export const filterFieldConfigItem = (
  workspace: string,
  fieldConfig: RatanFieldConfig
) => {
  return !fieldConfig.disabledPages?.includes(workspace);
};

export const validateAdvancedFilter = (
  nf: FilterRecord | null
): { valid: boolean; warningMsg?: string } => {
  if (isEmpty(nf)) {
    return { valid: true };
  }
  const RQBFilters: RuleGroupType = hydrate(nf?.body);

  const { valid, missingFields, invalidOperatorFields } =
    canProceedAdvancedSearchFilter(RQBFilters, mandatoryAdvancedFilterFields);

  if (!valid) {
    let msg = "";
    if (missingFields?.length) {
      msg += `Please fill in: ${missingFields
        .map((f) => f.label)
        .join(", ")}.\n`;
    }
    if (invalidOperatorFields?.length) {
      msg += invalidOperatorFields
        .map(
          (f) =>
            `Operator for "${f.label}" is invalid. Supported: ${
              Array.isArray(f.operator) ? f.operator.join(", ") : ""
            }.`
        )
        .join("\n");
    }
    return { valid: false, warningMsg: msg.trim() };
  }

  return { valid: true };
};
