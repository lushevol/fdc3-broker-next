declare const useServices: () => {
  getTile: (entitlementsToken: any, data: any) => Promise<any>;
  updateTile: (entitlementsToken: any, data: any) => Promise<any>;
  verifyTile: (entitlementsToken: any, data: any) => Promise<any>;
  createTile: (entitlementsToken: any, data: any) => Promise<any>;
  deactivateTile: (entitlementsToken: any, data: any) => Promise<any>;
  getTileAudit: (entitlementsToken: any, data: any) => Promise<any>;
  getCategory: (entitlementsToken: any) => Promise<any>;
  getImportMap: (entitlementsToken: any) => Promise<any>;
};
export default useServices;
