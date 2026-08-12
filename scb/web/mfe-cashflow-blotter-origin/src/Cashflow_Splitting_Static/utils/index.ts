import { GridApi } from "ag-grid-community";
import { HookAPI } from "antd/es/modal/useModal";

import { StaticRuleRow } from "../services/api.type";

export const actionConfirmation = async (modal: HookAPI, action: string) => {
  const confirmed = await modal.confirm({
    title: "Warning",
    content: `Are you sure to ${action} this rule ?`,
    okText: "Confirm",
    cancelText: "Dismiss",
    getContainer: false,
    centered: true,
    width: 450,
  });
  return confirmed;
};

// { a: 1, b: { c: 2, d: { e: 3 } } } => ["a", "b.c", "b.d.e"]
export const flattenKeys = (obj: Object, prefix: string = ""): string[] => {
  return Object.keys(obj).reduce<string[]>((acc, key) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const nested = flattenKeys(obj[key], path);
      return [...acc, ...nested];
    } else return [...acc, path];
  }, []);
};

// returns diff object which only contains different key path with obj2 value.
export const getDiff = <T extends Object>(obj1: T, obj2: T) => {
  const diff = {};
  Object.keys(obj1).forEach((key) => {
    if (
      typeof obj1[key] === "object" &&
      obj1[key] !== null &&
      typeof obj2[key] === "object" &&
      obj2[key] !== null
    ) {
      diff[key] = getDiff(obj1[key], obj2[key]);
    } else if (obj1[key] !== obj2[key]) {
      diff[key] = obj2[key];
    }
  });
  return diff;
};

export const flashUpdatedCashflows = (
  api: GridApi,
  updatedCashflows: StaticRuleRow[],
  originCashflowsBeUpdated: StaticRuleRow[],
  hightlightDuration: number
) => {
  updatedCashflows.forEach((r) => {
    const rowNode = api?.getRowNode(r.id + "");
    if (!rowNode) return;
    const originCashflow = originCashflowsBeUpdated.find(
      (o) => o.ruleUniqueId === r.ruleUniqueId
    );
    const columns = originCashflow
      ? flattenKeys(getDiff<StaticRuleRow>(originCashflow, r))
      : undefined;
    api?.flashCells({
      rowNodes: [rowNode],
      columns,
      fadeDuration: hightlightDuration,
    });
  });
};
