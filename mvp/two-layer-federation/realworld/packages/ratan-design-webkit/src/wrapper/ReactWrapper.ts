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
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/breadcrumb/breadcrumb.js';
import '@shoelace-style/shoelace/dist/components/breadcrumb-item/breadcrumb-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/carousel/carousel.js';
import '@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/popup/popup.js';
import '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.js';
import '@shoelace-style/shoelace/dist/components/radio/radio.js';
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';
import '@shoelace-style/shoelace/dist/components/rating/rating.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/tree/tree.js';
import '@shoelace-style/shoelace/dist/components/tree-item/tree-item.js';
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
  const exportedClass = WebComponents[
    componentName as keyof typeof WebComponents
  ] as CustomElementConstructor | undefined;
  if (!exportedClass) {
    throw new Error(`Web Component ${WC} is not exported by the component catalog.`);
  }
  (exportedClass as CustomElementConstructor & { finalize?: () => void }).finalize?.();

  return createComponentByLit({
    tagName: WC,
    elementClass: exportedClass,
    react: React as any,
    events,
  }) as React.ComponentType<any>;
};
