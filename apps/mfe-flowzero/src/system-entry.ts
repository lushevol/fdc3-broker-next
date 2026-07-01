declare let __webpack_public_path__: string;
declare const __system_context__: {
  meta?: {
    url?: string;
  };
};

if (__system_context__?.meta?.url) {
  __webpack_public_path__ = new URL("./", __system_context__.meta.url).toString();
}
void __webpack_public_path__;

export * from "./root";
export { default } from "./root";
