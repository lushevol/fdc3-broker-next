declare let __webpack_public_path__: string;
declare const __system_context__: {
  meta?: {
    url?: string;
  };
};

const developmentPort = process.env.NODE_ENV === 'development' ? process.env.port : undefined;

if (developmentPort) {
  // SystemJS can expose the host document URL as the module context while
  // loading WebKit's dynamic chunks. Keep Base-owned chunks on Base's server.
  __webpack_public_path__ = `http://localhost:${developmentPort}/`;
} else if (__system_context__?.meta?.url) {
  __webpack_public_path__ = new URL('./', __system_context__.meta.url).toString();
}
void __webpack_public_path__;

export * from './root';
