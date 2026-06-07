import { Modal } from "antd";
import { ModalFuncProps } from "antd/lib/modal";

import { logger } from "./logger";

// Error type
interface ErrorType {
  name: string;
  modal: ModalFuncProps;
}
export const FIELDS_CONFIG_NOT_AVAILABLE: ErrorType = {
  name: "FIELDS_CONFIG_NOT_AVAILABLE",
  modal: {
    title: "Data Error",
    content: "No fields available in fields config",
  },
};
export const FIELDS_CONFIG_VERSION: ErrorType = {
  name: "FIELDS_CONFIG_VERSION",
  modal: {
    title: "Data Error",
    content: "The field version needs to be updated",
  },
};

const errorStore = new Map<string, Function[]>();

// handle error
export const useHandleError = (errorType: ErrorType, callback: Function) => {
  const errorFunctions = errorStore.get(errorType.name) || [];
  errorStore.set(errorType.name, [...errorFunctions, callback]);
};

export const triggerError = (errorType: ErrorType) => {
  const errorFunctions = errorStore.get(errorType.name) || [];
  errorFunctions.forEach((item: Function) => item());
  Modal.error(errorType.modal);
  logger.error(new Error(FIELDS_CONFIG_NOT_AVAILABLE.modal.toString()));
};
