import { ActionType } from "../../state/types";
import { mockUtilizationRules } from "../../test/mock/mockRules";
import {
  generateActionsList,
  getActionButtonProps,
  getDetailsActionsRule,
  getRightMenuActionsFromRules,
} from "./utils";

it("getActionButtonProps", () => {
  const res = getActionButtonProps(ActionType.Update);
  expect(res.danger).toBe(false);
  expect(res.type).toBe("primary");
});

it("getRightMenuActionsFromRules", () => {
  const res = getRightMenuActionsFromRules(mockUtilizationRules);
  expect(res.length).toBe(2);
  expect(res[0].action).toBe(ActionType.Delete);
  expect(res[0].disabled).toBe(false);
});

it("getDetailsActionsRule", () => {
  const res = getDetailsActionsRule(mockUtilizationRules[0]);
  expect(res.length).toBe(2);
  expect(res[0].action).toBe(ActionType.Delete);
  expect(res[0].disabled).toBe(false);
});

it("generateActionsList", () => {
  const res = generateActionsList(
    mockUtilizationRules[0],
    "test_user_id",
    "Maker"
  );
  expect(res.length).toBe(2);
  expect(res[0].action).toBe(ActionType.Delete);
  expect(res[0].disabled).toBe(false);
});
