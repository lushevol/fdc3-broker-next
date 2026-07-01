export const mockRequestIdleCallback = () => {
  window.requestIdleCallback = jest.fn((cb) => {
    cb({
      didTimeout: false,
      timeRemaining: function (): number {
        return 0;
      },
    });
    return 100;
  });
};
