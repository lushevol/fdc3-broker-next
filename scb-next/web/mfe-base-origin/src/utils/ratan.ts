import { AxiosResponse } from "axios";

export const handleStandardResponse = <T>(response: AxiosResponse<T>) => {
  return new Promise<T>((resolve, reject) => {
    if (response.status && response.status === 200) {
      resolve(response.data);
    } else {
      reject(response.data);
    }
  });
};
