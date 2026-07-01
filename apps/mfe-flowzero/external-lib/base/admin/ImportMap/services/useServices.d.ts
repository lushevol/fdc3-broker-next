declare const useServices: () => {
  getImportMap: (entitlementsToken: any) => Promise<any>;
  updateImportMap: (entitlementsToken: any, data: any) => Promise<any>;
  verifyImportMap: (entitlementsToken: any, data: any) => Promise<any>;
  createImportMap: (entitlementsToken: any, data: any) => Promise<any>;
  deactivateImportMap: (entitlementsToken: any, data: any) => Promise<any>;
  getImportMapAudit: (entitlementsToken: any, data: any) => Promise<any>;
};
export default useServices;
