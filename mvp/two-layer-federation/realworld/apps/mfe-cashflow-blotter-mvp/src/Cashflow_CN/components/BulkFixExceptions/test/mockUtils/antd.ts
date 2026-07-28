import { fn } from "@Test/test-utils";
import { ModalFuncProps } from "antd";

export const mockModalApi = {
  info: function (props: ModalFuncProps): {
    destroy: () => void;
    update: (
      configUpdate:
        | ModalFuncProps
        | ((prevConfig: ModalFuncProps) => ModalFuncProps)
    ) => void;
  } & {
    then<T>(
      resolve: (confirmed: boolean) => T,
      reject: VoidFunction
    ): Promise<T>;
  } {
    return {
      destroy: fn(),
      update: fn(),
      then: fn(),
    };
  },
  success: function (props: ModalFuncProps): {
    destroy: () => void;
    update: (
      configUpdate:
        | ModalFuncProps
        | ((prevConfig: ModalFuncProps) => ModalFuncProps)
    ) => void;
  } & {
    then<T>(
      resolve: (confirmed: boolean) => T,
      reject: VoidFunction
    ): Promise<T>;
  } {
    return {
      destroy: fn(),
      update: fn(),
      then: fn(),
    };
  },
  error: function (props: ModalFuncProps): {
    destroy: () => void;
    update: (
      configUpdate:
        | ModalFuncProps
        | ((prevConfig: ModalFuncProps) => ModalFuncProps)
    ) => void;
  } & {
    then<T>(
      resolve: (confirmed: boolean) => T,
      reject: VoidFunction
    ): Promise<T>;
  } {
    return {
      destroy: fn(),
      update: fn(),
      then: fn(),
    };
  },
  warning: function (props: ModalFuncProps): {
    destroy: () => void;
    update: (
      configUpdate:
        | ModalFuncProps
        | ((prevConfig: ModalFuncProps) => ModalFuncProps)
    ) => void;
  } & {
    then<T>(
      resolve: (confirmed: boolean) => T,
      reject: VoidFunction
    ): Promise<T>;
  } {
    return {
      destroy: fn(),
      update: fn(),
      then: fn(),
    };
  },
  confirm: function (props: ModalFuncProps): {
    destroy: () => void;
    update: (
      configUpdate:
        | ModalFuncProps
        | ((prevConfig: ModalFuncProps) => ModalFuncProps)
    ) => void;
  } & {
    then<T>(
      resolve: (confirmed: boolean) => T,
      reject: VoidFunction
    ): Promise<T>;
  } {
    return {
      destroy: fn(),
      update: fn(),
      then: fn(),
    };
  },
};

export const mockMessageApi = {
  success: fn(),
  info: fn(),
  warning: fn(),
  error: fn(),
  open: fn(),
  loading: fn(),
  destroy: fn(),
};
