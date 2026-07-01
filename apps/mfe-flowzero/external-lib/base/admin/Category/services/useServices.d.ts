declare const useServices: () => {
  getCategory: (entitlementsToken: any) => Promise<any>;
  updateCategory: (entitlementsToken: any, data: any) => Promise<any>;
  verifyCategory: (entitlementsToken: any, data: any) => Promise<any>;
  createCategory: (entitlementsToken: any, data: any) => Promise<any>;
  deactivateCategory: (entitlementsToken: any, data: any) => Promise<any>;
  getCategoryAudit: (entitlementsToken: any, data: any) => Promise<any>;
};
export default useServices;
