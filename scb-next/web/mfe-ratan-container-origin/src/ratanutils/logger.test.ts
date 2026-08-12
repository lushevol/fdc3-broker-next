import log from 'loglevel';
import { logInit, getErrorInfo, newMethodFactory, handleMsg } from './logger';
import { CommonUtil } from "../Root/import";
const { getSessionStorage } = CommonUtil;

vi.mock('loglevel');

test('logInit', () => {
  Object.defineProperty(window, 'ratanConfig', {
    value: {
      disabledFeature: []
    },
    writable: true
  });
  logInit();
  // @ts-ignore
  window.onerror();
  expect(log.error).toBeCalled();
  // @ts-ignore
  window.onunhandledrejection({ reason: { status: 400, config: { url: "/api/ratan/v1/esLogging" } } });
  expect(log.error).toBeCalled();
  // @ts-ignore
  window.onunhandledrejection({ reason: { config: { url: "/api/ratan/v1/esLogging" }, stack: '1 \n 2 \n 3' } });
  expect(log.error).toBeCalled();
  // @ts-ignore
  window.onunhandledrejection({ reason: { config: { url: "/api/ratan/v1/esLogging" }, stack: '1 \n 2 \n 3 ApolloError' } });
  // @ts-ignore
  window.onunhandledrejection({ reason: { config: { url: "/api/ratan/v1/esLogging" } } });
  // @ts-ignore
  window.onunhandledrejection({ reason: { stack: '1 \n 2 \n 3' } });
  // @ts-ignore
  window.onunhandledrejection({ reason: {} });

  Object.defineProperty(window, 'ratanConfig', {
    value: {
      disabledFeature: ["Logger"]
    },
    writable: true
  });
  logInit();
});

test('getErrorInfo', () => {
  getErrorInfo("message stacktrace")
  getErrorInfo(`message
  stacktrace1
  stacktrace2
  stacktrace3
  `)
});

test('newMethodFactory', () => {
  newMethodFactory("put", "info", "test");
});

test('handleMsg', () => {
  Object.defineProperty(window, 'ratanConfig', {
    value: {
      disabledFeature: []
    },
    writable: true
  });

  handleMsg("put", "info", () => { })("");
  handleMsg("put", "info", () => { })({ config: { url: "/api/log/v1/esLogging" }, stack: `1 \n 2 \n 3` });
  handleMsg("put", "info", () => { })({ config: { url: "/api/log/v1/esLogging" }, stack: `1 \n 2 \n 3 ApolloError` });
  getSessionStorage().setItem('user', JSON.stringify({ id: "123" }));
  handleMsg("put", "info", () => { })({ config: { url: "/api/log/v1/esLogging" }, stack: ["ApolloError"] });
  handleMsg("put", "info", () => { })({ config: { url: "/api/log/v1/esLogging" }, stack: [`1 \n 2 \n 3`] });
  Object.defineProperty(window, 'ratanConfig', {
    value: {
      disabledFeature: ["Logger"]
    },
    writable: true
  });
  handleMsg("put", "info", () => { })("");
  handleMsg("put", "info", () => { })({ config: { url: "/api/log/v1/esLogging" }, stack: '1 \n 2 \n 3 ApolloError' });
});
