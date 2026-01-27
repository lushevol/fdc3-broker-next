export const getName = (entity) => {
  return `${entity.applicationName ?? '*'} :: ${entity.name} :: ${entity.roleName}`;
};
