import {getProtocolWs} from ".";

test('getProtocolWs', () => {
  Object.defineProperty(window, 'location', {
    value: {
      protocol: "http:"
    },
    writable: true
  });
  expect(getProtocolWs()).toEqual("ws:");
  Object.defineProperty(window, 'location', {
    value: {
      protocol: "https:"
    },
    writable: true
  });
  expect(getProtocolWs()).toEqual("wss:");
});
