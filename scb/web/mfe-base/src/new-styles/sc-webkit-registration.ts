/** Preserve host registration while excluding tests from Webpack's import context. */
export function loadScWebkitElement(component: string) {
  return import(
    /* webpackInclude: /sc-[a-z-]+\.ts$/ */
    `../components/ScWebkit/${component}`
  );
}
