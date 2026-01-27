/**
 * Mock Service Hook
 */
const useService = async (url: string, options: Record<string, unknown>) => {
  console.log('Mock useService called', url, options);
  return Promise.resolve({ data: { allowed: true } });
};

export default useService;
