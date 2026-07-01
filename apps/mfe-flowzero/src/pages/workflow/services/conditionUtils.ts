import { useWorkflowDesignerContext } from "../viewModel/WorkflowDesignerProvider";

export type FieldType =
  | "String"
  | "Number"
  | "Date"
  | "DateTime"
  | "Boolean"
  | "Array";

export interface Condition {
  id: string;
  field?: string;
  operator?: string;
  value?: string;
}

export type Conjunction = "And" | "Or";

export interface ConditionGroupValue {
  conjunction: Conjunction;
  conditions: Condition[];
}

function escapeValue(v: string | number) {
  if (v === null || v === undefined) return "";
  return String(v).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function normalizeArrayValue(
  val: string | string[] | number[] | undefined | null
): string[] {
  if (Array.isArray(val)) {
    return val.map(String);
  }
  if (typeof val === "string") {
    // Newline-separated (UI stores tags joined by "\n")
    return val.split("\n").filter(Boolean);
  }
  return [];
}

export function conditionToExpression(
  cond: Condition,
  fieldType: FieldType = "String",
  prefix: string = ""
): string {
  const f = cond.field ? `${prefix}${cond.field}` : "";
  const op = (cond.operator || "").toLowerCase();

  const raw = cond.value ?? "";
  const v = escapeValue(raw);

  if (fieldType === "String") {
    switch (op) {
      case "=":
        return `${f}=='${v}'`;
      case "!=":
        return `${f}!='${v}'`;
      case "is null":
        return `${f}==null`;
      case "is not null":
        return `${f}!=null`;
      case "in": {
        const vals = normalizeArrayValue(cond.value)
          .map((s) => `'${escapeValue(s)}'`)
          .join(", ");
        return `stringExpression.in(${f}, ${vals})`;
      }
      case "not in": {
        const vals = normalizeArrayValue(cond.value)
          .map((s) => `'${escapeValue(s)}'`)
          .join(", ");
        return `stringExpression.notIn(${f}, ${vals})`;
      }
      case "matches":
        return `stringExpression.matches(${f}, '${v}')`;
      case "not matches":
        return `stringExpression.notMatches(${f}, '${v}')`;
      default:
        break;
    }
  }

  if (fieldType === "Number") {
    switch (op) {
      case "=":
        return `numberExpression.isEq(${f}, '${v}')`;
      case "!=":
        return `numberExpression.isNe(${f}, '${v}')`;
      case "<":
        return `numberExpression.isLt(${f}, '${v}')`;
      case ">":
        return `numberExpression.isGt(${f}, '${v}')`;
      case "<=":
        return `numberExpression.isLte(${f}, '${v}')`;
      case ">=":
        return `numberExpression.isGte(${f}, '${v}')`;
      case "is null":
        return `${f}==null`;
      case "is not null":
        return `${f}!=null`;
      case "in": {
        const vals = normalizeArrayValue(cond.value)
          .map((s) => `'${escapeValue(s)}'`)
          .join(", ");
        return `numberExpression.in(${f}, ${vals})`;
      }
      case "not in": {
        const vals = normalizeArrayValue(cond.value)
          .map((s) => `'${escapeValue(s)}'`)
          .join(", ");
        return `numberExpression.notIn(${f}, ${vals})`;
      }
      case "between": {
        const parts = normalizeArrayValue(cond.value);
        if (parts.length >= 2)
          return `numberExpression.between(${f}, '${escapeValue(
            parts[0]
          )}', '${escapeValue(parts[1])}')`;
        return `numberExpression.eq(${f}, '${v}')`;
      }
      case "not between": {
        const parts = normalizeArrayValue(cond.value);
        if (parts.length >= 2)
          return `numberExpression.notBetween(${f}, '${escapeValue(
            parts[0]
          )}', '${escapeValue(parts[1])}')`;
        return `numberExpression.ne(${f}, '${v}')`;
      }
      default:
        break;
    }
  }

  if (fieldType === "Boolean") {
    switch (op) {
      case "is true":
      case "istrue":
        return `${f}==true`;
      case "is false":
      case "isfalse":
        return `${f}==false`;

      default:
        break;
    }
  }

  if (fieldType === "Date" || fieldType === "DateTime") {
    switch (op) {
      case "=":
        return `${f}=='${v}'`;
      case "!=":
        return `${f}!='${v}'`;
      case ">":
        return `${f}>'${v}'`;
      case "<":
        return `${f}<'${v}'`;
      default:
        break;
    }
  }

  if (fieldType === "Array") {
    switch (op) {
      case "contain": {
        const vals = normalizeArrayValue(cond.value);
        const val = vals[0] ? `'${escapeValue(vals[0])}'` : "''";
        return `arrayExpression.contain(${f}, ${val})`;
      }
      case "not contain": {
        const vals = normalizeArrayValue(cond.value);
        const val = vals[0] ? `'${escapeValue(vals[0])}'` : "''";
        return `arrayExpression.notContain(${f}, ${val})`;
      }
      case "is null":
        return `${f}==null`;
      case "is not null":
        return `${f}!=null`;
      default:
        break;
    }
  }

  switch (op) {
    case "gt":
    case ">":
      return `${f}>'${v}'`;
    case "lt":
    case "<":
      return `${f}<'${v}'`;
    case ">=":
      return `${f}>='${v}'`;
    case "<=":
      return `${f}<='${v}'`;
    case "equals":
    case "=":
      return `${f}=='${v}'`;
    case "not_equals":
    case "!=":
      return `${f}!='${v}'`;
    case "is true":
    case "istrue":
      return `${f}==true`;
    case "is false":
    case "isfalse":
      return `${f}==false`;
    case "is null":
      return `${f}==null`;
    case "is not null":
      return `${f}!=null`;
    default:
      return `${f}=='${v}'`;
  }
}

// ---------------------------------------------------------------------------
// Shared field-type mapping & hook — consumed by form panels and BpmnService
// ---------------------------------------------------------------------------

export const FIELD_TYPE_MAP: Record<string, FieldType> = {
  STRING: "String",
  NUMBER: "Number",
  DATE: "Date",
  DATETIME: "DateTime",
  BOOLEAN: "Boolean",
  ARRAY: "Array",
};

/**
 * React hook — returns fieldDefs derived from the workflow designer store.
 * Shared by IfNodeForm, InclusiveGatewayNodeForm, and any future gate panels.
 * Must only be called inside a component tree wrapped by WorkflowDesignerProvider.
 */
export function useFieldDefsFromForm(): Array<{
  label: string;
  value: string;
  type: FieldType;
}> {
  const { workflowDesignerStore: store } = useWorkflowDesignerContext();
  const variables: any[] = store?.selectedFormFields || [];
  return variables.map((f) => ({
    label: f?.label,
    value: f?.indexedTerm,
    type: FIELD_TYPE_MAP[f.dataType?.toUpperCase()] ?? "String",
  }));
}

export function buildConditionGroupExpression(
  group: ConditionGroupValue | undefined,
  fieldTypeResolver?: (fieldName: string) => FieldType,
  prefix: string = "start."
): string | null {
  if (!group || !group.conditions || group.conditions.length === 0) return null;
  const conj = (group.conjunction || "And").toLowerCase();
  if (group.conditions.length === 1) {
    // 单个条件不加括号
    const c = group.conditions[0];
    const t = fieldTypeResolver ? fieldTypeResolver(c.field || "") : "String";
    return `\${${conditionToExpression(c, t as FieldType, prefix)}}`;
  }
  // 多个条件每个加括号
  const parts = group.conditions.map((c) => {
    const t = fieldTypeResolver ? fieldTypeResolver(c.field || "") : "String";
    return `(${conditionToExpression(c, t as FieldType, prefix)})`;
  });
  const expr = conj === "and" ? parts.join(" && ") : parts.join(" || ");
  return `\${${expr}}`;
}

export default {};
