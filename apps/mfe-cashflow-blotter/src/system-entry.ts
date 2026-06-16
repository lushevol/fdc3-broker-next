// __system_context__ is provided by Rspack/System.register as the second callback param.
// __webpack_public_path__ assignment for chunk resolution is handled by Rsbuild's output.assetPrefix.
// For chunk loading, the assetPrefix is set to http://localhost:{port}/ in the rsbuild config.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const __system_context__: { meta?: { url?: string } };
declare let __webpack_public_path__: string;

if (__system_context__?.meta?.url) {
  __webpack_public_path__ = new URL("./", __system_context__.meta.url).toString();
}
void __webpack_public_path__;

export * from "./root";
export { default } from "./root";
