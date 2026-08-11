/**
 * Usage steps:
 * import { ReactWrapper } from '../../src/wrapper/ReactWrapper';
 * import '../../elements/sc-button';
 * const WrapperButton = ReactWrapper('sc-button');
 * return (
 *  <WrapperButton
 *    className={className}
 *    type={type}
 *    onClick={onClick}
 *  >
 *    Click button
 *  </WrapperButton>
 * )
 */
import React from "react";
import { createComponent as createComponentByLit } from "@lit/react";
import * as WebComponents from "../index.js";
import { CUSTOM_EVENTS } from "../shared/sc-custom-events.js";
import "../../elements/index.js";

export const createComponent = (
  WC: string,
): React.ComponentType<Record<string, unknown>> => {
  const reg = /(-[a-z])/g;
  const str = WC.replace(reg, function (a, b) {
    return `${b[1].toUpperCase()}`;
  });
  const componentName: any = `Sc${str.substr(2)}`;
  const events: any = {};
  Object.keys(CUSTOM_EVENTS).forEach(event => {
    const name = event.replace(reg, function (a, b) {
      return `${b[1].toUpperCase()}`;
    });
    events[`on${name[0].toUpperCase()}${name.substr(1)}`] = event;
  });
  const elementClass =
    window.customElements.get(WC) || (WebComponents as any)[componentName];
  if (!elementClass) {
    throw new Error(
      `Web Component ${WC} is not defined. Make sure it is imported.`,
    );
  }

  return createComponentByLit({
    tagName: WC,
    elementClass,
    react: React,
    events,
  }) as unknown as React.ComponentType<Record<string, unknown>>;
};
