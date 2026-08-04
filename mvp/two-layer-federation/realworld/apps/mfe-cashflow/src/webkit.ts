import { createComponent } from '@scdevkit/webkit/react';
import type { ComponentType } from 'react';

type WebKitReactComponent = ComponentType<Record<string, unknown>>;

const reactComponent = (tagName: string): WebKitReactComponent =>
  createComponent(tagName) as unknown as WebKitReactComponent;

export const ScAlert = reactComponent('sc-alert');
export const ScBadge = reactComponent('sc-badge');
export const ScButton = reactComponent('sc-button');
export const ScDialog = reactComponent('sc-dialog');
export const ScParagraph = reactComponent('sc-paragraph');
export const ScIconButton = reactComponent('sc-icon-button');
export const ScTextInput = reactComponent('sc-text-input');
export const ScTitle = reactComponent('sc-title');
