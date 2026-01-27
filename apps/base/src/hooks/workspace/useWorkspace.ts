/**
 * Mock Workspace Hook
 */
export const addWorkspace = async (tileId: string, context: any) => {
  console.log('Mock addWorkspace called', tileId, context);
  return Promise.resolve();
};

export default {
  addWorkspace,
};
