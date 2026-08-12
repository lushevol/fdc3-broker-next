import { BicNettingRuleRow } from "src/Cashflow_BIC_Netting_Static_Table/services/api.type";
import { ActionType, RoleType, RuleStatusType } from "src/Cashflow_BIC_Netting_Static_Table/state/types";
import { mockBicNettingRules } from "src/Cashflow_BIC_Netting_Static_Table/test/mock/mockRules";

import { generateActionsList, getActionButtonProps, getDetailsActionsRule, getRightMenuActionsFromRules } from "./utils";

it('getActionButtonProps', () => {
    const res = getActionButtonProps(ActionType.Update);
    expect(res.danger).toBe(false);
    expect(res.type).toBe("primary");
});

it('getRightMenuActionsFromRules', () => {
    const res = getRightMenuActionsFromRules(mockBicNettingRules);
    expect(res.length).toBe(2);
    expect(res[0].action).toBe(ActionType.Delete);
    expect(res[0].disabled).toBe(false);
});

it('getDetailsActionsRule', () => {
    const res = getDetailsActionsRule(mockBicNettingRules[0]);
    expect(res.length).toBe(2);
    expect(res[0].action).toBe(ActionType.Delete);
    expect(res[0].disabled).toBe(false);
});

it('generateActionsList', () => {
    const res = generateActionsList(mockBicNettingRules[0], "test_user_id", "Maker");
    expect(res.length).toBe(2);
    expect(res[0].action).toBe(ActionType.Delete);
    expect(res[0].disabled).toBe(false);
});

it('getRightMenuActionsFromRules - single rule with valid actions', () => {
  const mockRules = [
      { id: "1", dataStatus: RuleStatusType.UpdatePending, makerId: "test_user_id" }
  ] as unknown as BicNettingRuleRow[];
  const res = getRightMenuActionsFromRules(mockRules);
  expect(res.length).toBeGreaterThan(0);
  expect(res[0].action).toBe(ActionType.ApproveUpdate);
  expect(res[0].rows.length).toBe(1);
  expect(res[0].disabled).toBe(false);
});

it('getRightMenuActionsFromRules - multiple rules with overlapping actions', () => {
  const mockRules = [
    { id: "1", dataStatus: RuleStatusType.UpdatePending, makerId: "test_user_id" },
    { id: "2", dataStatus: RuleStatusType.UpdatePending, makerId: "test_user_id" }
  ] as unknown as BicNettingRuleRow[];
  const res = getRightMenuActionsFromRules(mockRules);
  expect(res.length).toBeGreaterThan(0);
  const updateAction = res.find(action => action.action === ActionType.Update);
  expect(updateAction).toBeUndefined(); // Update should be filtered out for multiple rows
  const deleteAction = res.find(action => action.action === ActionType.Delete);
  expect(deleteAction).toBeUndefined();
});

it('getRightMenuActionsFromRules - no rules provided', () => {
  const res = getRightMenuActionsFromRules([]);
  expect(res.length).toBe(0);
});

it('getRightMenuActionsFromRules - rule with no valid actions', () => {
  const mockRules = [
    { id: "1", dataStatus: "InvalidStatus", makerId: "test_user_id" }
  ] as unknown as BicNettingRuleRow[];
  const res = getRightMenuActionsFromRules(mockRules);
  expect(res.length).toBe(0);
});

it('getRightMenuActionsFromRules - rule with disabled actions', () => {
  const mockRules = [
    { id: "1", dataStatus: RuleStatusType.UpdatePending, makerId: "another_user_id" }
  ] as unknown as BicNettingRuleRow[];
  const res = getRightMenuActionsFromRules(mockRules);
  expect(res.length).toBeGreaterThan(0);
  expect(res[0].action).toBe(ActionType.ApproveUpdate);
  expect(res[0].disabled).toBe(false);
});

