import { Entity } from "../../hooks/model/root";

export const getName = (entity: Entity) => {
  return `${entity.applicationName ?? "*"} :: ${entity.name} :: ${
    entity.roleName
  }`;
};
