import axios, { AxiosResponse } from "axios";

export interface BPMNServiceInstance {
  getDemoBpmnModel: <T>(id: string) => Promise<string | T>;
}

export const useService: () => BPMNServiceInstance = () => {
  const getDemoBpmnModel = async (id: string) => {
    const { data } = await axios.get<string>(
      `http://localhost:8001/api/demo/bpmn/model/${id}`
    );
    return data;
  };
  return {
    getDemoBpmnModel,
  };
};
