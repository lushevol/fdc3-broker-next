import { Service, CommonUtil } from "../Root/import";
const { service } = Service;
import { getEnable } from "./componentEnabling";
const logApi = "/api/ratan/v1/esLogging";

// Create a minimal console-based logger as default
const makeLogger = (name?: string) => {
  const noop = (..._args: any[]) => {};
  const methods: Record<string, any> = {};
  for (const m of ["trace", "debug", "info", "warn", "error"]) {
    methods[m] = name ? console[m]?.bind(console, `[${name}]`) ?? noop : console[m]?.bind(console) ?? noop;
  }
  methods.methodFactory = null;
  methods.enableAll = noop;
  methods.disableAll = noop;
  methods.setLevel = noop;
  methods.setDefaultLevel = noop;
  methods.getLevel = () => 2;
  methods.getLogger = (n: string) => makeLogger(n);
  return methods;
};

// Try to get real loglevel, fall back to console if not available
let _log: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const raw = require("loglevel");
  // In System.register output, CJS module.exports may be wrapped
  _log = raw && typeof raw.enableAll === "function" ? raw : null;
  if (!_log && raw && raw.default && typeof raw.default.enableAll === "function") {
    _log = raw.default;
  }
} catch {
  _log = null;
}
const log = _log || makeLogger();

export const getErrorInfo = (stack: string) => {
  const lines = stack.split("\n");
  const message = lines.splice(0, 1)[0];
  let stacktrace = "";
  if (lines.length > 2) {
    const shrink = lines.splice(0, 2);
    stacktrace = shrink.join("\n");
    stacktrace += `\n    and ${lines.length} more`;
  } else {
    stacktrace = lines.join("\n");
  }
  return {
    message,
    stacktrace,
  };
};

const originalFactory = log.methodFactory;
export const handleMsg = (methodName, loggerName, rawMethod) => (msg) => {
  if (getEnable("Logger")) {
    const timestamp = new Date().toISOString();
    const { getSessionStorage, getEnv } = CommonUtil;
    const user = getSessionStorage().getItem("user");
    if (getEnv() !== "UAT" && msg) {
      const msgStr = typeof msg === "object" ? msg.stack.toString() : msg;
      const { message, stacktrace } = getErrorInfo(msgStr);
      service.post(
        `${logApi}/${ratanConfig.REACT_APP_SERVER_ENV}/${methodName}`,
        {
          env: ratanConfig.REACT_APP_SERVER_ENV,
          level: methodName,
          logger: loggerName,
          message,
          userId: user ? JSON.parse(user).id : "",
          stacktrace,
          timestamp,
        }
      );
    }
  }
  rawMethod();
};
export const newMethodFactory = (methodName, logLevel, loggerName) => {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);
  return handleMsg(methodName, loggerName, rawMethod);
};
if (originalFactory) {
  log.methodFactory = newMethodFactory;
}
log.enableAll();
export const logInit = () => {
  if (getEnable("Logger")) {
    window.onerror = (message, url, line, column, error) => {
      log.error(error);
    };
    window.onunhandledrejection = (e: any) => {
      const reason = e.reason;
      if (!reason?.config || !reason?.config.url.includes(logApi)) {
        if (!reason.stack?.includes("ApolloError")) {
          log.error(reason.stack);
        }
      }
    };
  }
};

export const logger = log.getLogger(document.title || "Ratan One");
