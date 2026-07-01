import React from "react";
declare const useController: () => {
  username: string | undefined;
  setUsername: React.Dispatch<React.SetStateAction<string | undefined>>;
  password: string | undefined;
  setPassword: React.Dispatch<React.SetStateAction<string | undefined>>;
  onLogin: (data: any) => Promise<void>;
  onLoginUserNamePassword: () => void;
  handleChange: (_event: React.SyntheticEvent, newValue: number) => void;
  value: number;
  onKeyUp: (e: any) => void;
  loading: boolean;
  showNormalLogin: boolean;
  onKeyUpPassword: (e: any) => void;
};
export default useController;
