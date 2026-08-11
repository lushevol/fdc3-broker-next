import { Entity } from "../../../hooks/model/root";
import { AdminRecord } from "../interface";

export const getAdminModuleEms2Role = (entities: Entity[] | []) => {
  const index = entities.findIndex(
    (entity: Entity) => entity.name === "FMO PORTAL ADMIN"
  );
  if (index >= 0) {
    return entities[index].roleName;
  }
  return undefined;
};

export const onResetUtil = (
  data: AdminRecord[],
  record: AdminRecord,
  setRecord: (record: AdminRecord) => void,
  setResetId: (resetId: number) => void
) => {
  const index = data.findIndex((i) => i.id === record.id);
  if (index >= 0) {
    const temp = JSON.parse(JSON.stringify(data[index])) as AdminRecord;
    setRecord(temp);
    setResetId(new Date().getTime());
  }
};
