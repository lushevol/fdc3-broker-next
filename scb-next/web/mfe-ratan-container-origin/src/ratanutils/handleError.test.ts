import { useHandleError, triggerError } from './handleError';

test('useHandleError', () => {
  Object.defineProperty(window, 'ratanConfig', {
    value: {
      disabledFeature: [],
      REACT_APP_SERVER_ENV: "local"
    },
    writable: true
  });
  const callback = vi.fn();
  useHandleError({ name: 'test', modal: { title: 'error' } }, callback);
  triggerError({ name: 'test', modal: { title: 'error' } });
  triggerError({ name: 'test1', modal: { title: 'error' } });
  expect(callback).toBeCalled();
});
