import { useService } from "src/service";

const CaseManager = async (id: string) => {
  const { getDemoBpmnModel } = useService();
  const data = await getDemoBpmnModel<string>(id);
  return data;
};

export default CaseManager;
