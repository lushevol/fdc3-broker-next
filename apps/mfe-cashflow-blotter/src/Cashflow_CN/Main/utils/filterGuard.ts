import { RuleGroupType } from "react-querybuilder";

/**
 * Checks if the RuleGroupType contains target field and return field and operator as common method.
 */

interface CollectedRule {
  field: string;
  operator: string;
}
export const collectAllFieldRules = (group: RuleGroupType): CollectedRule[] => {
  let result: CollectedRule[] = [];
  if (!group || !Array.isArray(group.rules)) return result;
  for (const rule of group.rules) {
    if ("field" in rule && typeof rule.field === "string") {
      result.push({ field: rule.field, operator: rule.operator });
    }
    if ("rules" in rule && Array.isArray(rule.rules)) {
      result = result.concat(collectAllFieldRules(rule as RuleGroupType));
    }
  }
  return result;
};

export const byPassQuickSearchFields = [
  "Cashflow.Cashflow_Id",
  "Trade_Id",
  "BCS_Parent_Trade_Id",
];
/**
 * If filter containes cashflowId or tradeId then process
 * Value date must be mandatory
 * Value date + booking entity fmid / counterparty fmcode --pass
 * neither booking entity fmid nor counterparty fmcode -- refuse
 */

export const canProceedQuickSearchFilter = (
  group: RuleGroupType
): { valid: boolean; message?: string } => {
  const allRules = collectAllFieldRules(group);
  const hasField = (field: string) => allRules.some((r) => r.field === field);

  const hasByPassField = allRules.some((rule) =>
    byPassQuickSearchFields.includes(rule.field)
  );

  if (!group || !Array.isArray(group.rules) || group.rules.length === 0) {
    return { valid: false, message: "Please fill in the filter." };
  }
  if (hasByPassField) {
    return { valid: true };
  }
  const hasValueDate = hasField("Cashflow.Payment_Date");
  const counterPartyFields = [
    "Entity.Counterparty_SCI_FMCODE",
    "Entity.Counterparty_SCI_FMID",
  ];
  const hasBookingEntityFMID = hasField("Entity.Booking_Entity_SCI_FMID");
  const hasCounterpartyCode = counterPartyFields.some(hasField);
  const missingMsg: string[] = [];

  if (!hasValueDate) missingMsg.push("Value Date is missing");
  if (!hasBookingEntityFMID && !hasCounterpartyCode)
    missingMsg.push("Booking Entity or Counterparty Code is missing");

  if (missingMsg.length > 0) {
    return {
      valid: false,
      message: `${missingMsg.join(", ")}.`,
    };
  }

  return { valid: true };
};

export interface AdvancedMandatoryField {
  field: string;
  label: string;
  operator?: string[];
}

/**
 * Below config using by advanced search
 */
export const mandatoryAdvancedFilterFields: AdvancedMandatoryField[] = [
  {
    field: "Cashflow.Payment_Date",
    label: "Payment Date",
    operator: ["=", "in", "between", "<=", ">="],
  },
  {
    field: "Cashflow.Cashflow_State",
    label: "Cashflow State",
    operator: ["=", "in"],
  },
  {
    field: "Entity.Booking_Entity_SCI_FMID",
    label: "Booking Entity",
    operator: ["=", "in"],
  },
];

/**
 * Proceed quick filter must follow below condition
 * - Field Payment Date && Booking Entity FMID && Cashflow State must all in filter
 * - for those above field the operator of that field must follow target operator
 * - If any field in rules arr end lowercase with "_id" then by pass directly
 * - Others refuse
 */
export const canProceedAdvancedSearchFilter = (
  group: RuleGroupType,
  mandatoryFields: AdvancedMandatoryField[]
): {
  valid: boolean;
  missingFields?: AdvancedMandatoryField[];
  invalidOperatorFields?: AdvancedMandatoryField[];
} => {
  const allRules = collectAllFieldRules(group);
  const isByPass = allRules.some((rule) =>
    rule.field.toLowerCase().endsWith("_id")
  );
  const missingFields = mandatoryFields.filter(
    (item) => !allRules.some((r) => r.field === item.field)
  );
  const invalidOperatorFields: AdvancedMandatoryField[] = [];

  if (isByPass) {
    return {
      valid: true,
    };
  }
  for (const item of mandatoryFields) {
    const matched = allRules.filter((r) => r.field === item.field);
    if (
      matched.length > 0 &&
      !matched.every((r) =>
        item.operator?.includes((r.operator || "").toLowerCase())
      )
    ) {
      invalidOperatorFields.push(item);
    }
  }

  return {
    valid: missingFields.length === 0 && invalidOperatorFields.length === 0,
    missingFields: missingFields.length ? missingFields : undefined,
    invalidOperatorFields: invalidOperatorFields.length
      ? invalidOperatorFields
      : undefined,
  };
};
