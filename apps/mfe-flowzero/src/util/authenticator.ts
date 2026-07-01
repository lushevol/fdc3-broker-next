import { Hooks } from "../Root/import";
const { getHooks } = Hooks;

const X_RATANONE = "X_RATANONE";

export const getUser = () => {
  const hooks = getHooks();

  const entities = hooks.store?.entities;
  let entitlements = hooks.store?.user?.entitlements || {};
  let role =
    hooks.store?.user?.entitlement?.dataEntitlementRoles ||
    hooks.store?.user?.entitlement?.role;

  if (entities) {
    entitlements = {};
    entities.forEach((item) => {
      const entity: Record<string, string[]> = {};
      entitlements[item.name] = entity;
      item.subjects.forEach((subject) => {
        entity[subject.name] = subject.actions.map((action) => action.name);
      });
      if (item.name === X_RATANONE) {
        role = item.roleName;
      }
    });
  }

  return {
    id: hooks.store?.user?.id || "",
    name: hooks.store?.user?.fullName || "",
    role: role,
    actions: hooks.store?.user?.entitlement?.actions || [],
    entitlements: entitlements,
  };
};