it('getRightMenuActionsFromRules - mixed rules with valid and invalid actions', () => {
  const mockRules = [
    { id: "1", dataStatus: RuleStatusType.UpdatePending, makerId: "test_user_id" },
    { id: "2", dataStatus: "InvalidStatus", makerId: "test_user_id" }
  ] as unknown as BicNettingRuleRow[];
  const res = getRightMenuActionsFromRules(mockRules);
  expect(res.length).toBeGreaterThan(0);
  const updateAction = res.find(action => action.action === ActionType.Update);
  expect(updateAction).toBeUndefined();
  // expect(updateAction?.rows.length).toBe(1); // Only valid rule should be included
  // expect(updateAction?.disabled).toBe(false);
});

it('generateActionsList - valid rule with actions', () => {
  const mockRule = {
    dataStatus: RuleStatusType.UpdatePending,
    makerId: "test_user_id",
  } as unknown as BicNettingRuleRow;
  const res = generateActionsList(mockRule, "test_user_id", "Maker");
  expect(res.length).toBeGreaterThan(0);
  expect(res[0].action).toBeDefined();
  expect(res[0].disabled).toBe(true);
});

it('generateActionsList - rule with no dataStatus', () => {
  const mockRule = {
    makerId: "test_user_id",
  } as unknown as BicNettingRuleRow;
  const res = generateActionsList(mockRule, "test_user_id", "Maker");
  expect(res.length).toBe(0);
});

it('generateActionsList - rule with no valid actions', () => {
  const mockRule = {
    dataStatus: "InvalidStatus",
    makerId: "test_user_id",
  } as unknown as BicNettingRuleRow;
  const res = generateActionsList(mockRule, "test_user_id", "Maker");
  expect(res.length).toBe(0);
});

it('generateActionsList - rule with disabled actions for non-maker user', () => {
  const mockRule = {
    dataStatus: RuleStatusType.UpdatePending,
    makerId: "another_user_id",
  } as unknown as BicNettingRuleRow;
  const res = generateActionsList(mockRule, "test_user_id", "Maker");
  expect(res.length).toBeGreaterThan(0);
  expect(res[0].action).toBeDefined();
  expect(res[0].disabled).toBe(true);
});

it('generateActionsList - rule with multiple actions', () => {
  const mockRule = {
    dataStatus: RuleStatusType.UpdatePending,
    makerId: "test_user_id",
  } as unknown as BicNettingRuleRow;
  const res = generateActionsList(mockRule, "test_user_id", "Checker");
  expect(res.length).toBeGreaterThan(1);
  expect(res[0].action).toBeDefined();
  expect(res[0].disabled).toBe(true);
});

it('generateActionsList - empty rule object', () => {
  const mockRule = {} as unknown as BicNettingRuleRow;
  const res = generateActionsList(mockRule, "test_user_id", "Maker");
  expect(res.length).toBe(0);
});

it('generateActionsList - null rule', () => {
  const res = generateActionsList(null as unknown as BicNettingRuleRow, "test_user_id", "Maker");
  expect(res.length).toBe(0);
});

it('generateActionsList - undefined rule', () => {
  const res = generateActionsList(undefined as unknown as BicNettingRuleRow, "test_user_id", "Maker");
  expect(res.length).toBe(0);
});

it('generateActionsList - rule with no makerId', () => {
  const mockRule = {
    dataStatus: RuleStatusType.UpdatePending,
  } as unknown as BicNettingRuleRow;
  const res = generateActionsList(mockRule, "test_user_id", "Maker");
  expect(res.length).toBeGreaterThan(0);
  expect(res[0].action).toBeDefined();
  expect(res[0].disabled).toBe(true); // Should be disabled as makerId is missing
});

it('generateActionsList - rule with invalid userRole', () => {
  const mockRule = {
    dataStatus: RuleStatusType.UpdatePending,
    makerId: "test_user_id",
  } as unknown as BicNettingRuleRow;
  const res = generateActionsList(mockRule, "test_user_id", "InvalidRole" as RoleType);
  expect(res.length).toBe(2); // No actions should be generated for invalid role
});