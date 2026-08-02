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
import React from 'react';
import { createComponent as createComponentByLit } from '@lit/react';
import '../../elements/index.js';
import * as WebComponents from '../index.js';
import { CUSTOM_EVENTS } from '../shared/sc-custom-events.js';

export const createComponent = (WC: string): React.ComponentType<any> => {
  const reg = /(-[a-z])/g;
  const str = WC.replace(reg, function (a, b) {
    return `${b[1].toUpperCase()}`;
  });
  const componentName = `${str[0].toUpperCase()}${str.slice(1)}`;
  const events: any = {};
  Object.keys(CUSTOM_EVENTS).forEach((event) => {
    const name = event.replace(reg, function (a, b) {
      return `${b[1].toUpperCase()}`;
    });
    events[`on${name[0].toUpperCase()}${name.substr(1)}`] = event;
  });
  const elementClass = WebComponents[
    componentName as keyof typeof WebComponents
  ] as CustomElementConstructor | undefined;
  if (!elementClass) {
    throw new Error(`Web Component ${WC} is not exported by the component catalog.`);
  }

  return createComponentByLit({
    tagName: WC,
    elementClass,
    react: React as any,
    events,
  }) as React.ComponentType<any>;
};
