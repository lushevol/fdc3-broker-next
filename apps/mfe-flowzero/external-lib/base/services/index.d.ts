declare const useServices: () => {
  login: (data: any) => Promise<void>;
  validate: () => Promise<any>;
  logout: () => void;
  ssePublish: (tabId: any, _payload: any) => Promise<void>;
};
export default useServices;
