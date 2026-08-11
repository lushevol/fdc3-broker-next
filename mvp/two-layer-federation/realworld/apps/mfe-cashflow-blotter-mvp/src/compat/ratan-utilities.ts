import { Hooks } from "./base";

interface LegacyUser {
  readonly id?: string;
  readonly name?: string;
  readonly role?: string;
  readonly actions?: string[];
  readonly entitlements?: LegacyEntitlements;
}

type LegacyEntitlements = Record<string, Record<string, string[]>>;

interface SourceUser {
  readonly id?: string;
  readonly fullName?: string;
  readonly entitlement?: {
    readonly actions?: string[];
    readonly dataEntitlementRoles?: string;
    readonly role?: string;
  };
  readonly entitlements?: LegacyEntitlements;
}

interface SourceEntity {
  readonly name: string;
  readonly roleName?: string;
  readonly subjects: readonly {
    readonly name: string;
    readonly actions: readonly { readonly name: string }[];
  }[];
}

interface SourceStore {
  readonly user?: SourceUser;
  readonly entities?: readonly SourceEntity[];
}

export const getUser = (): LegacyUser => {
  const { store } = Hooks.getHooks() as unknown as { store?: SourceStore };
  const user = store?.user;
  let entitlements = user?.entitlements;
  let role =
    user?.entitlement?.dataEntitlementRoles ?? user?.entitlement?.role;

  if (store?.entities) {
    const entityEntitlements: LegacyEntitlements = {};
    store.entities.forEach((entity) => {
      entityEntitlements[entity.name] = {};
      entity.subjects.forEach((subject) => {
        entityEntitlements[entity.name][subject.name] = subject.actions.map(
          (action) => action.name,
        );
      });
      if (entity.name === "X_RATANONE") role = entity.roleName;
    });
    entitlements = entityEntitlements;
  }

  return {
    id: user?.id,
    name: user?.fullName,
    role,
    actions: user?.entitlement?.actions,
    entitlements,
  };
};

export const hasPermission = (permission: string): boolean => {
  const user = getUser();
  if (user.actions?.includes(permission)) return true;

  const [subject, action] = permission.split(":");
  const entitlements = user.entitlements;
  if (!entitlements) return false;

  const ratanOneEntityName = Object.keys(entitlements).find((name) =>
    name.includes("X_RATANONE"),
  );
  if (ratanOneEntityName) {
    const availableActions =
      entitlements[ratanOneEntityName]?.[subject] ?? [];
    return availableActions.includes(action);
  }

  const legacyEntityName = Object.keys(entitlements).find((name) =>
    name.includes(subject),
  );
  if (!legacyEntityName) return false;

  const entity = entitlements[legacyEntityName];
  const key = subject === "RATAN_SETTLEMENT_STP_RULE"
    ? "RATAN Settlement NSTP Rule"
    : Object.keys(entity).find(
      (name) => name.toLocaleUpperCase().replace(/\s/g, "_") === subject,
    );
  return key ? (entity[key] as string[]).includes(action) : false;
};

export const getEnable = (name: string, page?: string): boolean => {
  const config = window.ratanConfig ?? {};
  if (!config.disabledFeature?.includes(name)) return true;

  const enabledUsers = config.enableFeatureForUser?.[name] as
    | string[]
    | undefined;
  const enabledPages = config.enableFeatureForPage?.[name] as
    | string[]
    | undefined;
  const userEnabled = enabledUsers?.includes(getUser().id ?? "");
  const pageEnabled = page ? enabledPages?.includes(page) : undefined;

  return userEnabled === true || pageEnabled === true;
};

type LogMethod = (...args: unknown[]) => void;

const bindConsole = (method: "debug" | "error" | "info" | "trace" | "warn"):
LogMethod => (...args) => console[method](...args);

export const logger = {
  debug: bindConsole("debug"),
  error: bindConsole("error"),
  info: bindConsole("info"),
  trace: bindConsole("trace"),
  warn: bindConsole("warn"),
};

export const logInit = (): void => {
  if (!getEnable("Logger")) return;
  window.addEventListener("error", (event) => logger.error(event.error));
  window.addEventListener("unhandledrejection", (event) =>
    logger.error(event.reason),
  );
};
